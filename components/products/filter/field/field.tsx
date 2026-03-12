import { PropsField } from "./types";

export default function Field({ id, label, ...props }: PropsField) {
  return (
    <>
      <label htmlFor={id}>{label}</label>

      {props.as === "select" ? (
        <select id={id} {...props}>
          {props.children}
        </select>
      ) : props.as === "textarea" ? (
        <div style={{ position: "relative" }}>
          <textarea id={id} {...props} />
          {props.children}
        </div>
      ) : (
        <input id={id} {...props} />
      )}
    </>
  );
}
