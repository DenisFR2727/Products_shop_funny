"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import SpinnerItem from "@/components/spinners/spinner";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
}
