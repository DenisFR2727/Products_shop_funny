"use client";
import { createContext, useEffect, useState } from "react";

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
  themeFilterBtn: string;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light_theme",
  toggleTheme: () => {},
  themeFilterBtn: "light_theme-btn",
});

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light_theme");
  const [themeFilterBtn, setThemeFilterBtn] = useState("light_theme-btn");

  const toggleTheme = () => {
    setTheme((prevTheme: string) =>
      prevTheme === "light_theme" ? "dark_theme" : "light_theme"
    );
    setThemeFilterBtn((prevTheme) =>
      prevTheme === "light_theme-btn" ? "dark_theme-btn" : "light_theme-btn"
    );
  };

  useEffect(() => {
    document.body.classList.remove("light_theme", "dark_theme");
    document.body.classList.add(theme);

    const page = document.getElementById("page");
    const headers = document.getElementsByTagName("header");

    for (const header of headers) {
      header.classList.remove("light_theme", "dark_theme");
      header.classList.add(theme);
    }
    if (page) {
      page.classList.remove("light_theme", "dark_theme");
      page.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeFilterBtn }}>
      {children}
    </ThemeContext.Provider>
  );
}
