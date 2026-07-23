import assert from "node:assert/strict";
import test from "node:test";

import express from "express";

import { createInternalAuth } from "../src/middleware/internal-auth.js";
import { requestJson, startTestServer } from "./test-helpers.js";

const SECRET = "test-internal-secret-with-sufficient-length";

function createTestApp() {
  const app = express();
  app.get("/protected", createInternalAuth(SECRET), (_req, res) => {
    res.json({ userId: res.locals.userId });
  });

  return app;
}

test("rejects a missing bearer secret", async () => {
  const server = await startTestServer(createTestApp());

  try {
    const result = await requestJson<{ message: string }>(
      server.baseUrl,
      "/protected",
      { headers: { "X-User-Id": "user-a" } },
    );

    assert.equal(result.status, 401);
    assert.equal(result.body.message, "Unauthorized");
  } finally {
    await server.close();
  }
});

test("rejects an invalid bearer secret", async () => {
  const server = await startTestServer(createTestApp());

  try {
    const result = await requestJson<{ message: string }>(
      server.baseUrl,
      "/protected",
      {
        headers: {
          Authorization: "Bearer invalid",
          "X-User-Id": "user-a",
        },
      },
    );

    assert.equal(result.status, 401);
  } finally {
    await server.close();
  }
});

test("rejects a missing actor identity", async () => {
  const server = await startTestServer(createTestApp());

  try {
    const result = await requestJson<{ message: string }>(
      server.baseUrl,
      "/protected",
      { headers: { Authorization: `Bearer ${SECRET}` } },
    );

    assert.equal(result.status, 401);
  } finally {
    await server.close();
  }
});

test("stores a verified actor identity in response locals", async () => {
  const server = await startTestServer(createTestApp());

  try {
    const result = await requestJson<{ userId: string }>(
      server.baseUrl,
      "/protected",
      {
        headers: {
          Authorization: `Bearer ${SECRET}`,
          "X-User-Id": "user-a",
        },
      },
    );

    assert.equal(result.status, 200);
    assert.equal(result.body.userId, "user-a");
  } finally {
    await server.close();
  }
});
