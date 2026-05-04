"use server";

import type { Todo } from "@/components/todo/types";
import { fetchTodosForUser } from "@/lib/api/todo";
import { authOptions } from "@/lib/auth/nextauth-options";
import { getServerSession } from "next-auth";

export async function getUserTodos(): Promise<{
  todos: Todo[];
  error: string | null;
}> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { todos: [], error: "Authorization required" };
  }

  try {
    const todos = await fetchTodosForUser(session.user.id);
    return { todos: Array.isArray(todos) ? todos : [], error: null };
  } catch {
    return { todos: [], error: "Failed to load tasks" };
  }
}
