import { Todo } from "@/components/todo/types";
import { apiRequest } from "./api-request";
import { API_ENDPOINTS, API_TODOS_CREATE } from "./config";

const url = `${API_TODOS_CREATE}${API_ENDPOINTS.TODO}`;

export function fetchTodosForUser(userId: string): Promise<Todo[]> {
  const queryUrl = `${url}?userId=${encodeURIComponent(userId)}`;
  return apiRequest<Todo[]>(queryUrl, "Failed to fetch todos", {
    cache: "no-store",
  });
}

export type TodoCreatePayload = Pick<Todo, "title" | "userId" | "createAt">;

export default async function createTodoPost(
  data: TodoCreatePayload,
): Promise<Todo> {
  return apiRequest<Todo>(url, "Failed to create todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function deleteTodoTask(id: string): Promise<Todo> {
  return apiRequest<Todo>(`${url}/${id}`, "Failed to delete todo", {
    method: "DELETE",
    cache: "no-store",
  });
}
