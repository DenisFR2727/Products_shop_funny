"use client";
import { useActionState, useEffect, useState } from "react";
import styles from "./shipping-details.module.scss";
import OrderButton from "./order-button";
import addressCreate from "@/actions/address";
import SubmitForm from "./submit-form";
import useShippingDetailsForm from "./hooks";

export default function ShippingForm() {
  const [state, formAction] = useActionState(addressCreate, null);
  const { clientValue, clientErrors, handleChangeError } =
    useShippingDetailsForm(state);

  return (
    <div className={styles.shipping}>
      <h2>Shipping Details</h2>
      <form action={formAction}>
        <div className={styles.title_name}>
          <div className={styles.shipping_title}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Mr."
              name="title"
              value={clientValue.title}
              onChange={handleChangeError}
            />
            <p className={styles.error}>{clientErrors.title}</p>
          </div>
          <div className={styles.shipping_name}>
            <label htmlFor="name">First Name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              name="name"
              value={clientValue.name}
              onChange={handleChangeError}
            />
            <p className={styles.error}>{clientErrors.name}</p>
          </div>
          <div className={styles.shipping_last_name}>
            <label htmlFor="last_name">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={clientValue.lastName}
              onChange={handleChangeError}
            />
            <p className={styles.error}>{clientErrors.lastName}</p>
          </div>
        </div>
        <div className={styles.shipping_address}>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            placeholder="address"
            name="address"
            value={clientValue.address}
            onChange={handleChangeError}
          />
          <p className={styles.error}>{clientErrors.address}</p>
        </div>
        <div className={styles.shipping_country}>
          <div className={styles.shipping_country_item}>
            <label htmlFor="address">Country</label>
            <input
              id="country"
              type="text"
              placeholder="country"
              name="country"
              value={clientValue.country}
              onChange={handleChangeError}
            />
            <p className={styles.error}>{clientErrors.country}</p>
          </div>
          <div className={styles.shipping_zip_item}>
            <label htmlFor="address">Zip Code</label>
            <input
              id="code"
              type="text"
              placeholder="code"
              name="code"
              value={clientValue.code}
              onChange={handleChangeError}
            />

            <p className={styles.error}>{clientErrors.code}</p>
          </div>
        </div>
        <div className={styles.shipping_contacts}>
          <h2>Contact information</h2>
          <div className={styles.shipping_contact_information}>
            <div className={styles.shipping_email}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                placeholder="email"
                name="email"
                value={clientValue.email}
                onChange={handleChangeError}
              />
              <p className={styles.error}>{clientErrors.email}</p>
            </div>
            <div className={styles.shipping_phone}>
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="text"
                placeholder="phone"
                name="phone"
                value={clientValue.phone}
                onChange={handleChangeError}
              />
              <p className={styles.error}>{clientErrors.phone}</p>
            </div>
          </div>
        </div>
        <OrderButton>
          <SubmitForm />
        </OrderButton>
      </form>
    </div>
  );
}
