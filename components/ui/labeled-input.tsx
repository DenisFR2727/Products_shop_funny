"use client";

import type { InputHTMLAttributes } from "react";

export type LabeledInputStyles = {
  field?: string;
  error?: string;
};

type LabeledInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  styles?: LabeledInputStyles;
};

export default function LabeledInput({
  styles,
  label,
  error,
  id,
  ...props
}: LabeledInputProps) {
  return (
    <div className={styles?.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {error && <p className={styles?.error}>{error}</p>}
    </div>
  );
}
