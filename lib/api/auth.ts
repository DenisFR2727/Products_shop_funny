import { apiRequest } from "./api-request";
import { API_ENDPOINTS, API_USERS_CREATE } from "./config";

export default function PostUserCreate(data: any) {
  const url = `${API_USERS_CREATE}/${API_ENDPOINTS.USERS}`;

  return apiRequest(url, "Failed post user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function getEmailUser(email: string) {
  const res = await fetch(
    `${API_USERS_CREATE}/${API_ENDPOINTS.USERS}?email=${email}`,
    {
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new Error(`Failed to get user: ${res.status}`);
  }

  return res.json();
}
