"use client";
import {
  addProductToCart,
  setShowProgress,
} from "@/lib/features/products/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { IProducts } from "@/lib/types";

import "./cart-button-add.scss";

export default function AddToCart({ product }: { product: IProducts }) {
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector((state) =>
    state.cartReducer.cart.some((item) => item.id === product.id)
  );

  const addProductButton = () => {
    dispatch(addProductToCart(product));
    dispatch(setShowProgress(true));
  };

  return (
    <div
      className={`cart-item-add cart-hover-add ${isInCart ? "disabled-cart-add" : ""}`}
      onClick={addProductButton}
    >
      {isInCart ? "Thank You" : "ADD TO CART"}
    </div>
  );
}
