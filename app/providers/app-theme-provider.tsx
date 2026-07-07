"use client";

import { ThemeContextProvider } from "@/context/themeContext";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}
