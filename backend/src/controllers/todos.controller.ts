import type { Request, Response } from "express";
import mongoose from "mongoose";

import { HttpError } from "../middleware/error-handler.js";
import { getActorUserId } from "../middleware/internal-auth.js";
import { Todo } from "../models/Todo.js";

const TODO_TITLE_MAX_LENGTH = 200;
const PATCH_FIELDS = new Set(["title", "completed"]);

function readBody(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Invalid request");
  }

  return body as Record<string, unknown>;
}

function normalizeTitle(value: unknown): string {
  if (typeof value !== "string") {
    throw new HttpError(400, "title must be a string");
  }

  const title = value.trim();
  if (!title) {
    throw new HttpError(400, "title is required");
  }
  if (title.length > TODO_TITLE_MAX_LENGTH) {
    throw new HttpError(
      400,
      `title must be at most ${TODO_TITLE_MAX_LENGTH} characters`,
    );
  }

  return title;
}

function readTodoId(req: Request): string {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new HttpError(400, "Invalid todo id");
  }

  return id;
}

function readTodoUpdate(body: unknown): Record<string, string | boolean> {
  const input = readBody(body);
  const keys = Object.keys(input);
  if (
    keys.length === 0 ||
    keys.some((key) => !PATCH_FIELDS.has(key))
  ) {
    throw new HttpError(400, "Only title and completed can be updated");
  }

  const update: Record<string, string | boolean> = {};
  if ("title" in input) {
    update.title = normalizeTitle(input.title);
  }
  if ("completed" in input) {
    if (typeof input.completed !== "boolean") {
      throw new HttpError(400, "completed must be a boolean");
    }
    update.completed = input.completed;
  }

  return update;
}

/** GET /todo — list tasks for the authenticated actor, newest first. */
export async function getTodos(_req: Request, res: Response): Promise<void> {
  const userId = getActorUserId(res);
  const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
  res.json(todos);
}

/** POST /todo — create a task owned by the authenticated actor. */
export async function createTodo(req: Request, res: Response): Promise<void> {
  const userId = getActorUserId(res);
  const input = readBody(req.body);
  const title = normalizeTitle(input.title);
  const created = await Todo.create({ title, userId });

  res.status(201).json(created);
}

/** GET /todo/:id — return one owner-scoped task. */
export async function getTodo(req: Request, res: Response): Promise<void> {
  const userId = getActorUserId(res);
  const id = readTodoId(req);
  const todo = await Todo.findOne({ _id: id, userId });
  if (!todo) {
    throw new HttpError(404, "Todo not found");
  }

  res.json(todo);
}

/** PATCH /todo/:id — update allowlisted fields on an owner-scoped task. */
export async function updateTodo(req: Request, res: Response): Promise<void> {
  const userId = getActorUserId(res);
  const id = readTodoId(req);
  const update = readTodoUpdate(req.body);
  const todo = await Todo.findOneAndUpdate(
    { _id: id, userId },
    { $set: update },
    { new: true, runValidators: true },
  );
  if (!todo) {
    throw new HttpError(404, "Todo not found");
  }

  res.json(todo);
}

/** DELETE /todo/:id — delete an owner-scoped task. */
export async function deleteTodo(req: Request, res: Response): Promise<void> {
  const userId = getActorUserId(res);
  const id = readTodoId(req);
  const todo = await Todo.findOneAndDelete({ _id: id, userId });
  if (!todo) {
    throw new HttpError(404, "Todo not found");
  }

  res.json(todo);
}
