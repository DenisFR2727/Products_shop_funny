"use client";

import {
  amountToPriceProduct,
  removeOrder,
} from "@/lib/features/products/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import "./cart.scss";
import {
  selectDiscountedSubtotal,
  selectDiscountedTotalPrice,
  selectOrders,
  selectShipping,
  selectSubtotal,
} from "@/lib/selectors/cartSelectors";
import OrderButton from "./orders/order-button";
import OrderTotal from "./orders/order-total";
import OrdersList from "./orders/orders-list";
import Link from "next/link";

export default function CartProducts() {
  const orders = useAppSelector(selectOrders);
  const shipping = useAppSelector(selectShipping);
  const subtotal = useAppSelector(selectSubtotal);
  const discountedSubtotal = useAppSelector(selectDiscountedSubtotal);
  const discountedTotalPrice = useAppSelector(selectDiscountedTotalPrice);

  return (
    <>
      {orders.length === 0 ? (
        <div className="cart">
          <h1>You Cart Is Empty</h1>
          <span className="cart-line"></span>
        </div>
      ) : (
        <div className="cart">
          <h1>Shopping Cart</h1>
          <span className="cart-line"></span>
          <div className="cart-items-block">
            <OrdersList />
            <div className="order-products-total">
              <OrderTotal
                subtotal={subtotal}
                shipping={shipping}
                discountedSubtotal={discountedSubtotal}
                discountedTotalPrice={discountedTotalPrice}
              />
              <Link href={"/orders"}>
                <OrderButton>Orders products</OrderButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
