"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Login() {
  const [enteredValue, setEnteredValue] = useState({
    email: "",
    password: "",
  });
  const [didEdit, setDidEdit] = useState({
    email: false,
    password: false,
  });

  const isEmailInValid = didEdit.email && !enteredValue.email.includes("@");
  const isPasswordInValid =
    didEdit.password && enteredValue.password.trim().length < 6;

  function handleChangeInput(
    identifier: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setEnteredValue((prevValue) => ({
      ...prevValue,
      [identifier]: e.target.value,
    }));
  }
  function handleInputBlur(identifier: string) {
    setDidEdit((prevValue) => ({
      ...prevValue,
      [identifier]: true,
    }));
  }
  return (
    <div className="login__center">
      <h2 className="login__logo">LOGO HERE</h2>
      <form className="login__form">
        <h2 id="login__h2">Login</h2>
        <div className="login__inputs">
          <div className="login__email">
            <span>
              <FontAwesomeIcon className="user__icon" icon={faUser} />
            </span>
            <input
              className="email"
              type="email"
              name="email"
              placeholder="Username"
              required
              value={enteredValue.email}
              onBlur={() => handleInputBlur("email")}
              onChange={(e) => handleChangeInput("email", e)}
            />
          </div>
          <div>
            {isEmailInValid && (
              <p className="error-text">Please enter a valid email address!</p>
            )}
          </div>
          <div className="login__password">
            <span>
              <FontAwesomeIcon className="lock__icon" icon={faLock} />
            </span>
            <input
              className="password"
              type="password"
              name="password"
              placeholder="Password"
              required
              value={enteredValue.password}
              onBlur={() => handleInputBlur("password")}
              onChange={(e) => handleChangeInput("password", e)}
            />
          </div>
          <div>{isPasswordInValid && <p>Please to mutch password!</p>}</div>
        </div>
        <div>
          <button className="login__btn">Login</button>
        </div>
      </form>
    </div>
  );
}
