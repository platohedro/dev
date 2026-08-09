"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/app/components/SiteHeader";

export function DonationResultClient({ id }: { id?: string }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#003d7a] text-white">
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <section className="w-full max-w-xl border border-white/20 bg-[#0051A2] p-8 text-center shadow-2xl md:p-12">
          <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#99CC33]">{t("donacionResultado.badge")}</p>
          <h1 className="text-3xl font-bold md:text-4xl">{t("donacionResultado.title")}</h1>
          <p className="mt-5 leading-relaxed text-white/80">{t("donacionResultado.description")}</p>
          {id && <p className="mt-5 break-all text-xs text-white/50">{t("donacionResultado.reference")}: {id}</p>}
          <Link href="/" className="mt-8 inline-flex bg-[#99CC33] px-5 py-3 font-bold text-[#003d7a] transition-colors hover:bg-white">
            {t("donacionResultado.back")}
          </Link>
        </section>
      </main>
    </div>
  );
}
