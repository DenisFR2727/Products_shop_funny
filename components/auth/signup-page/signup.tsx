"use client";

import userCreate from "@/actions/signup";
import { useActionState, useEffect, useRef } from "react";
import styles from "../auth.module.scss";
import Input from "../input/input";

export default function SignUp() {
  const [state, formAction] = useActionState(userCreate, null);
  const focusInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    focusInput.current?.focus();
  }, []);

  return (
    <div className="sign__center">
      <h2 className="sign__logo">SIGN UP</h2>
      <form className="sign__form" action={formAction}>
        <h2 id="sign__h2">Sign Up</h2>
        <div className="sign__inputs">
          <div className="sign__username">
            <Input
              ref={focusInput}
              className="sign__username-up"
              type="text"
              name="username"
              placeholder="User name"
            />
            {<p className={styles.error}>{state?.username}</p>}
          </div>
          <div className="sign__email">
            <Input
              className="sign__email-up"
              type="email"
              name="email"
              placeholder="Email"
            />
            {<p className={styles.error}>{state?.email}</p>}
          </div>
          <div className="sign__phone">
            <Input
              className="sign__phone-up"
              type="phone"
              name="phone"
              placeholder="Phone"
            />
            {<p className={styles.error}>{state?.phone}</p>}
          </div>
          <div className="sign__password">
            <Input
              className="sign__password-up"
              type="password"
              name="password"
              placeholder="Password"
            />
            {<p className={styles.error}>{state?.password}</p>}
          </div>
          <div className="sign__confirm-pass">
            <Input
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
