"use client";

import { useOptimistic } from "react";

export default function ReviewsSection({ reviews }: any) {
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    reviews,
    (state, newReview) => [newReview, ...state],
  );

  return (
    <div>
      {optimisticReviews?.map((review: any) => (
        <div key={review.id}>
          <h3>{review.nameUser}</h3>
          <p>Date:</p>
          <p>{review.text}</p>
        </div>
      ))}
    </div>
  );
}
