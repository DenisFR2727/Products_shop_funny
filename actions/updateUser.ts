"use server";

import { revalidatePath } from "next/cache";
import { updateUser as updateUserApi } from "@/lib/api/auth";
import { hashUserPassword } from "@/lib/hash";

export interface UpdatedUserData {
  username: string;
  email: string;
  phone: string;
}

export interface UpdateUserState {
  success: boolean;
  error: string | null;
  updatedData: UpdatedUserData | null;
}

export async function updateUserAction(
  userId: string,
  _prevState: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  if (!userId) {
    return { success: false, error: "User not authenticated", updatedData: null };
  }

  try {
    const username = (formData.get("username") as string) ?? "";
    const email = (formData.get("email") as string) ?? "";
    const phone = (formData.get("phone") as string) ?? "";

    const payload: Record<string, string> = { username, email, phone };

    const password = formData.get("password") as string;
    if (password) {
      payload.password = await hashUserPassword(password);
    }

    await updateUserApi(userId, payload);
    revalidatePath("/profile");

    return { success: true, error: null, updatedData: { username, email, phone } };
  } catch {
    return {
      success: false,
      error: "Failed to update profile. Please try again.",
      updatedData: null,
    };
  }
}
