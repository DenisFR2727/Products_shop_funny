"use client";

import { useAppSelector } from "@/lib/hooks";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";
import PaginationList from "../products/pagination/pagination ";

export default function WishListPage() {
  const favorites = useAppSelector(favoriteSelector);

  return (
    <div className="wishlist">
      <PaginationList products={favorites} />
    </div>
  );
}
