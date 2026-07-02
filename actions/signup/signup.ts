"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { checkEmailAvailability, createUser } from "./signup-action-helpers";
import { mapSignupApiError, type SignUpState } from "./signup-errors";
import { extractSignUpData, validateSignUpForm } from "./valid-signup";

export type { SignUpState };

export default async function userCreate(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const data = extractSignUpData(formData);

  const validation = validateSignUpForm(data);
  if (!validation.ok) {
    return { errors: validation.errors, values: data };
  }

  const normalized = validation.data;

  try {
    const availability = await checkEmailAvailability(normalized.email);
    if (!availability.ok) {
      return { errors: { email: availability.message }, values: normalized };
    }
  } catch (error) {
    console.error("Signup email check failed:", error);
    return { errors: { email: mapSignupApiError(error) }, values: normalized };
  }

  try {
    await createUser(normalized);
  } catch (error) {
    console.error("Signup create user failed:", error);
    return { errors: { email: mapSignupApiError(error) }, values: normalized };
  }

  revalidatePath("/", "layout");
  redirect(`/products`);
}
