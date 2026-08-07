import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

/**
 * Un solo botón, visible tanto en móvil como en escritorio. Evita depender de
 * un menú portalizado para una acción tan importante como cambiar el idioma.
 */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState<"es" | "en">("es");

  useEffect(() => {
    const syncLanguage = (nextLanguage: string) => {
      setLanguage(nextLanguage.startsWith("en") ? "en" : "es");
    };

    syncLanguage(i18n.resolvedLanguage ?? i18n.language);
    i18n.on("languageChanged", syncLanguage);
    return () => i18n.off("languageChanged", syncLanguage);
  }, [i18n]);

  const toggleLanguage = async () => {
    const nextLanguage = language === "es" ? "en" : "es";
    await i18n.changeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
    window.localStorage.setItem("i18nextLng", nextLanguage);
    setLanguage(nextLanguage);
  };

  const nextLanguageName = language === "es" ? t("language.en") : t("language.es");

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-2 rounded-md bg-transparent hover:bg-white/10 text-current"
      aria-label={`${t("language.label")}: ${nextLanguageName}`}
      title={`${t("language.label")}: ${nextLanguageName}`}
    >
      <Globe size={16} />
      <span className="text-xs font-bold">{language.toUpperCase()}</span>
    </button>
  );
}
