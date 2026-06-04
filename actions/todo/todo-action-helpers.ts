import type { Todo } from "@/components/todo/types";
import { fetchTodoById } from "@/lib/api/todo";
import { authOptions } from "@/lib/auth/nextauth-options";
import { getServerSession } from "next-auth";
import {
  mapTodoActionError,
  rejectMissingTodoId,
  rejectOptimisticTodoId,
  TODO_ERRORS,
  type TodoActionFail,
} from "./todo-errors";

export { TODO_ERRORS, mapTodoActionError, rejectMissingTodoId, rejectOptimisticTodoId };
export type { TodoActionFail };

export type TodoActionOk<T> = { ok: true } & T;

export async function requireTodoSession(): Promise<
  TodoActionOk<{ userId: string }> | TodoActionFail
> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { ok: false, errors: [...TODO_ERRORS.authRequired] };
  }

  return { ok: true, userId: session.user.id };
}

export async function loadTodoForUser(
  todoId: string,
  userId: string,
): Promise<TodoActionOk<{ todo: Todo }> | TodoActionFail> {
  try {
    const todo = await fetchTodoById(todoId);
    if (todo.userId !== userId) {
      return { ok: false, errors: [...TODO_ERRORS.notFound] };
    }
    return { ok: true, todo };
  } catch (error) {
    console.error("Failed to load todo:", error);
    return { ok: false, errors: mapTodoActionError(error) };
  }
}

export type TodoMutationState = {
  errors: string[] | null;
  todo?: Todo;
};

export async function runTodoMutation(
  todoId: string,
  optimisticMode: "update" | "edit",
  mutate: (todo: Todo, userId: string) => Promise<Todo>,
  logLabel: string,
): Promise<TodoMutationState> {
  const missingId = rejectMissingTodoId(todoId);
  if (missingId) {
    return { errors: missingId.errors };
  }

  const session = await requireTodoSession();
  if (!session.ok) {
    return { errors: session.errors };
  }

  const optimistic = rejectOptimisticTodoId(todoId, optimisticMode);
  if (optimistic) {
    return { errors: optimistic.errors };
  }

  const loaded = await loadTodoForUser(todoId, session.userId);
  if (!loaded.ok) {
    return { errors: loaded.errors };
  }

  try {
    const todo = await mutate(loaded.todo, session.userId);
    return { errors: null, todo };
  } catch (error) {
    console.error(logLabel, error);
    return { errors: mapTodoActionError(error) };
  }
}
