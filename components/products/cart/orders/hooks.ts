import { useEffect, useState } from "react";

interface ValueClientInputs {
  title: string;
  name: string;
  lastName: string;
  address: string;
  country: string;
  code: string;
}

export default function useShippingDetailsForm(state: any) {
  const [clientValue, setClientValue] = useState<ValueClientInputs>({
    title: "",
    name: "",
    lastName: "",
    address: "",
    country: "",
    code: "",
  });
  const [clientErrors, setClientErrors] = useState<ValueClientInputs>({
    title: "",
    name: "",
    lastName: "",
    address: "",
    country: "",
    code: "",
  });

  useEffect(() => {
    if (state?.errors) {
      setClientErrors((prev) => ({ ...prev, ...state.errors }));
    }
  }, [state]);

  const handleChangeError = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setClientValue((prev) => ({ ...prev, [name]: value }));

    if (value.length > 0) {
      setClientErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  return { clientValue, clientErrors, handleChangeError };
}
