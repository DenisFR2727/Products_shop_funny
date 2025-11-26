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
import OrderButton from "./order-button";

export default function CartProducts() {
  const dispatch = useAppDispatch();
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
            <ul className="cart-order">
              {orders.map((order) => (
                <li key={order.id}>
                  <div className="order-img">
                    <img src={order?.thumbnail} alt={order.title} />
                  </div>
                  <div className="order-title">
                    <h2>{order.title}</h2>
                    <span className="order-title-item">{order.brand}</span>
                    <span className="order-title-item">{order.category}</span>
                  </div>
                  <div className="amount-price-block">
                    <div className="order-amount">
                      <h2>Amount</h2>
                      <select
                        value={order.amount}
                        className="order-amount-item order-select"
                        onChange={(e) =>
                          dispatch(
                            amountToPriceProduct({
                              id: order.id,
                              amount: Number(e.target.value),
                            })
                          )
                        }
                      >
                        {Array.from(
                          { length: order.stock },
                          (_, index) => index + 1
                        ).map((n, i) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <button
                        className="order-amount-item order-remove"
                        onClick={() => dispatch(removeOrder(order.id))}
                      >
                        remove
                      </button>
                    </div>
                    <div className="order-price">
                      <span className="order-price-item">$ {order.price}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="order-products-total">
              <div className="order-total">
                <div className="order-total-border">
                  <p className="subtotal ">
                    <span>Subtotal</span>
                    <span>$ {subtotal.toFixed(2)}</span>
                  </p>
                  <p className="shipping shipping-line">
                    <span>Shipping</span>
                    <span>$ {shipping}</span>
                  </p>
                  <p className="tax tax-line">
                    <span>With discount:</span>
                    <span>$ {discountedSubtotal.toFixed(2)}</span>
                  </p>
                  <p className="order-total-sum total-line">
                    <span>Order Total</span>
                    <span>$ {discountedTotalPrice.toFixed(2)}</span>
                  </p>
                </div>
              </div>
              <OrderButton href={"/orders"} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
