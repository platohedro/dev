"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n/config";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [language, setLanguage] = useState<"es" | "en">("es");

  useEffect(() => {
    const syncLanguage = (nextLanguage: string) => {
      setLanguage(nextLanguage.startsWith("en") ? "en" : "es");
    };
    const savedLanguage = window.localStorage.getItem("i18nextLng");
    const initialLanguage = savedLanguage === "en" ? "en" : "es";

    i18n.on("languageChanged", syncLanguage);
    i18n.changeLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;

    return () => i18n.off("languageChanged", syncLanguage);
  }, []);

  return <I18nextProvider key={language} i18n={i18n}>{children}</I18nextProvider>;
}
