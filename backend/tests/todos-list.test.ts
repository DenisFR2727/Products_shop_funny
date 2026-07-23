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
const originalFind = Todo.find;

afterEach(() => {
  Todo.find = originalFind;
});

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use("/todo", createTodosRouter(SECRET));
  app.use(errorHandler);
  return app;
}

test("lists only the actor tasks newest first", async () => {
  const todos = [
    {
      id: "507f1f77bcf86cd799439012",
      title: "Newest",
      userId: "user-a",
      createAt: "2026-07-24T02:00:00.000Z",
      completed: false,
    },
    {
      id: "507f1f77bcf86cd799439011",
      title: "Older",
      userId: "user-a",
      createAt: "2026-07-24T01:00:00.000Z",
      completed: false,
    },
  ];
  let filter: unknown;
  let sort: unknown;

  Todo.find = ((nextFilter: unknown) => {
    filter = nextFilter;
    return {
      sort(nextSort: unknown) {
        sort = nextSort;
        return Promise.resolve(todos);
      },
    };
  }) as typeof Todo.find;

  const server = await startTestServer(createTestApp());
  try {
    const result = await requestJson<typeof todos>(server.baseUrl, "/todo", {
      headers: actorHeaders(SECRET, "user-a"),
    });

    assert.equal(result.status, 200);
    assert.deepEqual(result.body, todos);
    assert.deepEqual(filter, { userId: "user-a" });
    assert.deepEqual(sort, { createdAt: -1 });
  } finally {
    await server.close();
  }
});

test("returns an empty array when the actor has no tasks", async () => {
  Todo.find = (() => ({
    sort: () => Promise.resolve([]),
  })) as typeof Todo.find;

  const server = await startTestServer(createTestApp());
  try {
    const result = await requestJson<unknown[]>(server.baseUrl, "/todo", {
      headers: actorHeaders(SECRET, "user-empty"),
    });

    assert.equal(result.status, 200);
    assert.deepEqual(result.body, []);
  } finally {
    await server.close();
  }
});
