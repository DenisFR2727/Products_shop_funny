import ReviewsWrapper from "@/components/reviews/reviews-wrapper";
import { ReviewItem } from "@/components/reviews/types";
import { getReviews } from "@/lib/api/reviews";

export default async function ReviewsPage() {
  const reviews = (await getReviews()) as ReviewItem[];

  return <ReviewsWrapper reviews={reviews} />;
}
