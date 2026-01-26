"use client";
import { useActionState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { prefixesCountrys } from "@/lib/api/codes-country";
import styles from "./shipping-details.module.scss";
import OrderButton from "./order-button";
import addressCreate from "@/actions/address";
import SubmitForm from "./submit-form";
import useShippingDetailsForm from "./hooks";
import Input from "./input/input";

export default function ShippingForm(): JSX.Element {
  const orders = useAppSelector((state) => state.cartReducer.cart);
  const [state, formAction] = useActionState<any, FormData>(
    (prev, formData) => addressCreate(prev, formData, orders),
    {},
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
          <Input
            styles={styles}
            label="Title"
            id="title"
            type="text"
            placeholder="Mr."
            name="title"
            value={clientValue.title}
            onChange={handleChangeError}
            error={clientErrors.title}
          />
          <Input
            styles={styles}
            label="First Name"
            id="name"
            type="text"
            placeholder="Name"
            name="name"
            value={clientValue.name}
            onChange={handleChangeError}
            error={clientErrors.name}
          />
          <Input
            styles={styles}
            label="Last Name"
            id="lastName"
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={clientValue.lastName}
            onChange={handleChangeError}
            error={clientErrors.lastName}
          />
          <Input
            styles={styles}
            label="Address"
            id="address"
            type="text"
            placeholder="address"
            name="address"
            value={clientValue.address}
            onChange={handleChangeError}
            error={clientErrors.address}
          />
        </div>
        <div className={styles.shipping_country}>
          <Input
            styles={styles}
            label="Country"
            id="country"
            type="text"
            placeholder="country"
            name="country"
            value={clientValue.country}
            onChange={handleChangeError}
            error={clientErrors.country}
          />
          <Input
            styles={styles}
            label="Zip Code"
            id="code"
            type="text"
            placeholder="code"
            name="code"
            value={clientValue.code}
            onChange={handleChangeError}
            error={clientErrors.code}
          />
        </div>
        <div className={styles.shipping_contacts}>
          <h2>Contact information</h2>
          <div className={styles.shipping_contact_information}>
            <Input
              styles={styles}
              label="Email"
              id="email"
              type="text"
              placeholder="email"
              name="email"
              value={clientValue.email}
              onChange={handleChangeError}
              error={clientErrors.email}
            />
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
                    ),
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
