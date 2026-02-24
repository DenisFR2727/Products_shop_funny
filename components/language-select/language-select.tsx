"use client";

import { useCallback, useEffect, useState } from "react";
import i18n from "@/lib/features/language/i18n";
import styles from "./select-language.module.css";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "uk", label: "Українська" },
] as const;

export default function LanguageSelect() {
  const [currentLang, setCurrentLang] = useState(i18n.language?.split("-")[0] || "en");

  useEffect(() => {
    const handler = (lng: string) => setCurrentLang(lng?.split("-")[0] || "en");
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as "en" | "uk";
      i18n.changeLanguage(value);
      setCurrentLang(value);
    },
    []
  );

  return (
    <select
      className={styles.selectLanguage}
      value={currentLang}
      onChange={handleChange}
      aria-label="Select language"
    >
      {LANGUAGES.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
