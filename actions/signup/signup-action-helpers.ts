import PostUserCreate, { getEmailUser } from "@/lib/api/auth";

import { SIGNUP_ERRORS } from "./signup-errors";
import type { SignUpData } from "@/actions/types";

export type EmailAvailability = { ok: true } | { ok: false; message: string };

export async function checkEmailAvailability(
  email: string,
): Promise<EmailAvailability> {
  const existing = await getEmailUser(email.trim());

  if (existing.length > 0) {
    return { ok: false, message: SIGNUP_ERRORS.emailTaken };
  }

  return { ok: true };
}

// Password is hashed on the backend; userId is generated there too.
export async function createUser(data: SignUpData): Promise<void> {
  await PostUserCreate({
    username: data.username,
    email: data.email,
    phone: data.phone,
    password: data.password,
  });
}
