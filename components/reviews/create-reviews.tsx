"use client";
import type React from "react";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import createReviews, { ReviewsState } from "@/actions/reviews";
import Field from "../products/filter/field/field";
import ButtonReviews from "./button-reviews";

import classes from "./create-reviews.module.scss";
import { useTranslation } from "react-i18next";

interface ReviewItem {
  id: string | number;
  nameUser: string;
  text: string;
  date?: string;
}

interface CreateReviewsProps {
  onAddReview: (review: ReviewItem) => void;
}

export default function CreateReviews({ onAddReview }: CreateReviewsProps) {
  const [state, formAction] = useActionState<ReviewsState | null>(
    createReviews,
    {
      errors: undefined,
      values: undefined,
    } as ReviewsState | null,
  );
  const [value, setValue] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const nameUser = formData.get("name_user") as string;
    const text = formData.get("textarea_reviews") as string;

    startTransition(() => {
      if (nameUser?.trim() && text?.trim()) {
        onAddReview({
          id: Date.now(),
          nameUser,
          text,
          date: new Date().toISOString(),
        });
      }

      (formAction as unknown as (formData: FormData) => void)(formData);
    });
    setValue("");
    formRef.current?.reset();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (state?.success) {
      setValue("");
      formRef.current?.reset();
    }
  }, [state]);

  function handleClickFocus() {
    //  fucus перший інпут після  помилки
    if (state?.errors && Object.keys(state?.errors).length > 0) {
      inputRef.current?.focus();
    }
  }
  return (
    <div className={classes.reviews}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Field
          id="name_user"
          label={t("User")}
          type="text"
          name="name_user"
          placeholder={`${t("Name")}`}
          ref={inputRef}
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
          label={t("Reviews")}
          placeholder={`${t("Reviews write")}...`}
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
        {state?.errors?.form && (
          <p className={classes.error} role="alert">
            {state.errors.form}
          </p>
        )}
        <ButtonReviews
          className={classes.btn_reviews}
          type="submit"
          onClick={handleClickFocus}
        >
          {t("Send")}
        </ButtonReviews>
      </form>
    </div>
  );
}
