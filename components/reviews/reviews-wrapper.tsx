"use client";

import { useOptimistic, useState } from "react";
import CreateReviews from "./create-reviews";
import ReviewsSection from "./list-reviews";
import { ReviewItem, ReviewsModalProps, ReviewsWrapperProps } from "./types";
import { createPortal } from "react-dom";
import classes from "./create-reviews.module.scss";

export default function ReviewsWrapper({ reviews }: ReviewsWrapperProps) {
  const [optimisticReviews, addOptimisticReview] = useOptimistic<
    ReviewItem[],
    ReviewItem
  >(reviews, (state, newReview) => [newReview, ...state]);
  const [visibleReviews, setVisibleReviews] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const sortedReviews = [...optimisticReviews].sort(
    (a, b) => Number(b.id) - Number(a.id),
  );

  function handleVisible() {
    if (visibleReviews) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        setVisibleReviews(false);
      }, 280);
    } else {
      setVisibleReviews(true);
    }
  }

  return (
    <div>
      <CreateReviews onAddReview={addOptimisticReview} />
      <button
        type="button"
        onClick={handleVisible}
        className={classes.toggle_btn}
      >
        Reviews
        <span
          className={`${classes.chevron} ${visibleReviews && !isClosing ? classes.chevron_open : ""}`}
        />
      </button>
      {visibleReviews && (
        <div
          className={`${classes.reviews_list_animated} ${isClosing ? classes.closing : ""}`}
        >
          <ReviewsSection reviews={sortedReviews} />
        </div>
      )}
    </div>
  );
}

export function ReviewsModal({ children }: ReviewsModalProps) {
  const element = document.getElementById("reviews");

  if (!element) return null;

  return createPortal(<div>{children}</div>, element);
}
