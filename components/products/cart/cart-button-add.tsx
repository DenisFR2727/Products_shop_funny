"use client";
import { addProductToCart } from "@/lib/features/products/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import "./cart-button-add.scss";

export default function AddToCart({ product }: any) {
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector((state) =>
    state.cartReducer.cart.some((item) => item.id === product.id)
  );

  return (
    <div
      className={`cart-item-add cart-hover-add ${isInCart ? "disabled-cart-add" : ""}`}
      onClick={() => dispatch(addProductToCart(product))}
    >
      {isInCart ? "Thank You" : "ADD TO CART"}
    </div>
  );
}
