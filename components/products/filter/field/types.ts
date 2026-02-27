import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

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

export type PropsField = InputProps | SelectProps;
