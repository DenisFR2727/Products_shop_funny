"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import createReviews, { ReviewsState } from "@/actions/reviews";
import Field from "../products/filter/field/field";
import ButtonReviews from "./button-reviews";

import classes from "./create-reviews.module.scss";

export default function CreateReviews() {
  const [state, formAction] = useActionState<ReviewsState | null>(
    createReviews,
    {
      errors: undefined,
      values: undefined,
    } as ReviewsState | null,
  );
  const [value, setValue] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (state?.success) {
      setValue("");
    }
  }, [state]);

  return (
    <div className={classes.reviews}>
      <form action={formAction} ref={formRef}>
        <Field
          id="name_user"
          label="User"
          type="text"
          name="name_user"
          placeholder="Name"
        />
        <p>
          {state?.errors?.nameUser && (
            <span className={classes.error}>{state.errors.nameUser}</span>
          )}
        </p>
        <Field
          as="textarea"
          id="textarea_reviews"
          name="textarea_reviews"
          label="Reviews"
          placeholder="Reviews write..."
          onChange={handleChange}
          value={value}
          className={classes.textarea}
        >
          <span className={classes.counter}>{value.length}</span>
        </Field>
        <p>
          {state?.errors?.text && (
            <span className={classes.error}>{state.errors.text}</span>
          )}
        </p>
        {state?.errors?.form && <p role="alert">{state.errors.form}</p>}
        <ButtonReviews className={classes.btn_reviews} type="submit">
          Send
        </ButtonReviews>
      </form>
    </div>
  );
}
