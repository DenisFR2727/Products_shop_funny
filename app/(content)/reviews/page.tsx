import ReviewsWrapper from "@/components/reviews/reviews-wrapper";
import { ReviewItem } from "@/components/reviews/types";
import { getReviews } from "@/lib/api/reviews";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Reviews page",
};

export default async function ReviewsPage() {
  const reviews = (await getReviews()) as ReviewItem[];

  return <ReviewsWrapper reviews={reviews} />;
}
