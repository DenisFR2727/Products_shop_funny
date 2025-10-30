"use client";
import {
  addProductToCart,
  setShowProgress,
} from "@/lib/features/products/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import "./cart-button-add.scss";

export default function AddToCart({ product }: any) {
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector((state) =>
    state.cartReducer.cart.some((item) => item.id === product.id)
  );

  const addProduct = () => {
    if (isInCart) return;
    dispatch(addProductToCart(product));
    dispatch(setShowProgress(true));
  };
  return (
    <div
      className={`cart-item-add cart-hover-add ${isInCart ? "disabled-cart-add" : ""}`}
      onClick={addProduct}
    >
      {isInCart ? "Thank You" : "ADD TO CART"}
    </div>
  );
}
