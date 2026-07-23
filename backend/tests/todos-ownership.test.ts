import assert from "node:assert/strict";
import test, { afterEach } from "node:test";

import express from "express";

import { errorHandler } from "../src/middleware/error-handler.js";
import { Todo } from "../src/models/Todo.js";
import { createTodosRouter } from "../src/routes/todos.routes.js";
import {
  actorHeaders,
  requestJson,
  startTestServer,
} from "./test-helpers.js";

const SECRET = "test-internal-secret-with-sufficient-length";
const TODO_ID = "507f1f77bcf86cd799439011";
const originalFindOne = Todo.findOne;
const originalFindOneAndUpdate = Todo.findOneAndUpdate;
const originalFindOneAndDelete = Todo.findOneAndDelete;

afterEach(() => {
  Todo.findOne = originalFindOne;
  Todo.findOneAndUpdate = originalFindOneAndUpdate;
  Todo.findOneAndDelete = originalFindOneAndDelete;
});

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use("/todo", createTodosRouter(SECRET));
  app.use(errorHandler);
  return app;
}

test("scopes get, patch, and delete by both task id and actor", async () => {
  const filters: unknown[] = [];
  Todo.findOne = ((filter: unknown) => {
    filters.push(filter);
    return Promise.resolve(null);
  }) as typeof Todo.findOne;
  Todo.findOneAndUpdate = ((filter: unknown) => {
    filters.push(filter);
    return Promise.resolve(null);
  }) as typeof Todo.findOneAndUpdate;
  Todo.findOneAndDelete = ((filter: unknown) => {
    filters.push(filter);
    return Promise.resolve(null);
  }) as typeof Todo.findOneAndDelete;

  const server = await startTestServer(createTestApp());
  try {
    const headers = actorHeaders(SECRET, "user-b");
    const getResult = await requestJson<{ message: string }>(
      server.baseUrl,
      `/todo/${TODO_ID}`,
      { headers },
    );
    const patchResult = await requestJson<{ message: string }>(
      server.baseUrl,
      `/todo/${TODO_ID}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ completed: true }),
      },
    );
    const deleteResult = await requestJson<{ message: string }>(
      server.baseUrl,
      `/todo/${TODO_ID}`,
      { method: "DELETE", headers },
    );

    assert.equal(getResult.status, 404);
    assert.equal(patchResult.status, 404);
    assert.equal(deleteResult.status, 404);
    assert.deepEqual(filters, [
      { _id: TODO_ID, userId: "user-b" },
      { _id: TODO_ID, userId: "user-b" },
      { _id: TODO_ID, userId: "user-b" },
    ]);
  } finally {
    await server.close();
  }
});

test("rejects malformed ids and disallowed patch fields", async () => {
  const server = await startTestServer(createTestApp());
  try {
    const headers = actorHeaders(SECRET, "user-a");
    const malformed = await requestJson<{ message: string }>(
      server.baseUrl,
      "/todo/not-an-object-id",
      { headers },
    );
    const ownerOverride = await requestJson<{ message: string }>(
      server.baseUrl,
      `/todo/${TODO_ID}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ userId: "user-b" }),
      },
    );

    assert.equal(malformed.status, 400);
    assert.equal(ownerOverride.status, 400);
  } finally {
    await server.close();
  }
});
