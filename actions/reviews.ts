"use server";

import { ApiError } from "@/lib/api/error";
import postReviews from "@/lib/api/reviews";
import { revalidatePath } from "next/cache";

export interface ReviewsState {
  success?: boolean;
  errors?: {
    nameUser?: string;
    text?: string;
    form?: string;
  };
  values?: {
    nameUser?: string;
    text?: string;
    date?: string;
  };
}

export default async function createReviews(
  prevState: ReviewsState | null,
  formData?: FormData,
): Promise<ReviewsState | null> {
  if (!formData) return prevState;

  const data = {
    nameUser: (formData.get("name_user") as string) || "",
    text: (formData.get("textarea_reviews") as string) || "",
    date: new Date().toISOString(),
  };

  let errors: ReviewsState["errors"] = {};

  if (!data.nameUser || data.nameUser.trim().length === 0) {
    errors.nameUser = "Name is Empty";
  } else if (!/^[a-zA-Zа-яА-Я\s]+$/.test(data.nameUser.trim())) {
    errors.nameUser = "Name must only words!";
  }

  if (!data.text || data.text.trim().length === 0) {
    errors.text = "Text is Empty";
  } else if (data.text.trim().length < 10) {
    errors.text = "Text must 10 symbols!";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: data,
    };
  }

  try {
    await postReviews(data);

    revalidatePath("/reviews");

    return { success: true };
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : "Failed to send review. Try again.";
    return {
      errors: { form: message },
      values: data,
    };
  }
}
