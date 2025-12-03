import { SlBasketLoaded } from "react-icons/sl";
import "./order-button.scss";

export default function OrderButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="order_button-cart">
      <SlBasketLoaded className="order_button-icon" />
      {children}
    </div>
  );
}
