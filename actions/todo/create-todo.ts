"use server";

import createTodoPost from "@/lib/api/todo";
import type { Todo } from "@/components/todo/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth-options";
import { mapTodoActionError } from "./todo-action-helpers";
import { validateTodoCreate } from "./valid-todos";

export type CreateTodoState = {
  errors: string[] | null;
  todo?: Todo;
};

const createTodo = async (
  _prevState: CreateTodoState,
  formData: FormData,
): Promise<CreateTodoState> => {
  if (!formData) return _prevState;

  const session = await getServerSession(authOptions);

  const validation = validateTodoCreate(
    formData.get("title"),
    session?.user?.id,
  );

  if (!validation.ok) {
    return { errors: validation.errors };
  }

  try {
    const todo = await createTodoPost({
      title: validation.title,
      userId: validation.userId,
      createAt: new Date().toISOString(),
    });

    return { errors: null, todo };
  } catch (error) {
    console.error("Failed to create todo:", error);
    return { errors: mapTodoActionError(error) };
  }
};

export default createTodo;
