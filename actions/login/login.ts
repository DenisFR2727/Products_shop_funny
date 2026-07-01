"use server";

import { authenticateLoginUser } from "./login-action-helpers";
import { mapLoginActionError, type LoginFieldErrors } from "./login-errors";
import { validateLoginForm } from "./valid-login";

export type LoginState = {
  success?: boolean;
  errors?: LoginFieldErrors;
};

export default async function loginAction(
  prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState | null> {
  if (!formData) {
    return prevState;
  }

  const validation = validateLoginForm(formData);

  if (!validation.ok) {
    return { errors: validation.errors };
  }

  try {
    const auth = await authenticateLoginUser(
      validation.credentials.email,
      validation.credentials.password,
    );

    if (!auth.ok) {
      return { errors: auth.errors };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { errors: mapLoginActionError(error) };
  }
}
