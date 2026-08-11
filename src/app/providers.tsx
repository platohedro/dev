"use client";

import { useRouter } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n/config";
import { CartProvider } from "./components/CartProvider";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isTypingField || !event.ctrlKey || !event.altKey || event.shiftKey || event.metaKey) return;
      if (event.code !== "KeyY" && event.key.toLowerCase() !== "y") return;

      event.preventDefault();
      router.push("/admin");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return <I18nextProvider key={language} i18n={i18n}><CartProvider>{children}</CartProvider></I18nextProvider>;
}
