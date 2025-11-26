import { SlBasketLoaded } from "react-icons/sl";
import "./order-button.scss";

export default function OrderButton({ children }: { children: string }) {
  return (
    <div>
      <button className="order_button-cart">
        <SlBasketLoaded className="order_button-icon" />
        {children}
      </button>
    </div>
  );
}
