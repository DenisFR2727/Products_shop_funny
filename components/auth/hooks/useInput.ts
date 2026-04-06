import { useState } from "react";

export default function useInput(defaultValue: string, validationFn: (value: string) => boolean) {
  const [enteredValue, setEnteredValue] = useState<string>(defaultValue);
  const [didEdit, setDidEdit] = useState<boolean>(false);

  const valueIsValid = validationFn(enteredValue);

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>): void {
    setEnteredValue(e.target.value);
    setDidEdit(false);
  }

  function handleInputBlur(): void {
    setDidEdit(true);
  }
  function reset(): void {
    setEnteredValue(defaultValue);
    setDidEdit(false);
  }   
  return {
    value: enteredValue,
    handleChangeInput,
    handleInputBlur,
    hasError: didEdit && !valueIsValid,
    reset,
  };
}
