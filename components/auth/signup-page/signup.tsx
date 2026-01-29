"use client";

import userCreate from "@/actions/signup";
import { useActionState, useEffect, useRef } from "react";

import styles from "../auth.module.scss";
import Input from "../input/input";
import Link from "next/link";

export default function SignUp() {
  const [state, formAction] = useActionState(userCreate, {
    errors: null,
    values: {},
  });
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
              defaultValue={state.values.username}
            />
            {<p className={styles.error}>{state?.errors?.username}</p>}
          </div>
          <div className="sign__email">
            <Input
              className="sign__email-up"
              type="email"
              name="email"
              placeholder="Email"
              defaultValue={state.values.email}
            />
            {<p className={styles.error}>{state?.errors?.email}</p>}
          </div>
          <div className="sign__phone">
            <Input
              className="sign__phone-up"
              type="phone"
              name="phone"
              placeholder="Phone"
              defaultValue={state.values.phone}
            />
            {<p className={styles.error}>{state?.errors?.phone}</p>}
          </div>
          <div className="sign__password">
            <Input
              className="sign__password-up"
              type="password"
              name="password"
              placeholder="Password"
              defaultValue={state.values.password}
            />
            {<p className={styles.error}>{state?.errors?.password}</p>}
          </div>
          <div className="sign__confirm-pass">
            <Input
              className="confirm__password-up"
              type="password"
              name="confirmPass"
              placeholder="Confirm password"
              defaultValue={state.values.confirmPass}
            />
            {<p className={styles.error}>{state?.errors?.confirmPass}</p>}
          </div>
        </div>
        <div>
          <button className="sign__btn">Sign up</button>
        </div>
        <p className="sign__link-login">
          <Link href="/login">Already have an account? Login</Link>
        </p>
      </form>
    </div>
  );
}
