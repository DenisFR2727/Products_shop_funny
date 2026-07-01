"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import PostUserCreate, { getEmailUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/error";
import errorsLoginForm from "./errors-login";
import { SignUpState } from "./types";

function mapSignupApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 409) {
      return "An account with this email already exists";
    }
    if (error.code === 402) {
      return "Registration service is unavailable. Check USERS_API_URL in .env.local.";
    }
    if (error.code === 0) {
      return "Could not reach registration service. Please try again.";
    }
  }

  return "Could not verify email. Please try again.";
}

export default async function userCreate(
  _prevState: any,
  formData: FormData,
): Promise<SignUpState> {
  const data = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPass: formData.get("confirmPass") as string,
  };

  const errors = errorsLoginForm(data);

  if (errors) {
    return {
      errors,
      values: data,
    };
  }

  try {
    const existing = await getEmailUser(data.email.trim());
    if (existing.length > 0) {
      return {
        errors: {
          email: "An account with this email already exists",
        },
        values: data,
      };
    }
  } catch (error) {
    console.error("Signup email check failed:", error);
    return {
      errors: {
        email: mapSignupApiError(error),
      },
      values: data,
    };
  }

  // Password is hashed on the backend; userId is generated there too.
  const dataToSave = {
    username: data.username,
    email: data.email,
    phone: data.phone,
    password: data.password,
  };

  try {
    await PostUserCreate(dataToSave);
  } catch (error) {
    console.error("Signup create user failed:", error);
    return {
      errors: {
        email: mapSignupApiError(error),
      },
      values: data,
    };
  }

  revalidatePath("/", "layout");
  redirect(`/products`);
}
