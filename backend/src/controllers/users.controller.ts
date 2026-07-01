import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import mongoose from "mongoose";

import { User } from "../models/User.js";
import { HttpError } from "../middleware/error-handler.js";
import { hashPassword } from "../utils/password.js";

function normalizeEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

/** POST /users — register a new user. */
export async function createUser(req: Request, res: Response): Promise<void> {
  const { username, email, phone, password, userId, image } = req.body ?? {};

  const normalizedEmail = normalizeEmail(email);

  if (!username || !normalizedEmail || !password) {
    throw new HttpError(400, "username, email and password are required");
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const hashedPassword = await hashPassword(String(password));

  const created = await User.create({
    userId: userId ? String(userId) : randomUUID(),
    username: String(username),
    email: normalizedEmail,
    phone: phone ? String(phone) : "",
    image: image ? String(image) : "",
    password: hashedPassword,
  });

  res.status(201).json(created.toJSON());
}

/** GET /users?email= — lookup used by login/NextAuth and signup duplicate check. */
export async function getUsers(req: Request, res: Response): Promise<void> {
  const email = normalizeEmail(req.query.email);

  if (!email) {
    const users = await User.find().limit(100);
    res.json(users);
    return;
  }

  const users = await User.find({ email });
  res.json(users);
}

/** PUT /users/:id — update profile / login (email, username, password, ...). */
export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { username, email, phone, password, image } = req.body ?? {};

  const update: Record<string, unknown> = {};

  // Only overwrite fields that are actually provided (non-empty), so a blank
  // input never wipes existing data (e.g. avatar-only profile update).
  if (typeof username === "string" && username.trim()) {
    update.username = username;
  }
  if (typeof phone === "string" && phone.trim()) update.phone = phone.trim();
  if (typeof image === "string" && image.trim()) update.image = image;

  if (typeof email === "string" && email.trim()) {
    const normalizedEmail = normalizeEmail(email);
    const owner = await User.findOne({ email: normalizedEmail });
    if (owner && String(owner._id) !== id && owner.userId !== id) {
      throw new HttpError(409, "An account with this email already exists");
    }
    update.email = normalizedEmail;
  }

  if (typeof password === "string" && password.length > 0) {
    update.password = await hashPassword(password);
  }

  const filter = mongoose.isValidObjectId(id)
    ? { $or: [{ _id: id }, { userId: id }] }
    : { userId: id };

  const updated = await User.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new HttpError(404, "User not found");
  }

  res.json(updated.toJSON());
}
