"use server";

import type { Todo } from "@/components/todo/types";
import {
  loadTodoForUser,
  rejectMissingTodoId,
  rejectOptimisticTodoId,
  requireTodoSession,
} from "./todo-action-helpers";

export type GetTodoByIdState = {
  errors: string[] | null;
  todo?: Todo;
};

export async function getTodoById(todoId: string): Promise<GetTodoByIdState> {
  const missingId = rejectMissingTodoId(todoId);
  if (missingId) {
    return { errors: missingId.errors };
  }

  const session = await requireTodoSession();
  if (!session.ok) {
    return { errors: session.errors };
  }

  const optimistic = rejectOptimisticTodoId(todoId, "edit");
  if (optimistic) {
    return { errors: optimistic.errors };
  }

  const loaded = await loadTodoForUser(todoId, session.userId);
  if (!loaded.ok) {
    return { errors: loaded.errors };
  }

  return { errors: null, todo: loaded.todo };
}

export default getTodoById;
