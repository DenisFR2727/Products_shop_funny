import { apiRequest } from "./api-request";
import { API_ADDRESS_CREATE, API_ENDPOINTS } from "./config";

export async function postAddressOrder(data: any) {
  return apiRequest(
    `${API_ADDRESS_CREATE}/${API_ENDPOINTS.ADDRESS}`,
    "Failed to post address",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );
}
