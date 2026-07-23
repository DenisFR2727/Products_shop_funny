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
const originalCreate = Todo.create;

afterEach(() => {
  Todo.create = originalCreate;
});

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use("/todo", createTodosRouter(SECRET));
  app.use(errorHandler);

  return app;
}

test("creates a canonical task for the authenticated actor", async () => {
  let persisted: Record<string, unknown> | null = null;
  const canonical = {
    id: "507f1f77bcf86cd799439011",
    title: "Task title",
    userId: "user-a",
    createAt: "2026-07-24T00:00:00.000Z",
    completed: false,
  };

  Todo.create = (async (input: Record<string, unknown>) => {
    persisted = input;
    return { toJSON: () => canonical };
  }) as typeof Todo.create;

  const server = await startTestServer(createTestApp());
  try {
    const result = await requestJson<typeof canonical>(server.baseUrl, "/todo", {
      method: "POST",
      headers: actorHeaders(SECRET, "user-a"),
      body: JSON.stringify({
        title: "  Task title  ",
        userId: "user-b",
        completed: true,
        createAt: "2000-01-01T00:00:00.000Z",
      }),
    });

    assert.equal(result.status, 201);
    assert.deepEqual(result.body, canonical);
    assert.deepEqual(persisted, { title: "Task title", userId: "user-a" });
  } finally {
    await server.close();
  }
});

test("rejects empty and overlong titles", async () => {
  let calls = 0;
  Todo.create = (async () => {
    calls += 1;
    throw new Error("must not persist");
  }) as typeof Todo.create;

  const server = await startTestServer(createTestApp());
  try {
    for (const title of ["   ", "x".repeat(201)]) {
      const result = await requestJson<{ message: string }>(
        server.baseUrl,
        "/todo",
        {
          method: "POST",
          headers: actorHeaders(SECRET, "user-a"),
          body: JSON.stringify({ title }),
        },
      );
      assert.equal(result.status, 400);
    }

    assert.equal(calls, 0);
  } finally {
    await server.close();
  }
});

test("Todo model applies owner, title, and completion defaults", () => {
  const todo = new Todo({ title: "  Model task  ", userId: "user-a" });
  const error = todo.validateSync();

  assert.equal(error, undefined);
  assert.equal(todo.title, "Model task");
  assert.equal(todo.completed, false);
  assert.equal(todo.userId, "user-a");
});
