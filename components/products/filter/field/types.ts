import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  Ref,
} from "react";

type BaseProps = {
  label: string;
  id: string;
  ref?: Ref<{ focus: () => void } | null>;
};

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "ref"> & {
    as?: "input";
  };

type SelectProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    as: "select";
    children: ReactNode;
  };
type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };
export type PropsField = InputProps | SelectProps | TextareaProps;
