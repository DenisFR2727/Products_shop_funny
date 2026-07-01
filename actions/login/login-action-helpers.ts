import { authorizeUser } from "@/lib/auth/authorize";

import { LOGIN_ERRORS, type LoginFieldErrors } from "./login-errors";

export type LoginAuthResult =
  | { ok: true }
  | { ok: false; errors: LoginFieldErrors };

export async function authenticateLoginUser(
  email: string,
  password: string,
): Promise<LoginAuthResult> {
  const authUser = await authorizeUser(email, password);

  if (!authUser) {
    return {
      ok: false,
      errors: { form: LOGIN_ERRORS.invalidCredentials },
    };
  }

  return { ok: true };
}
