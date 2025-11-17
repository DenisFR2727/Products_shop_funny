"use client";
import { memo } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addProductToCart,
  CartProduct,
  setShowProgress,
} from "@/lib/features/products/cartSlice";

import "./cart-products-icon.scss";

interface ProductCartProps {
  product: CartProduct;
}

const Cart = memo(function ({ product }: ProductCartProps) {
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector((state) =>
    state.cartReducer.cart.some((item) => item.id === product.id)
  );

  const addProduct = () => {
    dispatch(addProductToCart(product));
    dispatch(setShowProgress(true));
  };
  return (
    <div className="cart">
      <TiShoppingCart
        className={`cart-item cart-hover ${isInCart ? "disabled-cart" : ""}`}
        onClick={addProduct}
      />
    </div>
  );
});
export default Cart;
