"use server";

import type { Todo } from "@/components/todo/types";
import { updateTodoPatch } from "@/lib/api/todo";
import { validateTodoTitle } from "./valid-todos";
import { runTodoMutation } from "./todo-action-helpers";

export type UpdateTodoState = {
  errors: string[] | null;
  todo?: Todo;
};

export async function updateTodoById(
  todoId: string,
  rawTitle: string,
): Promise<UpdateTodoState> {
  const validation = validateTodoTitle(rawTitle);

  if (!validation.ok) {
    return { errors: validation.errors };
  }

  return runTodoMutation(
    todoId,
    "update",
    async (_todo, userId) =>
      updateTodoPatch(todoId, userId, { title: validation.title }),
    "Failed to update todo:",
  );
}

export async function updateTodoCompletedById(
  todoId: string,
  completed: boolean,
): Promise<UpdateTodoState> {
  return runTodoMutation(
    todoId,
    "update",
    async (_todo, userId) =>
      updateTodoPatch(todoId, userId, { completed }),
    "Failed to update todo completed:",
  );
}

export default updateTodoById;
