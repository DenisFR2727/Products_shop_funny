"use client";

import userCreate from "@/actions/signup";
import { useActionState, useState } from "react";
import styles from "../auth.module.scss";

export default function SignUp() {
  const [state, formAction] = useActionState(userCreate, null);

  return (
    <div className="sign__center">
      <h2 className="sign__logo">SIGN UP</h2>
      <form className="sign__form" action={formAction}>
        <h2 id="sign__h2">Sign Up</h2>
        <div className="sign__inputs">
          <div className="sign__username">
            <input
              className="sign__username-up"
              type="text"
              name="username"
              placeholder="User name"
            />
            {<p className={styles.error}>{state?.username}</p>}
          </div>
          <div className="sign__email">
            <input
              className="sign__email-up"
              type="email"
              name="email"
              placeholder="Email"
            />
            {<p className={styles.error}>{state?.email}</p>}
          </div>
          <div className="sign__phone">
            <input
              className="sign__phone-up"
              type="phone"
              name="phone"
              placeholder="Phone"
            />
            {<p className={styles.error}>{state?.phone}</p>}
          </div>
          <div className="sign__password">
            <input
              className="sign__password-up"
              type="password"
              name="password"
              placeholder="Password"
            />
            {<p className={styles.error}>{state?.password}</p>}
          </div>
          <div className="sign__confirm-pass">
            <input
              className="confirm__password-up"
              type="password"
              name="confirmPass"
              placeholder="Confirm password"
            />
            {<p className={styles.error}>{state?.confirmPass}</p>}
          </div>
        </div>
        <div>
          <button className="sign__btn">Sign up</button>
        </div>
      </form>
    </div>
  );
}
