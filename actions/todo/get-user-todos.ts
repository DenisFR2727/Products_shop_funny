"use server";

import type { Todo } from "@/components/todo/types";
import { fetchTodosForUser } from "@/lib/api/todo";
import { requireTodoSession } from "./todo-action-helpers";

export async function getUserTodos(): Promise<{
  todos: Todo[];
  error: string | null;
}> {
  const session = await requireTodoSession();
  if (!session.ok) {
    return { todos: [], error: session.errors[0] ?? "Authorization required" };
  }

  try {
    const todos = await fetchTodosForUser(session.userId);
    return { todos: Array.isArray(todos) ? todos : [], error: null };
  } catch {
    return { todos: [], error: "Failed to load tasks" };
  }
}
