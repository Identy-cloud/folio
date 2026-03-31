"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { PaintBrush, Layout, Palette, Users, DeviceMobile, Sliders } from "@phosphor-icons/react";

const ICONS = [PaintBrush, Layout, Palette, Users, DeviceMobile, Sliders] as const;
const INTERVAL = 4000;

function HeroFeatureSlider() {
  const { t } = useTranslation();
  const l = t.landing;
  const features = [
    { title: l.feat1Title, desc: l.feat1Desc }, { title: l.feat2Title, desc: l.feat2Desc },
    { title: l.feat3Title, desc: l.feat3Desc }, { title: l.feat4Title, desc: l.feat4Desc },
    { title: l.feat5Title, desc: l.feat5Desc }, { title: l.feat6Title, desc: l.feat6Desc },
  ];
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());
  const goTo = useCallback((i: number) => { setActive(i); setProgress(0); startRef.current = Date.now(); }, []);
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / INTERVAL, 1);
      setProgress(pct);
      if (pct >= 1) { setActive((prev) => (prev + 1) % features.length); setProgress(0); startRef.current = Date.now(); }
    }, 50);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [features.length]);
  const Icon = ICONS[active];
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-none">
      <div key={active} className="relative rounded-sm border border-silver/20 bg-white p-6 shadow-lg shadow-navy/5 sm:p-8 lg:p-10 animate-[fadeSlide_0.4s_ease-out_both]">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-accent/8 text-accent sm:h-14 sm:w-14">
          <Icon size={24} weight="duotone" className="sm:hidden" />
          <Icon size={30} weight="duotone" className="hidden sm:block" />
        </div>
        <h3 className="font-display text-lg tracking-tight text-navy sm:text-xl lg:text-2xl">{features[active].title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate sm:text-base">{features[active].desc}</p>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2.5 lg:justify-start">
        {features.map((_, i) => (
          <button key={i} aria-label={`Feature ${i + 1}`} onClick={() => goTo(i)} className="group relative h-1.5 w-6 cursor-pointer overflow-hidden rounded-full bg-silver/20 transition-all duration-200 sm:w-8 hover:bg-silver/30">
            {i === active && <span className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />}
            {i < active && <span className="absolute inset-0 rounded-full bg-accent/40" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LandingHero() {
  const { t } = useTranslation();
  const l = t.landing;
  return (
    <section className="relative overflow-hidden px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-accent/[0.04] animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(30,42,58,0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_80%,rgba(255,76,41,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,76,41,0.04),transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgb(30,42,58) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-[10%] left-[6%] h-px w-16 bg-navy/10 sm:w-24" />
      <div className="absolute top-[10%] left-[6%] h-16 w-px bg-navy/10 sm:h-24" />
      <div className="absolute bottom-[10%] right-[6%] h-px w-16 bg-navy/10 sm:w-24" />
      <div className="absolute bottom-[10%] right-[6%] h-16 w-px bg-navy/10 sm:h-24" />
      <div className="absolute top-[20%] right-[10%] hidden h-12 w-12 rotate-45 border border-accent/10 animate-float sm:block lg:h-16 lg:w-16" />
      <div className="absolute bottom-[18%] left-[8%] hidden h-9 w-9 rotate-12 border border-navy/10 animate-float sm:block lg:h-12 lg:w-12" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[55%] right-[22%] hidden h-2 w-2 rounded-full bg-accent/15 animate-float lg:block" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[35%] left-[20%] hidden h-1.5 w-1.5 rounded-full bg-navy/10 animate-float lg:block" style={{ animationDelay: "3s" }} />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="font-display text-[12rem] tracking-tight text-navy/[0.02] select-none sm:text-[18rem] lg:text-[24rem]">F</span>
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center lg:flex-row lg:items-center lg:gap-16 lg:text-left xl:gap-20">
        <div className="flex flex-col items-center lg:flex-1 lg:items-start">
          <div className="mx-auto h-px w-10 bg-accent animate-glow-pulse sm:w-14 lg:mx-0" />
          <p className="mt-5 text-[10px] font-semibold tracking-[0.5em] text-accent uppercase sm:text-[11px]">{l.subtitle}</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.9] tracking-tight text-navy sm:text-8xl lg:text-[8rem] xl:text-[10rem]">
            {l.heading1}<br /><span className="text-silver/70">{l.heading2}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate sm:mt-8 sm:text-lg">{l.description}</p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link href="/login" className="flex items-center justify-center bg-accent px-8 py-4 text-xs font-semibold tracking-[0.25em] text-white uppercase transition-all duration-300 hover:bg-accent-hover hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(255,76,41,0.3)] sm:px-10 sm:py-5 sm:text-[13px]">{l.cta}</Link>
            <Link href="/p/xn9C3QddXu" className="flex items-center justify-center border-2 border-navy px-8 py-4 text-xs font-semibold tracking-[0.25em] text-navy uppercase transition-all duration-300 hover:bg-navy hover:text-white hover:scale-[1.04] hover:shadow-lg hover:shadow-navy/15 sm:px-10 sm:py-5 sm:text-[13px]">{l.demo}</Link>
          </div>
          <p className="mt-5 text-[10px] tracking-[0.3em] text-steel/60 uppercase">{l.noCreditCard}</p>
        </div>
        <div className="mt-14 flex items-center justify-center sm:mt-20 lg:mt-0 lg:flex-1">
          <HeroFeatureSlider />
        </div>
      </div>
    </section>
  );
}
