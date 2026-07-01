import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  // Errors from express/body-parser carry a numeric status (e.g. malformed JSON → 400).
  if (error && typeof error === "object" && "status" in error) {
    const status = Number((error as { status: unknown }).status);
    if (Number.isInteger(status) && status >= 400 && status < 500) {
      res.status(status).json({ message: "Invalid request" });
      return;
    }
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ message: "Internal server error" });
}
