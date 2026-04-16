import WishListPage from "@/components/wishlist/wishlist";
import { Metadata } from "next";

export  const metadata: Metadata = {
   title: "Wishlist",
   description: "Wishlist page",
 };
 
export default function WishListProductsPage() {
  return (
    <div>
      <WishListPage />
    </div>
  );
}
