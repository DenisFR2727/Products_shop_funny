import { HTTP_STATUS, MAX_RETRIES, RETRY_DELAY } from "./config";
import { handleApiError } from "./error";

// Delay function to avoid rate limiting
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiRequest<T>(
  url: string,
  errorMessage: string,
  cache: RequestInit = {},
  retryCount = 0
): Promise<T> {
  try {
    const res = await fetch(url);
    if (res.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      if (retryCount < MAX_RETRIES) {
        const waitTime = RETRY_DELAY * Math.pow(2, retryCount);
        await delay(waitTime);
        return apiRequest<T>(url, errorMessage, cache, retryCount + 1);
      }
      throw {
        code: res.status,
        message: "Too many requests. Please try again later.",
      };
    }

    if (!res.ok) {
      throw {
        code: res.status,
        message: `${errorMessage} (status ${res.status})`,
      };
    }
    return await res.json();
  } catch (error: unknown) {
    throw new Error(handleApiError(error));
  }
}
