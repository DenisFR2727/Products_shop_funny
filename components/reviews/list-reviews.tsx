"use client";

import classes from "./create-reviews.module.scss";

export default function ReviewsSection({ reviews }: any) {
  return (
    <div className={classes.reviews_list}>
      {reviews?.map((review: any, index: number) => (
        <div key={review.id} className={classes.review}>
          <span>{index + 1}</span>
          <h3>User: {review.nameUser}</h3>
          <p className={classes.review_date}>
            Date: {new Date(review?.date).toLocaleDateString()}
          </p>
          <p className={classes.review_text}>{review.text}</p>
        </div>
      ))}
    </div>
  );
}
