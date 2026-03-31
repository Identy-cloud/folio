"use client";

import { useTranslation } from "@/lib/i18n/context";

interface Logo {
  name: string;
  style: "bold" | "light" | "caps" | "spaced" | "default";
}

const LOGOS: Logo[] = [
  { name: "TechCorp", style: "bold" },
  { name: "DesignStudio", style: "light" },
  { name: "MediaGroup", style: "caps" },
  { name: "BrandLab", style: "spaced" },
  { name: "CreativeHQ", style: "default" },
  { name: "PixelWorks", style: "bold" },
  { name: "Novaform", style: "light" },
  { name: "ArcStudio", style: "caps" },
  { name: "Luminary", style: "spaced" },
  { name: "Werkhaus", style: "default" },
];

const STYLE_MAP: Record<Logo["style"], string> = {
  bold: "font-bold tracking-tight",
  light: "font-light tracking-normal",
  caps: "uppercase text-[0.85em] font-semibold tracking-[0.12em]",
  spaced: "font-normal tracking-[0.08em]",
  default: "font-medium tracking-tight",
};

function LogoItem({ logo }: { logo: Logo }) {
  return (
    <span
      className={`font-display text-xl text-steel/50 select-none whitespace-nowrap transition-colors duration-300 hover:text-steel/80 sm:text-2xl lg:text-[1.75rem] ${STYLE_MAP[logo.style]}`}
    >
      {logo.name}
    </span>
  );
}

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="flex items-center select-none"
    >
      <span className="block h-1 w-1 rounded-full bg-accent/30" />
    </span>
  );
}

export function LandingTrustedBy() {
  const { t } = useTranslation();
  const l = t.landing;

  const duplicated = [...LOGOS, ...LOGOS];

  return (
    <section className="relative overflow-hidden border-y border-silver/20 bg-[#FAFAFA] px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,76,41,0.03),transparent_70%)]" />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1a1a2e 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Label with accent glow-pulse flanking lines */}
        <div className="flex items-center justify-center gap-4">
          <span
            aria-hidden="true"
            className="hidden h-px w-10 bg-accent/20 animate-glow-pulse sm:block sm:w-14"
          />
          <p className="text-center text-[10px] font-semibold tracking-[0.5em] text-steel/50 uppercase sm:text-[11px]">
            {l.trustedByLabel}
          </p>
          <span
            aria-hidden="true"
            className="hidden h-px w-10 bg-accent/20 animate-glow-pulse sm:block sm:w-14"
          />
        </div>

        {/* Marquee */}
        <div className="group relative mx-auto mt-12 max-w-5xl overflow-hidden sm:mt-16">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent sm:w-28" />

          <div className="flex w-max animate-marquee items-center gap-6 group-hover:[animation-play-state:paused] sm:gap-10">
            {duplicated.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex items-center gap-6 sm:gap-10"
              >
                {i > 0 && <Separator />}
                <LogoItem logo={logo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
