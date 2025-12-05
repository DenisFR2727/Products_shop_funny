"use client";
import { useActionState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { prefixesCountrys } from "@/lib/api/codes-country";
import styles from "./shipping-details.module.scss";
import OrderButton from "./order-button";
import addressCreate from "@/actions/address";
import SubmitForm from "./submit-form";
import useShippingDetailsForm from "./hooks";

export default function ShippingForm(): JSX.Element {
  const orders = useAppSelector((state) => state.cartReducer.cart);
  const [state, formAction] = useActionState<any, FormData>(
    (prev, formData) => addressCreate(prev, formData, orders),
    null
  );

  const {
    clientValue,
    clientErrors,
    handleChangeError,
    changePrefixCountry,
    setClientValue,
  } = useShippingDetailsForm(state);

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
              <div className={styles.selectContent}>
                <select
                  className={styles.select}
                  name="phonePrefix"
                  id="phonePrefix"
                  value={clientValue.phonePrefix}
                  onChange={(e) => changePrefixCountry(e.target.value)}
                >
                  <option value="380">+380 {prefixesCountrys[380][0]}</option>
                  {Object.entries(prefixesCountrys).map(
                    ([code, [short, _full]]) => (
                      <option key={code} value={code}>
                        {`+${code}`} {short}
                      </option>
                    )
                  )}
                </select>
                <div>
                  <input
                    id="phone"
                    type="text"
                    placeholder="phone"
                    name="phone"
                    value={`+${clientValue.phonePrefix}${clientValue.phone}`}
                    onChange={(e) => {
                      let input = e.target.value;

                      let digits = input.replace(/\D/g, "");

                      if (!digits) {
                        setClientValue({
                          ...clientValue,
                          phonePrefix: "",
                          phone: "",
                        });
                        return;
                      }
                      const prefixLength = clientValue.phonePrefix?.length || 3;

                      const newPrefix = digits.slice(0, prefixLength);
                      const newPhone = digits.slice(prefixLength);

                      setClientValue({
                        ...clientValue,
                        phonePrefix: newPrefix,
                        phone: newPhone,
                      });
                    }}
                  />
                </div>
              </div>
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
