"use client";

import classes from "./create-reviews.module.scss";
// improve
export default function ReviewsSection({ reviews }: any) {
  return (
    <div className={classes.reviews_list}>
      {reviews.length === 0 ? (
        <p>Reviews is empty!</p>
      ) : (
        <div>
          {reviews?.map((review: any, index: number) => (
            <div key={review.id} className={classes.review}>
              <div className={classes.review_avatar}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <span className={classes.review_num}>{index + 1}</span>
              </div>

              <div className={classes.review_content}>
                <div className={classes.review_header}>
                  <span className={classes.review_name}>{review.nameUser}</span>

                  <span className={classes.review_date}>
                    {new Date(review?.date).toLocaleDateString("uk-UA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className={classes.review_text}>{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
