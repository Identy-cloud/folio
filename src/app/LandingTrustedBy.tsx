"use client";

import { useTranslation } from "@/lib/i18n/context";

const LOGOS = [
  "TechCorp",
  "DesignStudio",
  "MediaGroup",
  "BrandLab",
  "CreativeHQ",
  "PixelWorks",
];

export function LandingTrustedBy() {
  const { t } = useTranslation();
  const l = t.landing;

  const duplicated = [...LOGOS, ...LOGOS];

  return (
    <section className="border-y border-silver/40 bg-[#FAFAFA] px-5 py-10 sm:px-8 sm:py-14 overflow-hidden">
      <p className="text-center text-[10px] font-semibold tracking-[0.5em] text-steel/60 uppercase sm:text-[11px]">
        {l.trustedByLabel}
      </p>
      <div className="relative mx-auto mt-8 max-w-5xl overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent sm:w-24" />
        <div className="flex animate-marquee w-max gap-12 sm:gap-20">
          {duplicated.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-2xl tracking-tight text-silver/80 select-none whitespace-nowrap sm:text-3xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
