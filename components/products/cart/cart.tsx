"use client";

import { useAppSelector } from "@/lib/hooks";

import { selectOrders } from "@/lib/selectors/cartSelectors";
import OrderButton from "./orders/order-button";
import OrderTotal from "./orders/order-total";
import OrdersList from "./orders/orders-list";
import Link from "next/link";

import styles from "./cart.module.scss";

export default function CartProducts() {
  const orders = useAppSelector(selectOrders);

  return (
    <>
      {orders.length === 0 ? (
        <div className={styles.cart}>
          <h1>You Cart Is Empty</h1>
          <span className={styles.cart_line}></span>
        </div>
      ) : (
        <div className={styles.cart}>
          <h1>Shopping Cart</h1>
          <span className={styles.cart_line}></span>
          <div className={styles.cart_items_block}>
            <OrdersList />
            <div className={styles.order_products_total}>
              <OrderTotal />
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
