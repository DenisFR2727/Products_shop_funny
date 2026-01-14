import { useState } from "react";

export default function useInput(defaultValue: any, validationFn: any) {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  const valueIsValid = validationFn(enteredValue);

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredValue(e.target.value);
    setDidEdit(false);
  }

  function handleInputBlur() {
    setDidEdit(true);
  }
  function reset() {
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
