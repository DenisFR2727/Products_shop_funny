export interface ReviewItem {
  id: string | number;
  nameUser: string;
  text: string;
  date?: string;
}

export interface ReviewsWrapperProps {
  reviews: ReviewItem[];
}
