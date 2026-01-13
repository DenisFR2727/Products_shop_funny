import "./input.scss";

export default function Input({
  styles,
  classesInput,
  icon,
  error,
  ...props
}: any) {
  return (
    <>
      <div className={styles}>
        <span>{icon}</span>
        <input className={classesInput} {...props} />
      </div>
      <div className="error_field">
        {error && <p className="error-text">{error}</p>}
      </div>
    </>
  );
}
