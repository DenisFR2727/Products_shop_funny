import { LOGIN_ERRORS, type LoginFieldErrors } from "./login-errors";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginFormValidation =
  | { ok: false; errors: LoginFieldErrors }
  | { ok: true; credentials: LoginCredentials };

export function validateLoginForm(formData: FormData): LoginFormValidation {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const errors: LoginFieldErrors = {};

  if (!email || !email.includes("@")) {
    errors.email = LOGIN_ERRORS.emailInvalid;
  }

  if (!password || password.trim().length < 6) {
    errors.password = LOGIN_ERRORS.passwordInvalid;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, credentials: { email, password } };
}
