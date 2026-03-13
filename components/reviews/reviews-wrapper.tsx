"use client";

import { useOptimistic } from "react";
import CreateReviews from "./create-reviews";
import ReviewsSection from "./list-reviews";
import { ReviewItem, ReviewsWrapperProps } from "./types";

export default function ReviewsWrapper({ reviews }: ReviewsWrapperProps) {
  const [optimisticReviews, addOptimisticReview] = useOptimistic<
    ReviewItem[],
    ReviewItem
  >(reviews, (state, newReview) => [newReview, ...state]);

  return (
    <div>
      <CreateReviews onAddReview={addOptimisticReview} />
      <ReviewsSection reviews={optimisticReviews} />
    </div>
  );
}
