"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

function HeroPreview() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-[320px] sm:mt-20 sm:max-w-[480px] lg:max-w-[600px] animate-float">
      <div className="relative rounded-lg bg-navy shadow-2xl shadow-navy/30 overflow-hidden aspect-video">
        <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="space-y-2 sm:space-y-3">
            <div className="h-2 w-2/5 rounded bg-accent/80" />
            <div className="h-4 w-4/5 rounded bg-white/90 sm:h-5" />
            <div className="h-4 w-3/5 rounded bg-white/50 sm:h-5" />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded bg-accent/60 sm:h-12 sm:w-12" />
            <div className="flex-1 space-y-1.5 sm:space-y-2">
              <div className="h-2 w-full rounded bg-silver/30" />
              <div className="h-2 w-4/5 rounded bg-silver/20" />
              <div className="h-2 w-3/5 rounded bg-silver/15" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 h-full w-full rounded-lg bg-slate/50 -z-10 sm:-bottom-3 sm:-right-3" />
      <div className="absolute -bottom-4 -right-4 h-full w-full rounded-lg bg-steel/25 -z-20 sm:-bottom-6 sm:-right-6" />
    </div>
  );
}

export function LandingHero() {
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <section className="relative flex flex-col items-center px-5 pt-16 pb-20 text-center overflow-hidden sm:px-8 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-accent/[0.03] animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(30,42,58,0.06),transparent)]" />

      <p className="relative text-[10px] font-semibold tracking-[0.5em] text-accent uppercase sm:text-[11px]">
        {l.subtitle}
      </p>

      <h1 className="relative mt-5 font-display text-6xl leading-[0.9] tracking-tight text-navy sm:text-8xl lg:text-[10rem]">
        {l.heading1}
        <br />
        <span className="text-silver/70">{l.heading2}</span>
      </h1>

      <p className="relative mt-6 max-w-lg text-base leading-relaxed text-slate sm:mt-8 sm:text-lg">
        {l.description}
      </p>

      <div className="relative mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <Link
          href="/login"
          className="flex items-center justify-center bg-accent px-8 py-4 text-xs font-semibold tracking-[0.25em] text-white uppercase transition-all duration-200 hover:bg-accent-hover hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/20 sm:px-10 sm:py-5 sm:text-[13px]"
        >
          {l.cta}
        </Link>
        <Link
          href="/p/xn9C3QddXu"
          className="flex items-center justify-center border-2 border-navy px-8 py-4 text-xs font-semibold tracking-[0.25em] text-navy uppercase transition-all duration-200 hover:bg-navy hover:text-white hover:scale-[1.03] hover:shadow-lg hover:shadow-navy/15 sm:px-10 sm:py-5 sm:text-[13px]"
        >
          {l.demo}
        </Link>
      </div>

      <p className="relative mt-5 text-[10px] tracking-[0.3em] text-steel/60 uppercase">
        {l.noCreditCard}
      </p>

      <HeroPreview />
    </section>
  );
}
