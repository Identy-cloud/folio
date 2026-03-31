"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function LandingCta() {
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <section className="relative overflow-hidden bg-navy px-5 py-20 text-center sm:px-8 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-slate to-navy opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,76,41,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,76,41,0.06),transparent_50%)]" />

      <div className="relative">
        <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-7xl">
          {l.ctaHeading}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-silver">
          {l.ctaDesc}
        </p>
        <p className="mt-3 text-[11px] tracking-[0.2em] text-silver/50 uppercase">
          Join 1,000+ teams already using Folio
        </p>
        <Link
          href="/login"
          className="mt-10 inline-block bg-accent px-10 py-4 text-xs font-semibold tracking-[0.25em] text-white uppercase transition-all duration-300 hover:bg-accent-hover hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(255,76,41,0.4)] sm:px-14 sm:py-5 sm:text-[13px]"
        >
          {l.ctaButton}
        </Link>
      </div>
    </section>
  );
}
