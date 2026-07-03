import type { Request, Response } from "express";

import { Review } from "../models/Review.js";
import { HttpError } from "../middleware/error-handler.js";

const NAME_PATTERN = /^[a-zA-Zа-яА-Я\s]+$/;

function validateReviewInput(nameUser: unknown, text: unknown): void {
  const name = typeof nameUser === "string" ? nameUser.trim() : "";
  const body = typeof text === "string" ? text.trim() : "";

  if (!name) {
    throw new HttpError(400, "nameUser is required");
  }

  if (!NAME_PATTERN.test(name)) {
    throw new HttpError(400, "nameUser must only contain letters");
  }

  if (!body) {
    throw new HttpError(400, "text is required");
  }

  if (body.length < 10) {
    throw new HttpError(400, "text must be at least 10 characters");
  }
}

/** GET /reviews — list all reviews (newest first). */
export async function getReviews(_req: Request, res: Response): Promise<void> {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
}

/** POST /reviews — create a review. */
export async function createReview(req: Request, res: Response): Promise<void> {
  const { nameUser, text, date } = req.body ?? {};

  validateReviewInput(nameUser, text);

  const created = await Review.create({
    nameUser: String(nameUser).trim(),
    text: String(text).trim(),
    date:
      typeof date === "string" && date.trim()
        ? date.trim()
        : new Date().toISOString(),
  });

  res.status(201).json(created.toJSON());
}
