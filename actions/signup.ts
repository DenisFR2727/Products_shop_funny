"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import PostUserCreate, { getEmailUser } from "@/lib/api/auth";
import errorsLoginForm from "./errors-login";
import { hashUserPassword } from "@/lib/hash";
import { SignUpState } from "./types";

export default async function userCreate(
  _prevState: any,
  formData: FormData,
): Promise<SignUpState> {
  const userId = Date.now() + Math.floor(Math.random() * 10000);

  const data = {
    userId: String(userId),
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
   if (Array.isArray(existing) && existing.length > 0) {
     return {
       errors: {
         email: "An account with this email already exists",
       },
       values: data,
     };
   }
 } catch {
   return {
     errors: {
       email: "Could not verify email. Please try again.",
     },
     values: data,
   };
 }
  const hashedPass = await hashUserPassword(data.password);

  const dataToSave = {
    ...data,
    password: hashedPass,
    confirmPass: "",
  };
  await PostUserCreate(dataToSave);

  revalidatePath("/", "layout");
  redirect(`/products`);
}
