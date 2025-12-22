// API Configuration
export const API_DUMMY_URL = "https://dummyjson.com";
export const API_UNSPLASH_URL = "https://api.unsplash.com/photos";
export const NEXT_PUBLIC_UNSPLASH_ACCESS_KEY =
  process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export const API_ADDRESS_CREATE =
  "https://692dacb6e5f67cd80a4c7d05.mockapi.io/address_create";
export const API_USERS_CREATE =
  "https://692dacb6e5f67cd80a4c7d05.mockapi.io/address_create";

export const API_ENDPOINTS = {
  PRODUCTS: "/products",
  ADDRESS: "/address",
  USERS: "/users",
} as const;

// Rate limiting constants
export const REQUEST_DELAY = 150; // Delay between requests in milliseconds
export const MAX_RETRIES = 3; // Maximum number of retries for 429 errors
export const RETRY_DELAY = 1000; // Initial delay for retries in milliseconds

// HTTP STATUS
export const HTTP_STATUS = {
  TOO_MANY_REQUESTS: 429,
} as const;
