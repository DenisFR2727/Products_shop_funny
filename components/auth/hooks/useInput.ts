import { useState } from "react";

export default function useInput(defaultValue: any) {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEnteredValue(e.target.value);
    setDidEdit(false);
  }

  function handleInputBlur() {
    setDidEdit(true);
  }

  return { value: enteredValue, handleChangeInput, handleInputBlur };
}
