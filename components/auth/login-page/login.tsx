"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import Input from "../input/input";
import useInput from "../hooks/useInput";
import { hasMinLength, isEmail, isNotEmpty } from "../util/validation";
import { useActionState, useEffect } from "react";
import { isLogin } from "@/actions/login";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [state, formAction] = useActionState(isLogin, null);
  const {
    value: emailValue,
    handleChangeInput: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", (value: string) => isEmail(value) && isNotEmpty(value));
  const {
    value: passwordValue,
    handleChangeInput: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
  } = useInput(
    "",
    (value: string) => isNotEmpty(value) && hasMinLength(value, 6)
  );

  // // // 👉 якщо логін успішний — редірект
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <div className="login__center">
      <h2 className="login__logo">LOGO HERE</h2>
      <form className="login__form" action={formAction}>
        <h2 id="login__h2">Login</h2>
        <div className="login__inputs">
          <Input
            styles="login__email"
            className="email"
            icon={<FontAwesomeIcon className="user__icon" icon={faUser} />}
            type="email"
            name="email"
            placeholder="Username"
            required
            value={emailValue}
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            error={emailHasError && "Please enter a valid email address!"}
          />
          <Input
            styles="login__password"
            className="password"
            icon={<FontAwesomeIcon className="lock__icon" icon={faLock} />}
            type="password"
            name="password"
            placeholder="Password"
            required
            value={passwordValue}
            onBlur={handlePasswordBlur}
            onChange={handlePasswordChange}
            error={
              passwordHasError &&
              "The correct number of digits in the password is required!"
            }
          />
        </div>
        {state?.errors && (
          <div className="login__errors">
            {Object.entries(state.errors).map(([field, message]) => (
              <p key={field} style={{ color: "red", margin: "5px 0" }}>
                {message}
              </p>
            ))}
          </div>
        )}
        <div>
          <button className="login__btn">Login</button>
        </div>
      </form>
    </div>
  );
}
