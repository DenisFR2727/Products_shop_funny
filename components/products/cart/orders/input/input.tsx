"use client";
interface InputShippingProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  styles?: any;
  label: string;
  error?: string;
}

export default function Input({
  styles,
  label,
  error,
  id,
  ...props
}: InputShippingProps) {
  return (
    <div className={styles?.shipping_title}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {error && <p className={styles?.error}>{error}</p>}
    </div>
  );
}
