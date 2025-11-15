"use server";
import { IProducts, IProductsResponse, UnsPlash } from "../types";
import {
  API_DUMMY_URL,
  HTTP_STATUS,
  MAX_RETRIES,
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  RETRY_DELAY,
} from "./config";
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

export async function getProduct(id: number): Promise<IProducts | null> {
  return apiRequest<IProducts | null>(
    `${API_DUMMY_URL}/products/${id}`,
    "Failed to fetch product",
    { cache: "force-cache" }
  );
}

export async function getProducts(): Promise<IProductsResponse> {
  return apiRequest<IProductsResponse>(
    `${API_DUMMY_URL}/products`,
    "Failed to fetch products",
    {
      cache: "force-cache",
    }
  );
}

export async function getPhotos(
  page: number = 1,
  perPage: number = 9
): Promise<UnsPlash[]> {
  return apiRequest(
    `https://api.unsplash.com/photos/?client_id=${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${perPage}`,
    "Failed to fetch photos!",
    { cache: "no-store" }
  );
}
export default async function getPhoto(slug: any): Promise<UnsPlash> {
  return apiRequest(
    `https://api.unsplash.com/photos/${slug}?client_id=${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    "Failed to fetch photo!",
    { cache: "force-cache" }
  );
}
