import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

type BaseProps = {
  label: string;
  id: string;
};

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
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
