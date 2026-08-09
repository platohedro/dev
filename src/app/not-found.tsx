"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Calendar, Compass, Home, Mail, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/app/components/SiteHeader";

export default function NotFound() {
  const { t } = useTranslation();

  const links = [
    { href: "/", label: t("notFound.home"), icon: Home },
    { href: "/eventos", label: t("notFound.events"), icon: Calendar },
    { href: "/#shop", label: t("notFound.shop"), icon: ShoppingBag },
    { href: "/#donate", label: t("notFound.contact"), icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center md:px-10">
        <div className="mb-6 flex items-center gap-3 text-[#FF46A2]">
          <Compass size={22} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {t("notFound.eyebrow")}
          </span>
        </div>

        <p
          className="mb-2 text-[7rem] font-bold leading-none text-[#0051A2] md:text-[10rem]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          404
        </p>

        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{t("notFound.title")}</h1>
        <p className="mb-10 max-w-md text-sm text-muted-foreground md:text-base">
          {t("notFound.description")}
        </p>

        <div className="grid w-full gap-3 sm:grid-cols-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-center gap-2 border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-[#0051A2] hover:text-[#0051A2]"
            >
              <Icon size={16} className="text-[#FF46A2] transition-transform group-hover:scale-110" />
              {label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
