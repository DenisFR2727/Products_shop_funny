import { ReactNode } from "react";

export interface ReviewItem {
  id: string | number;
  nameUser: string;
  text: string;
  date?: string;
}

export interface ReviewsWrapperProps {
  reviews: ReviewItem[];
}
export interface ReviewsModalProps {
  children: ReactNode;
  onClose: () => void;
}
