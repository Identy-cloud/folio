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

  return (
    <section className="border-t border-steel/30 px-4 py-12 sm:px-8 sm:py-16">
      <p className="text-center text-[10px] tracking-[0.5em] text-silver/40 uppercase">
        {l.trustedByLabel}
      </p>
      <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-8 sm:gap-12">
        {LOGOS.map((name) => (
          <span
            key={name}
            className="font-display text-lg tracking-tight text-silver/40 select-none sm:text-xl"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
