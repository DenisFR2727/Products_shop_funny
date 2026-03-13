import ReviewsWrapper, {
  type ReviewItem,
} from "@/components/reviews/reviews-wrapper";
import { getReviews } from "@/lib/api/reviews";

export default async function ReviewsPage() {
  const reviews = (await getReviews()) as ReviewItem[];

  return <ReviewsWrapper reviews={reviews} />;
}
