"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import PostUserCreate from "@/lib/api/auth";
import errorsLoginForm from "./errors-login";
import { hashUserPassword } from "@/lib/hash";

export default async function userCreate(_prevState: any, formData: FormData) {
  const userId = Date.now() + Math.floor(Math.random() * 10000);

  const password = formData.get("password");
  if (!password || typeof password !== "string") {
    throw new Error("Password is required");
  }

  const data = {
    userId: String(userId),
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPass: formData.get("confirmPass") as string,
  };

  const errors = errorsLoginForm(data);

  const hashedPass = await hashUserPassword(password);

  if (errors) {
    return errors;
  }

  const dataToSave = {
    ...data,
    password: hashedPass,
    confirmPass: "",
  };
  await PostUserCreate(dataToSave);

  revalidatePath("/", "layout");
  redirect(`/products`);
}
