import Link from "next/link";
import { SlBasketLoaded } from "react-icons/sl";
import "./order-button.scss";

export default function OrderButton({ href }: any) {
  return (
    <div>
      <Link href={href}>
        <button className="order_button-cart">
          <SlBasketLoaded className="order_button-icon" />
          Order products
        </button>
      </Link>
    </div>
  );
}
