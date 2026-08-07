import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import esTranslation from "./locales/es.json";
import esAbout from "./locales/es-about.json";
import enTranslation from "./locales/en.json";
import enAbout from "./locales/en-about.json";

i18n.use(initReactI18next).init({
  resources: {
    es: {
      translation: esTranslation,
      about: esAbout,
    },
    en: {
      translation: enTranslation,
      about: enAbout,
    },
  },
  // El idioma almacenado se aplica en el proveedor cliente después de hidratar.
  // Así el HTML de servidor y el primer render del navegador siempre coinciden.
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
