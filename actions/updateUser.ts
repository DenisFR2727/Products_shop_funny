"use server";

import { revalidatePath } from "next/cache";
import { updateUser as updateUserApi } from "@/lib/api/auth";
import { hashUserPassword } from "@/lib/hash";
import errorsUpdateUser from "./errors-update-user";
import { UpdateUserState } from "./types";

const INITIAL_RESULT = { updatedData: null } as const;

export async function updateUserAction(
  userId: string,
  _prevState: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  if (!userId) {
    return {
      success: false,
      error: "User not authenticated",
      errors: null,
      ...INITIAL_RESULT,
    };
  }

  const username = (formData.get("username") as string) ?? "";
  const email = (formData.get("email") as string) ?? "";
  const phone = (formData.get("phone") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";

  // Field-level validation
  const errors = errorsUpdateUser({ username, email, phone, password });
  if (errors) {
    return { success: false, error: null, errors, ...INITIAL_RESULT };
  }

  try {
    const payload: Record<string, string> = { username, email, phone };

    if (password) {
      payload.password = await hashUserPassword(password);
    }

    await updateUserApi(userId, payload);
    revalidatePath("/profile");

    return {
      success: true,
      error: null,
      errors: null,
      updatedData: { username, email, phone },
    };
  } catch {
    return {
      success: false,
      error: "Failed to update profile. Please try again.",
      errors: null,
      ...INITIAL_RESULT,
    };
  }
}
