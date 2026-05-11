"use server";

import type { Todo } from "@/components/todo/types";
import { fetchTodoById } from "@/lib/api/todo";
import { ApiError } from "@/lib/api/error";
import { authOptions } from "@/lib/auth/nextauth-options";
import { getServerSession } from "next-auth";

export type GetTodoByIdState = {
  errors: string[] | null;
  todo?: Todo;
};

export async function getTodoById(todoId: string): Promise<GetTodoByIdState> {
  if (!todoId) {
    return { errors: ["Todo id is required"] };
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { errors: ["Authorization required"] };
  }

  if (todoId.startsWith("optimistic-")) {
    return { errors: ["Save the task before editing"] };
  }

  try {
    const todo = await fetchTodoById(todoId);
    if (todo.userId !== session.user.id) {
      return { errors: ["Todo not found"] };
    }

    return { errors: null, todo };
  } catch (error) {
    console.error("Failed to load todo:", error);

    if (error instanceof ApiError && error.code === 404) {
      return { errors: ["Todo not found. Please refresh the list."] };
    }

    return { errors: ["Server is unavailable. Please try again later."] };
  }
}

export default getTodoById;
