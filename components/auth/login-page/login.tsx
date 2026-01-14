"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import Input from "../input/input";
import useInput from "../hooks/useInput";

export default function Login() {
  const {
    value: emailValue,
    handleChangeInput: handleEmailChange,
    handleInputBlur: handleEmailBlur,
  } = useInput("");
  const {
    value: passwordValue,
    handleChangeInput: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
  } = useInput("");

  const isEmailInValid = didEdit.email && !enteredValue.email.includes("@");
  const isPasswordInValid =
    didEdit.password && enteredValue.password.trim().length < 6;

  //   function handleChangeInput(
  //     identifier: string,
  //     e: React.ChangeEvent<HTMLInputElement>
  //   ) {
  //     setEnteredValue((prevValue) => ({
  //       ...prevValue,
  //       [identifier]: e.target.value,
  //     }));
  //     setDidEdit((prevValue) => ({
  //       ...prevValue,
  //       [identifier]: false,
  //     }));
  //   }
  //   function handleInputBlur(identifier: string) {
  //     setDidEdit((prevValue) => ({
  //       ...prevValue,
  //       [identifier]: true,
  //     }));
  //   }
  return (
    <div className="login__center">
      <h2 className="login__logo">LOGO HERE</h2>
      <form className="login__form">
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
            error={isEmailInValid && "Please enter a valid email address!"}
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
            error={isPasswordInValid && "Please to mutch password!"}
          />
        </div>
        <div>
          <button className="login__btn">Login</button>
        </div>
      </form>
    </div>
  );
}
