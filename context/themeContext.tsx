"use client";
import "@/lib/features/language/i18n";
import { createContext, useEffect, useLayoutEffect, useState } from "react";

import {
  THEME_CLASSES,
  THEME_DARK,
  THEME_FILTER_BTN,
  THEME_LIGHT,
  type ThemeClass,
} from "@/config/theme";

interface ThemeContextProps {
  theme: ThemeClass;
  toggleTheme: () => void;
  themeFilterBtn: string;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: THEME_LIGHT,
  toggleTheme: () => {},
  themeFilterBtn: THEME_FILTER_BTN[THEME_LIGHT],
});

function isThemeClass(value: unknown): value is ThemeClass {
  return value === THEME_LIGHT || value === THEME_DARK;
}

function readStoredTheme(): ThemeClass | null {
  if (typeof window === "undefined") return null;

  const storedTheme = localStorage.getItem("theme");
  if (!storedTheme) return null;

  try {
    const parsedTheme = JSON.parse(storedTheme);
    if (!isThemeClass(parsedTheme)) return null;

    return parsedTheme;
  } catch {
    localStorage.removeItem("theme");
    return null;
  }
}

function applyThemeClass(theme: ThemeClass) {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(theme);

  const page = document.getElementById("page");
  const headers = document.getElementsByTagName("header");
  const footerContainers = document.querySelectorAll<HTMLElement>(
    ".footer-theme-container",
  );

  for (const header of headers) {
    header.classList.remove(...THEME_CLASSES);
    header.classList.add(theme);
  }

  for (const footer of footerContainers) {
    footer.classList.remove(...THEME_CLASSES);
    footer.classList.add(theme);
  }

  if (page) {
    page.classList.remove(...THEME_CLASSES);
    page.classList.add(theme);
  }
}

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeClass>(THEME_LIGHT);
  const [themeFilterBtn, setThemeFilterBtn] = useState<string>(
    THEME_FILTER_BTN[THEME_LIGHT],
  );

  useLayoutEffect(() => {
    const storedTheme = readStoredTheme();
    if (!storedTheme) return;

    setTheme(storedTheme);
    setThemeFilterBtn(THEME_FILTER_BTN[storedTheme]);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
      localStorage.setItem("theme", JSON.stringify(newTheme));
      setThemeFilterBtn(THEME_FILTER_BTN[newTheme]);
      return newTheme;
    });
  };

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeFilterBtn }}>
      {children}
    </ThemeContext.Provider>
  );
}
