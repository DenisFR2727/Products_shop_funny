import { Router } from "express";

import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "../controllers/todos.controller.js";
import { createInternalAuth } from "../middleware/internal-auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export function createTodosRouter(internalApiSecret: string): Router {
  const router = Router();

  router.use(createInternalAuth(internalApiSecret));
  router.get("/", asyncHandler(getTodos));
  router.post("/", asyncHandler(createTodo));
  router.get("/:id", asyncHandler(getTodo));
  router.patch("/:id", asyncHandler(updateTodo));
  router.delete("/:id", asyncHandler(deleteTodo));

  return router;
}
