import { ReviewItem } from "@/components/reviews/types";
import { apiRequest } from "./api-request";
import { API_ENDPOINTS, API_REVIEWS_CREATE } from "./config";

const url = `${API_REVIEWS_CREATE}${API_ENDPOINTS.REVIEWS}`;

export default function postReviews(data: ReviewItem) {
  return apiRequest(url, "Failed post reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export function getReviews(): Promise<ReviewItem[]> {
  return apiRequest<ReviewItem[]>(url, "Failed get reviews", {
    cache: "no-store",
  });
}
