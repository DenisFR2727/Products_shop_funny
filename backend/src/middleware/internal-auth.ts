import { createHash, timingSafeEqual } from "node:crypto";

import type { RequestHandler, Response } from "express";

const ACTOR_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function secretsMatch(received: string, expected: string): boolean {
  return timingSafeEqual(digest(received), digest(expected));
}

function readBearerToken(authorization: string | undefined): string | null {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

function rejectUnauthorized(res: Response): void {
  res.status(401).json({ message: "Unauthorized" });
}

export function createInternalAuth(expectedSecret: string): RequestHandler {
  if (!expectedSecret) {
    throw new Error("Internal API secret is required");
  }

  return (req, res, next) => {
    const token = readBearerToken(req.get("authorization"));
    const userId = req.get("x-user-id")?.trim() ?? "";

    if (
      !token ||
      !secretsMatch(token, expectedSecret) ||
      !ACTOR_ID_PATTERN.test(userId)
    ) {
      rejectUnauthorized(res);
      return;
    }

    res.locals.userId = userId;
    next();
  };
}

export function getActorUserId(res: Response): string {
  const userId: unknown = res.locals.userId;
  if (typeof userId !== "string" || !ACTOR_ID_PATTERN.test(userId)) {
    throw new Error("Authenticated actor context is missing");
  }

  return userId;
}
