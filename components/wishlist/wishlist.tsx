import { useAppSelector } from "@/lib/hooks";
import ProductList from "../products/products-list";

export default function WishListPage() {
  const favorites = useAppSelector((state) => state.cartReducer.favorite);

  return (
    <div className="">
      <ProductList products={favorites} />
    </div>
  );
}
