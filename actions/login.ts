"use server";

import { verifyPassword } from "@/components/auth/util/verify-password";
import { getEmailUser } from "@/lib/api/auth";
import { cookies } from "next/headers";

interface LoginState {
  success?: boolean;
  errors?: {
    email?: string;
    password?: string;
  };
}
export async function isLogin(_prevState: any, formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  let errors: LoginState["errors"] = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }
  if (password.trim().length < 6 || !password.trim().length) {
    errors.password = "Passwor must be at least 8 charesters long.";
  }
  if (Object.keys(errors).length > 0) {
    return {
      errors: errors,
    };
  }

  try {
    const user = await getEmailUser(email);

    if (!user) {
      errors.email = "User with this email does not exist";
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      errors.password = "Incorrect password";
    }

    const cookieStore = await cookies();

    cookieStore.set("auth", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return { success: true };
  } catch (error: any) {
    return {
      errors: {
        email: "It seems like an account for the chosen email already exists.",
      },
    };
  }
}
