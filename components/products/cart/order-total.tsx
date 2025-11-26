interface OrderTotalProps {
  subtotal: number;
  shipping: number;
  discountedSubtotal: number;
  discountedTotalPrice: number;
}

export default function OrderTotal({
  subtotal,
  shipping,
  discountedSubtotal,
  discountedTotalPrice,
}: OrderTotalProps) {
  return (
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
  );
}
