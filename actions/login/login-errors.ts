import { ApiError } from "@/lib/api/error";

export type LoginFieldErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export const LOGIN_ERRORS = {
  emailInvalid: "Please enter a valid email address!",
  passwordInvalid:
    "The correct number of digits in the password is required!",
  invalidCredentials: "Invalid email or password",
  serverUnavailable: "An error occurred. Please try again.",
} as const;

export function mapLoginActionError(error: unknown): LoginFieldErrors {
  if (error instanceof ApiError) {
    return { form: LOGIN_ERRORS.serverUnavailable };
  }

  return { form: LOGIN_ERRORS.serverUnavailable };
}
