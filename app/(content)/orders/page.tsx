import OrderTotal from "@/components/products/cart/orders/order-total";
import ShippingForm from "@/components/products/cart/orders/shipping-details-form";

import "./styles.scss";

export default function OrderPage() {
  return (
    <div>
      <div className="shipping_product-info">
        <ShippingForm />
        <div className="order_total-product">
          <OrderTotal />
        </div>
      </div>
    </div>
  );
}
