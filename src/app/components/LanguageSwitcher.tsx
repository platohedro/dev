import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 p-2 rounded-md bg-transparent hover:bg-white/10 text-current"
          aria-label={t("language.label")}
        >
          <Globe size={16} />
          <span className="hidden sm:inline">{i18n.language === "es" ? "ES" : "EN"}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          className={i18n.language === "es" ? "bg-primary/10" : ""}
          onClick={() => changeLanguage("es")}
        >
          {t("language.es")}
          {i18n.language === "es" && " ✓"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={i18n.language === "en" ? "bg-primary/10" : ""}
          onClick={() => changeLanguage("en")}
        >
          {t("language.en")}
          {i18n.language === "en" && " ✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}