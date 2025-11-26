import {
  amountToPriceProduct,
  removeOrder,
} from "@/lib/features/products/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectOrders } from "@/lib/selectors/cartSelectors";

export default function OrdersList() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);

  return (
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
                ).map((n) => (
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
  );
}
