"use client";
import {
  amountToPriceProduct,
  removeOrder,
} from "@/lib/features/products/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectOrders } from "@/lib/selectors/cartSelectors";

import styles from "../cart.module.scss";
import { useTranslation } from "react-i18next";

export default function OrdersList() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const { t } = useTranslation();

  return (
    <ul className={styles.cart_order}>
      {orders.map((order) => (
        <li key={order.id}>
          <div className={styles.order_img}>
            <img src={order?.thumbnail} alt={order.title} />
          </div>
          <div className={styles.order_title}>
            <h2>{order.title}</h2>
            <span className={styles.order_title_item}>{order.brand}</span>
            <span className={styles.order_title_item}>{order.category}</span>
          </div>
          <div className={styles.amount_price_block}>
            <div className={styles.order_amount}>
              <h2>{t("Amount")}</h2>
              <select
                value={order.amount}
                className={`${styles.order_amount_item} ${styles.order_select}`}
                onChange={(e) =>
                  dispatch(
                    amountToPriceProduct({
                      id: order.id,
                      amount: Number(e.target.value),
                    }),
                  )
                }
              >
                {Array.from(
                  { length: order.stock },
                  (_, index) => index + 1,
                ).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button
                className={`${styles.order_amount_item} ${styles.order_remove}`}
                onClick={() => dispatch(removeOrder(order.id))}
              >
                {t("remove")}
              </button>
            </div>
            <div className={styles.order_price}>
              <span className={styles.order_price_item}>$ {order.price}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
