"use client";
import { useActionState } from "react";
import Field from "../products/filter/field/field";
import createReviews, { ReviewsState } from "@/actions/reviews";

export default function CreateReviews() {
  const [state, formAction] = useActionState<ReviewsState | null>(
    createReviews,
    {
      errors: undefined,
      values: undefined,
    } as ReviewsState | null
  );
  return (
    <div>
      <form action={formAction}>
        <Field
          id="name_user"
          label="User"
          type="text"
          name="name_user"
          placeholder="Name"
        />
        <p>{state?.errors?.nameUser && <span>{state.errors.nameUser}</span>}</p>
        <Field
          as="textarea"
          id="textarea_reviews"
          name="textarea_reviews"
          label="Reviews"
          placeholder="Reviews write..."
        />
        <p>{state?.errors?.text && <span>{state.errors.text}</span>}</p>
        {state?.errors?.form && (
          <p role="alert">{state.errors.form}</p>
        )}
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
