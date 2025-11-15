// API Configuration
export const API_DUMMY_URL = "https://dummyjson.com";
export const NEXT_PUBLIC_UNSPLASH_ACCESS_KEY =
  process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export const API_ENDPOINTS = {
  PRODUCTS: "/products",
} as const;

// Rate limiting constants
export const REQUEST_DELAY = 150; // Delay between requests in milliseconds
export const MAX_RETRIES = 3; // Maximum number of retries for 429 errors
export const RETRY_DELAY = 1000; // Initial delay for retries in milliseconds
export const HTTP_STATUS = {
  TOO_MANY_REQUESTS: 429,
} as const;
