import CreateReviews from "@/components/reviews/create-reviews";
import ReviewsSection from "@/components/reviews/list-reviews";
import { getReviews } from "@/lib/api/reviews";

export default async function ReviewsPage() {
  const reviews = await getReviews();
  console.log(reviews);
  return (
    <div>
      <CreateReviews />
      <ReviewsSection reviews={reviews} />
    </div>
  );
}
