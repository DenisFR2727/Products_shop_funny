import "./input.scss";

export default function Input({ classesInput, icon, error, ...props }: any) {
  return (
    <div>
      <div className="login__email">
        <span>{icon}</span>
        <input className={classesInput} {...props} />
      </div>
      <div className="error_field">
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}
