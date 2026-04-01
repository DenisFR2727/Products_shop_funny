import { useImperativeHandle, useRef } from "react";
import { PropsField } from "./types";

export default function Field({ id, label, ref, ...props }: PropsField) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current?.focus();
      },
    };
  }, []);

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
        <input ref={inputRef} id={id} {...props} />
      )}
    </>
  );
}
