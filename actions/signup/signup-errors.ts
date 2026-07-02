import { ApiError } from "@/lib/api/error";
import type { FormErrors, SignUpUserFields } from "@/actions/types";

export type SignUpFieldErrors = FormErrors<SignUpUserFields>;
export type SignUpValues = Partial<SignUpUserFields>;

export type SignUpState = {
  errors: SignUpFieldErrors | null;
  values: SignUpValues;
};

export const SIGNUP_ERRORS = {
  emailTaken: "An account with this email already exists",
  serviceUnavailable:
    "Registration service is temporarily unavailable. Please try again later.",
  serviceUnreachable: "Could not reach registration service. Please try again.",
  emailVerifyFailed: "Could not verify email. Please try again.",
} as const;

export function mapSignupApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 409) {
      return SIGNUP_ERRORS.emailTaken;
    }
    if (error.code === 402) {
      return SIGNUP_ERRORS.serviceUnavailable;
    }
    if (error.code === 0) {
      return SIGNUP_ERRORS.serviceUnreachable;
    }
  }

  return SIGNUP_ERRORS.emailVerifyFailed;
}
