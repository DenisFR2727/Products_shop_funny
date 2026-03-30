"use client";

import { useAppSelector } from "@/lib/hooks";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";
import ProductList from "../products/products-list";

export default function WishListPage() {
  const favorites = useAppSelector(favoriteSelector);

  return (
    <div className="wishlist">
      <ProductList products={favorites} />
    </div>
  );
}
