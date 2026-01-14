import { InputHTMLAttributes } from "react";
import "./input.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  styles?: string;
  icon?: React.ReactNode;
  error?: string | false;
}

export default function Input({
  styles,
  className,
  icon,
  error,
  ...props
}: InputProps) {
  return (
    <>
      <div className={styles}>
        <span>{icon}</span>
        <input className={className} {...props} />
      </div>
      <div className="error_field">
        {error && <p className="error-text">{error}</p>}
      </div>
    </>
  );
}
