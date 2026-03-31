"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function LandingCta() {
  const { t } = useTranslation();
  const l = t.landing;

  return (
    <section className="relative overflow-hidden bg-navy px-5 py-24 text-center sm:px-8 sm:py-32 lg:py-40">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-slate to-navy opacity-70 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,76,41,0.10),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,76,41,0.08),transparent_50%)]" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Geometric decorations — corner crosses */}
      <div className="absolute top-[12%] left-[8%] h-px w-20 bg-white/10 sm:w-28" />
      <div className="absolute top-[12%] left-[8%] h-20 w-px bg-white/10 sm:h-28" />
      <div className="absolute bottom-[12%] right-[8%] h-px w-20 bg-white/10 sm:w-28" />
      <div className="absolute bottom-[12%] right-[8%] h-20 w-px bg-white/10 sm:h-28" />

      {/* Floating geometric shapes */}
      <div className="absolute top-[25%] right-[12%] hidden h-14 w-14 rotate-45 border border-accent/15 animate-float sm:block lg:h-20 lg:w-20" />
      <div
        className="absolute bottom-[20%] left-[10%] hidden h-10 w-10 rotate-12 border border-white/10 animate-float sm:block lg:h-14 lg:w-14"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-[60%] right-[25%] hidden h-2 w-2 rounded-full bg-accent/20 animate-float lg:block"
        style={{ animationDelay: "1s" }}
      />

      {/* Large faded watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="font-display text-[12rem] tracking-tight text-white/[0.015] select-none sm:text-[18rem] lg:text-[24rem]">
          F
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Accent divider line */}
        <div className="mx-auto h-px w-10 bg-accent animate-glow-pulse sm:w-14" />

        <p className="mt-6 text-[10px] tracking-[0.4em] text-silver/40 uppercase sm:text-[11px] sm:tracking-[0.5em]">
          {l.trustedByLabel}
        </p>

        <h2 className="mx-auto mt-6 max-w-xs font-display text-3xl leading-tight tracking-tight text-white sm:mt-8 sm:max-w-lg sm:text-5xl lg:max-w-3xl lg:text-7xl">
          {l.ctaHeading}
        </h2>

        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-silver sm:mt-6 sm:max-w-md sm:text-base">
          {l.ctaDesc}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
          <Link
            href="/login"
            className="inline-block bg-accent px-10 py-4 text-xs font-semibold tracking-[0.25em] text-white uppercase transition-all duration-300 hover:bg-accent-hover hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(255,76,41,0.4)] sm:px-14 sm:py-5 sm:text-[13px]"
          >
            {l.ctaButton}
          </Link>
          <span className="text-[11px] tracking-wide text-silver/40">
            {l.noCreditCard}
          </span>
        </div>
      </div>
    </section>
  );
}
