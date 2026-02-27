import { PropsField } from "./types";

export default function Field({ id, label, ...props }: PropsField) {
  return (
    <>
      <label htmlFor={id}>{label}</label>

      {props.as === "select" ? (
        <select id={id} {...props}>
          {props.children}
        </select>
      ) : (
        <input id={id} {...props} />
      )}
    </>
  );
}
