import { apiRequest } from "./api-request";
import { API_ENDPOINTS, API_USERS_CREATE } from "./config";
import { ApiError } from "./error";
import { UserByEmail } from "./types";

function normalizeUsersResponse(data: unknown): UserByEmail[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object" && "email" in data) {
    return [data as UserByEmail];
  }

  return [];
}

export async function updateUser<TRequest extends object, TResponse>(
  id: string,
  data: TRequest,
): Promise<TResponse> {
  const url = `${API_USERS_CREATE}${API_ENDPOINTS.USERS}/${id}`;
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
  const url = `${API_USERS_CREATE}${API_ENDPOINTS.USERS}`;

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
  const normalizedEmail = email.trim();
  const url = `${API_USERS_CREATE}${API_ENDPOINTS.USERS}?email=${encodeURIComponent(normalizedEmail)}`;

  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new ApiError(res.status, `Failed to get user: ${res.status}`);
  }

  const data = await res.json();
  const users = normalizeUsersResponse(data);

  return users.filter(
    (user) => user.email?.toLowerCase() === normalizedEmail.toLowerCase(),
  );
}
