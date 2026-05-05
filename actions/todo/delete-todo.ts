"use server";

import { deleteTodoTask } from "@/lib/api/todo";
import { ApiError } from "@/lib/api/error";
import { authOptions } from "@/lib/auth/nextauth-options";
import { getServerSession } from "next-auth";

type DeleteTodoState = {
  errors: string[] | null;
  deletedId?: string;
};

export const deleteTodoById = async (
  todoId: string,
): Promise<DeleteTodoState> => {
  if (!todoId) {
    return { errors: ["Todo id is required"] };
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { errors: ["Authorization required"] };
  }

  try {
    await deleteTodoTask(todoId);
    return { errors: null, deletedId: todoId };
  } catch (error) {
    console.error("Failed to delete todo:", error);

    if (error instanceof ApiError && error.code === 404) {
      return { errors: ["Todo not found. Please refresh the list."] };
    }

    return { errors: ["Server is unavailable. Please try again later."] };
  }
};

export default deleteTodoById;
