import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

import "../auth.scss";

export default function Login() {
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
            />
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
            />
          </div>
        </div>
        <div>
          <button className="login__btn">Login</button>
        </div>
      </form>
    </div>
  );
}
