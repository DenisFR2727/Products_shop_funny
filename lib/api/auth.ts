import { apiRequest } from "./api-request";
import { API_ENDPOINTS, API_USERS_CREATE } from "./config";
import { UserByEmail } from "./types";

export async function updateUser<TRequest extends object, TResponse>(
  id: string,
  data: TRequest,
): Promise<TResponse> {
  const url = `${API_USERS_CREATE}/${API_ENDPOINTS.USERS}/${id}`;
  return apiRequest<TResponse>(url, "Failed to update user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export default function PostUserCreate<TRequest extends object, TResponse>(
  data: TRequest,
): Promise<TResponse> {
  const url = `${API_USERS_CREATE}/${API_ENDPOINTS.USERS}`;

  return apiRequest<TResponse>(url, "Failed post user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function getEmailUser(email: string): Promise<UserByEmail[]> {
  const res = await fetch(
    `${API_USERS_CREATE}/${API_ENDPOINTS.USERS}?email=${email}`,
    {
      cache: "no-store",
    },
  );

  if (res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new Error(`Failed to get user: ${res.status}`);
  }

  return res.json();
}
