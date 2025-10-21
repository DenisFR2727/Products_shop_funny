"use server";
import { IProducts, UnsPlash } from "./types";

const NEXT_PUBLIC_UNSPLASH_ACCESS_KEY =
  process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function getProduct(id: number): Promise<IProducts | null> {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    cache: "force-cache",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getProducts(): Promise<{ products: IProducts[] }> {
  const res = await fetch(`https://dummyjson.com/products`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getPhotos(
  page: number = 1,
  perPage: number = 9
): Promise<UnsPlash[]> {
  const res = await fetch(
    `https://api.unsplash.com/photos/?client_id=${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&page=${page}&per_page=${perPage}`
  );
  if (!res.ok) throw new Error("Failed to fetch photos");
  return res.json();
}
export default async function getPhoto(slug: any): Promise<UnsPlash> {
  const res = await fetch(
    `https://api.unsplash.com/photos/${slug}?client_id=${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch photo!");
  }
  return res.json();
}
