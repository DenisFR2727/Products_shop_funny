"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<div style={{ display: "none" }} />}
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
