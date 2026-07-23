"use server";

import { deleteTodoTask } from "@/lib/api/todo";
import {
  loadTodoForUser,
  mapTodoActionError,
  rejectMissingTodoId,
  rejectOptimisticTodoId,
  requireTodoSession,
} from "./todo-action-helpers";

type DeleteTodoState = {
  errors: string[] | null;
  deletedId?: string;
};

export const deleteTodoById = async (
  todoId: string,
): Promise<DeleteTodoState> => {
  const missingId = rejectMissingTodoId(todoId);
  if (missingId) {
    return { errors: missingId.errors };
  }

  const session = await requireTodoSession();
  if (!session.ok) {
    return { errors: session.errors };
  }

  const optimistic = rejectOptimisticTodoId(todoId, "update");
  if (optimistic) {
    return { errors: optimistic.errors };
  }

  const loaded = await loadTodoForUser(todoId, session.userId);
  if (!loaded.ok) {
    return { errors: loaded.errors };
  }

  try {
    await deleteTodoTask(todoId, session.userId);
    return { errors: null, deletedId: todoId };
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return { errors: mapTodoActionError(error) };
  }
};

export default deleteTodoById;
