import type { Todo } from "@/components/todo/types";

import { apiRequest } from "./api-request";
import {
  API_ENDPOINTS,
  API_TODOS_CREATE,
  getInternalApiSecret,
} from "./config";
import { ApiError } from "./error";

const url = `${API_TODOS_CREATE}${API_ENDPOINTS.TODO}`;

function withActor(userId: string, init: RequestInit = {}): RequestInit {
  const normalizedUserId = userId.trim();
  if (!normalizedUserId) {
    throw new ApiError(401, "Authorization required");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${getInternalApiSecret()}`);
  headers.set("X-User-Id", normalizedUserId);

  return { ...init, headers };
}

export function fetchTodosForUser(userId: string): Promise<Todo[]> {
  return apiRequest<Todo[]>(
    url,
    "Failed to fetch todos",
    withActor(userId, { cache: "no-store" }),
  );
}

export type TodoCreatePayload = Pick<Todo, "title">;

export default async function createTodoPost(
  userId: string,
  data: TodoCreatePayload,
): Promise<Todo> {
  return apiRequest<Todo>(
    url,
    "Failed to create todo",
    withActor(userId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }),
  );
}

export async function deleteTodoTask(
  id: string,
  userId: string,
): Promise<Todo> {
  return apiRequest<Todo>(
    `${url}/${id}`,
    "Failed to delete todo",
    withActor(userId, {
      method: "DELETE",
      cache: "no-store",
    }),
  );
}

export async function fetchTodoById(
  id: string,
  userId: string,
): Promise<Todo> {
  return apiRequest<Todo>(
    `${url}/${id}`,
    "Failed to fetch todo",
    withActor(userId, { cache: "no-store" }),
  );
}

export async function updateTodoPatch(
  id: string,
  userId: string,
  payload: Partial<Pick<Todo, "title" | "completed">>,
): Promise<Todo> {
  return apiRequest<Todo>(
    `${url}/${id}`,
    "Failed to update todo",
    withActor(userId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }),
  );
}
