import { apiRequest } from "./api-request";
import { API_ENDPOINTS, API_REVIEWS_CREATE } from "./config";

export default function PostReviews(data: { nameUser: string; text: string }) {
  const url = `${API_REVIEWS_CREATE}${API_ENDPOINTS.REVIEWS}`;
  return apiRequest(url, "Failed post reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
}
