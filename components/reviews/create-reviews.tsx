"use client";
import { useActionState } from "react";
import Field from "../products/filter/field/field";
import createReviews, { ReviewsState } from "@/actions/reviews";

export default function CreateReviews() {
  const [state, formAction] = useActionState<ReviewsState | null>(
    createReviews,
    { errors: undefined, values: undefined },
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
        <Field
          as="textarea"
          id="textarea_reviews"
          name="textarea_reviews"
          label="Reviews"
          placeholder="Reviews write..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
