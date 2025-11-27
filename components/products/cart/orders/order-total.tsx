"use client";
import { useAppSelector } from "@/lib/hooks";
import {
  selectDiscountedSubtotal,
  selectDiscountedTotalPrice,
  selectShipping,
  selectSubtotal,
} from "@/lib/selectors/cartSelectors";

import styles from "../cart.module.scss";
import "./order-total.scss";

export default function OrderTotal() {
  const shipping = useAppSelector(selectShipping);
  const subtotal = useAppSelector(selectSubtotal);
  const discountedSubtotal = useAppSelector(selectDiscountedSubtotal);
  const discountedTotalPrice = useAppSelector(selectDiscountedTotalPrice);

  return (
    <div className={`${styles.order_total} order-total`}>
      <div className={`${styles.order_total_border} order_total_border`}>
        <p className={`${styles.subtotal} subtotal`}>
          <span>Subtotal</span>
          <span>$ {subtotal.toFixed(2)}</span>
        </p>
        <p
          className={`${styles.shipping} shipping ${styles.shipping_line} shipping_line`}
        >
          <span>Shipping</span>
          <span>$ {shipping}</span>
        </p>
        <p className={`${styles.tax} tax ${styles.tax_line} tax_line`}>
          <span>With discount:</span>
          <span>$ {discountedSubtotal.toFixed(2)}</span>
        </p>
        <p
          className={`${styles.order_total_sum} order_total_sum ${styles.total_line} total_line`}
        >
          <span>Order Total</span>
          <span>$ {discountedTotalPrice.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
