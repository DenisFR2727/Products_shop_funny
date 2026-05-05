"use server";

import { deleteTodoTask } from "@/lib/api/todo";
import { ApiError } from "@/lib/api/error";
import { authOptions } from "@/lib/auth/nextauth-options";
import { getServerSession } from "next-auth";

type DeleteTodoState = {
  errors: string[] | null;
  deletedId?: string;
};

export const deleteTodoById = async (id: string): Promise<DeleteTodoState> => {
  const normalizedId = id.trim();

  if (!normalizedId) {
    return { errors: ["Todo id is required"] };
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { errors: ["Authorization required"] };
  }

  try {
    await deleteTodoTask(normalizedId);
    return { errors: null, deletedId: normalizedId };
  } catch (error) {
    console.error("Failed to delete todo:", error);

    if (error instanceof ApiError && error.code === 404) {
      return { errors: ["Todo not found. Please refresh the list."] };
    }

    return { errors: ["Server is unavailable. Please try again later."] };
  }
};

const deleteTodo = async (
  _prevState: DeleteTodoState,
  formData: FormData,
): Promise<DeleteTodoState> => {
  const rawId = formData.get("id");
  const id = typeof rawId === "string" ? rawId : "";

  return deleteTodoById(id);
};

export default deleteTodo;
