import { useFormStatus } from "react-dom";
import { SpinnerCircularSplit } from "spinners-react";

import classes from "./create-reviews.module.scss";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonReviewsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function ButtonReviews({
  children,
  ...props
}: ButtonReviewsProps) {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} {...props}>
      {pending ? (
        <SpinnerCircularSplit className={classes.spinner} />
      ) : (
        children
      )}
    </button>
  );
}
