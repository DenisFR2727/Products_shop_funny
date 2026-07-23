import { isOptimisticTodoId } from "@/components/todo/types";
import { ApiError } from "@/lib/api/error";

export const TODO_ERRORS = {
  idRequired: ["Todo id is required"],
  authRequired: ["Authorization required"],
  invalidRequest: ["Invalid task data"],
  notFound: ["Todo not found"],
  notFoundRefresh: ["Todo not found. Please refresh the list."],
  serverUnavailable: ["Server is unavailable. Please try again later."],
  optimisticUpdate: ["Save the task before updating"],
  optimisticEdit: ["Save the task before editing"],
} as const;

export type TodoActionFail = { ok: false; errors: string[] };

export function rejectMissingTodoId(todoId: string): TodoActionFail | null {
  if (!todoId) {
    return { ok: false, errors: [...TODO_ERRORS.idRequired] };
  }
  return null;
}

export function rejectOptimisticTodoId(
  todoId: string,
  mode: "update" | "edit",
): TodoActionFail | null {
  if (!isOptimisticTodoId(todoId)) {
    return null;
  }

  return {
    ok: false,
    errors: [
      ...(mode === "edit"
        ? TODO_ERRORS.optimisticEdit
        : TODO_ERRORS.optimisticUpdate),
    ],
  };
}

export function mapTodoActionError(error: unknown): string[] {
  if (error instanceof ApiError) {
    if (error.code === 400) {
      return [...TODO_ERRORS.invalidRequest];
    }
    if (error.code === 401) {
      return [...TODO_ERRORS.authRequired];
    }
    if (error.code === 404) {
      return [...TODO_ERRORS.notFoundRefresh];
    }
  }

  return [...TODO_ERRORS.serverUnavailable];
}
