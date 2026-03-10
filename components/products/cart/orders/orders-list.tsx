"use client";
import {
  amountToPriceProduct,
  removeOrder,
} from "@/lib/features/products/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectOrders } from "@/lib/selectors/cartSelectors";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useState } from "react";

import classes from "../cart.module.scss";

export default function OrdersList() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const { t } = useTranslation();
  const [openImageOrder, setOpenImageOrder] = useState<
    number | undefined | null
  >(null);

  return (
    <ul className={classes.cart_order}>
      {orders.map((order) => (
        <li key={order.id}>
          <div className={classes.order_img}>
            <img
              src={order?.thumbnail}
              alt={order.title}
              onClick={() => setOpenImageOrder(order.id)}
            />
          </div>
          {openImageOrder === order.id && (
            <ModalImageOrder onClose={() => setOpenImageOrder(undefined)}>
              <img src={order?.thumbnail} alt={order.title} />
            </ModalImageOrder>
          )}
          <div className={classes.order_title}>
            <h2>{order.title}</h2>
            <span className={classes.order_title_item}>{order.brand}</span>
            <span className={classes.order_title_item}>{order.category}</span>
          </div>
          <div className={classes.amount_price_block}>
            <div className={classes.order_amount}>
              <h2>{t("Amount")}</h2>
              <select
                value={order.amount}
                className={`${classes.order_amount_item} ${classes.order_select}`}
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
                className={`${classes.order_amount_item} ${classes.order_remove}`}
                onClick={() => dispatch(removeOrder(order.id))}
              >
                {t("remove")}
              </button>
            </div>
            <div className={classes.order_price}>
              <span className={classes.order_price_item}>$ {order.price}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ModalImageOrder({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return createPortal(
    <dialog className={classes.overlay} open onClick={onClose}>
      <div className={classes.modal}>{children}</div>
    </dialog>,
    document.body as HTMLElement,
  );
}
