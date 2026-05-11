"use server";

import type { Todo } from "@/components/todo/types";
import { fetchTodoById, updateTodoPatch } from "@/lib/api/todo";
import { ApiError } from "@/lib/api/error";
import { authOptions } from "@/lib/auth/nextauth-options";
import { getServerSession } from "next-auth";
import { validateTodoTitle } from "./valid-todos";

export type UpdateTodoState = {
  errors: string[] | null;
  todo?: Todo;
};

export async function updateTodoById(
  todoId: string,
  rawTitle: string,
): Promise<UpdateTodoState> {
  if (!todoId) {
    return { errors: ["Todo id is required"] };
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { errors: ["Authorization required"] };
  }

  if (todoId.startsWith("optimistic-")) {
    return { errors: ["Save the task before updating"] };
  }

  const validation = validateTodoTitle(rawTitle);

  if (!validation.ok) {
    return { errors: validation.errors };
  }

  try {
    const existing = await fetchTodoById(todoId);
    if (existing.userId !== session.user.id) {
      return { errors: ["Todo not found"] };
    }

    const todo = await updateTodoPatch(todoId, { title: validation.title });

    return { errors: null, todo };
  } catch (error) {
    console.error("Failed to update todo:", error);

    if (error instanceof ApiError && error.code === 404) {
      return { errors: ["Todo not found. Please refresh the list."] };
    }

    return { errors: ["Server is unavailable. Please try again later."] };
  }
}

export default updateTodoById;
