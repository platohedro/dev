"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Menu, Moon, ShoppingCart, Sun, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "./CartProvider";

const logo = "/logos/ph.png";

export function SiteHeader() {
  const { t } = useTranslation();
  const [navOpen, setNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { count } = useCart();

  const applyTheme = (dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  };

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  const links = [
    [t("nav.education"), "/d-formacion"],
    [t("nav.residencies"), "/residencias"],
    [t("nav.technology"), "/tecnologia"],
    [t("nav.shop"), "/#shop"],
    [t("nav.events"), "/eventos"],
    [t("nav.about"), "/about"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#003d7a]/15 bg-white/95 text-[#003d7a] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <a href="/" className="flex shrink-0 items-center" aria-label="Platohedro">
          <img src={logo} alt="Platohedro" className="h-12 w-[76px] object-contain" />
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => <a key={href} href={href} className="whitespace-nowrap px-4 py-2 text-sm text-[#003d7a]/85 transition-colors hover:text-[#ff46a2]">{label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href="/tienda/carrito" aria-label="Carrito" className="relative p-2 text-[#003d7a] hover:text-[#ff46a2]"><ShoppingCart size={18} />{count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#99CC33] px-1 text-xs font-bold text-[#003d7a]">{count}</span>}</a>
          <a href="/#donate" className="group flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-foreground"><Heart size={14} className="transition-transform group-hover:scale-110" />{t("nav.donate")}</a>
        </div>
        <button type="button" aria-label={isDark ? t("theme.light") : t("theme.dark")} onClick={() => { const next = !isDark; setIsDark(next); applyTheme(next); }} className="mr-2 cursor-pointer rounded-md p-2 text-[#003d7a] transition-all duration-200 ease-out hover:scale-105 hover:bg-[#003d7a]/10 hover:shadow-[0_0_0_1px_rgba(0,61,122,0.25)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003d7a]/80">{isDark ? <Sun size={16} /> : <Moon size={16} />}</button>
        <LanguageSwitcher />
        <button
          type="button"
          className="cursor-pointer rounded-md p-2 text-[#003d7a] transition-all duration-200 ease-out hover:scale-105 hover:bg-[#003d7a]/10 hover:shadow-[0_0_0_1px_rgba(0,61,122,0.25)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003d7a]/80 lg:hidden"
          onClick={() => setNavOpen((open) => !open)}
          aria-label={navOpen ? t("menu.close") : t("menu.open")}
        >
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {navOpen && <div className="space-y-4 border-t border-[#003d7a]/15 bg-white px-6 py-6 lg:hidden">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setNavOpen(false)} className="block py-1 text-sm text-[#003d7a]/85 hover:text-[#ff46a2]">{label}</a>)}
        <a href="/#donate" onClick={() => setNavOpen(false)} className="flex w-fit items-center gap-2 bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"><Heart size={14} />{t("nav.donate")}</a>
      </div>}
    </header>
  );
}
