import CartProducts from "@/components/products/cart/cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart products",
  description: "Cart products and placing an order.",
};

export default function Cart() {
  return (
    <>
      <CartProducts />
    </>
  );
}
