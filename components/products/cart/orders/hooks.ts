"use client";
import { AddressDetails } from "@/actions/types";
import { useEffect, useState } from "react";

interface ValueClientInputs {
  title: string;
  name: string;
  lastName: string;
  address: string;
  country: string;
  code: string;
  email?: string;
  phone?: string;
  phonePrefix?: string;
}
type ErrorAddress = Partial<Record<keyof ValueClientInputs, string>>;
type State = AddressDetails | null;

export default function useShippingDetailsForm(state: State) {
  const [clientValue, setClientValue] = useState<ValueClientInputs>({
    title: "",
    name: "",
    lastName: "",
    address: "",
    country: "",
    code: "",
    email: "",
    phone: "",
    phonePrefix: "",
  });
  const [clientErrors, setClientErrors] = useState<ErrorAddress>({});

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
  const changePrefixCountry = (value: string) => {
    setClientValue((prevPrefix) => ({
      ...prevPrefix,
      phonePrefix: value,
    }));
  };

  return {
    clientValue,
    clientErrors,
    handleChangeError,
    changePrefixCountry,
    setClientValue,
  };
}
