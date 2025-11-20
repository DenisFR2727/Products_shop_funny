"use server";
import { IProducts, IProductsResponse, UnsPlash } from "../types";
import { apiRequest } from "./api-request";
import {
  API_DUMMY_URL,
  API_UNSPLASH_URL,
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
} from "./config";

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
    `${API_UNSPLASH_URL}/?client_id=${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${perPage}`,
    "Failed to fetch photos!",
    { cache: "no-store" }
  );
}
export default async function getPhoto(slug: string): Promise<UnsPlash> {
  return apiRequest(
    `${API_UNSPLASH_URL}/${slug}?client_id=${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    "Failed to fetch photo!",
    { cache: "force-cache" }
  );
}
