"use client";

import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

interface PageThemeContainerProps {
  children: React.ReactNode;
}

export default function PageThemeContainer({
  children,
}: PageThemeContainerProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <div id="page" className={theme}>
      {children}
    </div>
  );
}
