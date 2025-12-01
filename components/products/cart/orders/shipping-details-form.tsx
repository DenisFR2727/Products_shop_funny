"use client";
import { useActionState } from "react";
import styles from "./shipping-details.module.scss";
import OrderButton from "./order-button";
import addressCreate from "@/actions/address";

export default function ShippingForm() {
  const [state, formAction] = useActionState(addressCreate, null);

  return (
    <div className={styles.shipping}>
      <h2>Shipping Details</h2>
      <form action={formAction}>
        <div className={styles.title_name}>
          <div className={styles.shipping_title}>
            <label htmlFor="title">Title</label>
            <input id="title" type="text" placeholder="Mr." name="title" />
          </div>
          <div className={styles.shipping_name}>
            <label htmlFor="name">First Name</label>
            <input id="name" type="text" placeholder="Name" name="name" />
          </div>
          <div className={styles.shipping_last_name}>
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              placeholder="Last Name"
              name="last_name"
            />
          </div>
        </div>
        <div className={styles.shipping_address}>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            placeholder="address"
            name="address"
          />
        </div>
        <div className={styles.shipping_country}>
          <div className={styles.shipping_country_item}>
            <label htmlFor="address">Country</label>
            <input
              id="country"
              type="text"
              placeholder="country"
              name="country"
            />
          </div>
          <div className={styles.shipping_zip_item}>
            <label htmlFor="address">Zip Code</label>
            <input id="code" type="text" placeholder="code" name="code" />
          </div>
        </div>
        <OrderButton>
          <button type="submit">Confirm order</button>
        </OrderButton>
      </form>
    </div>
  );
}
