"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import "./input.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  styles?: string;
  icon?: React.ReactNode;
  error?: string | false;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ styles, className, icon, error, ...props }, ref) => {
    return (
      <>
        <div className={styles}>
          {icon && <span>{icon}</span>}
          <input ref={ref} className={className} {...props} />
        </div>
        <div className="error_field">
          {error && <p className="error-text">{error}</p>}
        </div>
      </>
    );
  },
);

Input.displayName = "Input";

export default Input;
