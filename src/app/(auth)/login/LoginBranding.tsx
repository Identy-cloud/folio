"use client";

import { Notebook } from "@phosphor-icons/react";
import { LocaleSelector } from "@/components/LocaleSelector";

interface Props {
  subtitle: string;
}

export function LoginBranding({ subtitle }: Props) {
  return (
    <>
      {/* Mobile branding header */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 lg:hidden">
        <div className="flex items-center gap-2">
          <Notebook size={24} weight="duotone" className="text-navy" />
          <span className="font-display text-xl tracking-tight text-navy">FOLIO</span>
        </div>
        <LocaleSelector />
      </div>

      {/* Desktop branding panel */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:relative lg:overflow-hidden lg:bg-navy">
        {/* Animated gradient background */}
        <div className="absolute inset-0 gradient-hero opacity-80 animate-gradient-shift" />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Geometric decorations */}
        <div className="absolute top-[15%] left-[10%] h-px w-24 bg-white/10" />
        <div className="absolute top-[15%] left-[10%] h-24 w-px bg-white/10" />
        <div className="absolute bottom-[15%] right-[10%] h-px w-24 bg-white/10" />
        <div className="absolute bottom-[15%] right-[10%] h-24 w-px bg-white/10" />
        <div className="absolute top-[40%] right-[15%] h-16 w-16 border border-accent/20 rotate-45 animate-error-float" />
        <div className="absolute bottom-[30%] left-[18%] h-12 w-12 border border-white/10 rotate-12 animate-error-float" style={{ animationDelay: "2s" }} />

        {/* Large faded watermark */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <span className="font-display text-[20rem] tracking-tight text-white/[0.02] select-none xl:text-[24rem]">
            F
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 px-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <Notebook size={56} weight="duotone" className="text-white" />
            <h1 className="font-display text-7xl tracking-tight text-white xl:text-8xl">
              FOLIO
            </h1>
          </div>
          <div className="mx-auto mt-4 h-px w-12 bg-accent" />
          <p className="mt-6 text-[11px] tracking-[0.5em] text-white/50 uppercase">
            {subtitle}
          </p>

          {/* Feature highlights */}
          <div className="mx-auto mt-12 flex max-w-xs flex-col gap-3">
            {[
              "Presentations crafted to impress",
              "Real-time collaboration",
              "Designer-quality themes",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-left">
                <span className="h-px w-4 shrink-0 bg-accent/40" />
                <span className="text-[11px] tracking-wide text-white/40">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
