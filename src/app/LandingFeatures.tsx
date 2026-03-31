"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { PencilLine, Layout, Palette, Users, DeviceMobile, Sliders } from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

const ICONS: PhosphorIcon[] = [PencilLine, Layout, Palette, Users, DeviceMobile, Sliders];
const ROTATION_MS = 5000;

export function LandingFeatures() {
  const { t } = useTranslation();
  const l = t.landing;
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const features = [
    { title: l.feat1Title, desc: l.feat1Desc },
    { title: l.feat2Title, desc: l.feat2Desc },
    { title: l.feat3Title, desc: l.feat3Desc },
    { title: l.feat4Title, desc: l.feat4Desc },
    { title: l.feat5Title, desc: l.feat5Desc },
    { title: l.feat6Title, desc: l.feat6Desc },
  ];

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % 6), ROTATION_MS);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const select = (i: number) => { setActive(i); resetTimer(); };
  const ActiveIcon = ICONS[active];

  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,76,41,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(10,25,47,0.03),transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgb(10,25,47) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-[10%] left-[6%] h-px w-16 bg-navy/[0.06] sm:w-24" />
      <div className="absolute top-[10%] left-[6%] h-16 w-px bg-navy/[0.06] sm:h-24" />
      <div className="absolute right-[6%] bottom-[10%] h-px w-16 bg-navy/[0.06] sm:w-24" />
      <div className="absolute right-[6%] bottom-[10%] h-16 w-px bg-navy/[0.06] sm:h-24" />
      <div className="absolute top-[18%] right-[10%] hidden h-14 w-14 rotate-45 border border-accent/10 animate-float lg:block lg:h-20 lg:w-20" />
      <div className="absolute bottom-[22%] left-[8%] hidden h-10 w-10 rotate-12 border border-navy/[0.06] animate-float lg:block lg:h-14 lg:w-14" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[55%] right-[22%] hidden h-2 w-2 rounded-full bg-accent/15 animate-float lg:block" style={{ animationDelay: "3.5s" }} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="select-none font-display text-[12rem] tracking-tight text-navy/[0.015] sm:text-[18rem] lg:text-[24rem]">F</span>
      </div>

      <div ref={sectionRef} className="fade-up-element relative z-10 mx-auto max-w-6xl">
        <p className="text-center text-[10px] font-semibold tracking-[0.5em] text-accent uppercase sm:text-[11px]">{l.featuresLabel}</p>
        <h2 className="mt-3 text-center font-display text-4xl tracking-tight text-navy sm:text-5xl lg:text-6xl">{l.featuresHeading}</h2>
        <div className="mx-auto mt-4 h-px w-10 bg-accent animate-glow-pulse sm:w-14" />
        <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-slate sm:text-base">{l.featuresDesc}</p>

        {/* Desktop: sidebar nav + spotlight panel */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-[280px_1fr] lg:gap-0">
          <nav className="flex flex-col border-r border-silver/40">
            {features.map((f, i) => {
              const Icon = ICONS[i];
              const isActive = i === active;
              return (
                <button key={i} onClick={() => select(i)} className={`group relative flex min-h-[56px] items-center gap-3 px-5 py-4 text-left transition-all duration-300 ${isActive ? "bg-accent/[0.04]" : "hover:bg-navy/[0.02]"}`}>
                  {isActive && <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-accent" />}
                  <Icon size={20} weight={isActive ? "duotone" : "regular"} className={`shrink-0 transition-colors duration-300 ${isActive ? "text-accent" : "text-slate/60 group-hover:text-navy"}`} />
                  <span className={`font-display text-sm tracking-tight transition-colors duration-300 ${isActive ? "text-navy" : "text-slate group-hover:text-navy"}`}>{f.title}</span>
                </button>
              );
            })}
          </nav>
          <div className="relative flex min-h-[340px] flex-col justify-center overflow-hidden border border-l-0 border-silver/40 bg-gradient-to-br from-white to-accent/[0.02] px-12 py-10">
            <div className="absolute top-6 right-8 font-display text-6xl tracking-tight text-navy/[0.04]">{String(active + 1).padStart(2, "0")}</div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/[0.08]">
              <ActiveIcon size={30} weight="duotone" className="text-accent" />
            </div>
            <h3 key={`title-${active}`} className="mt-5 font-display text-3xl tracking-tight text-navy animate-[fadeSlide_0.4s_ease-out_both]">{features[active].title}</h3>
            <p key={`desc-${active}`} className="mt-3 max-w-md text-base leading-relaxed text-slate animate-[fadeSlide_0.4s_ease-out_0.1s_both]">{features[active].desc}</p>
            <div className="mt-8 flex gap-1.5">
              {features.map((_, i) => (
                <button key={i} onClick={() => select(i)} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-accent" : "w-3 bg-silver/60 hover:bg-silver"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile + Tablet: vertical accordion */}
        <div className="mt-12 flex flex-col gap-2 lg:hidden">
          {features.map((f, i) => {
            const Icon = ICONS[i];
            const isOpen = i === active;
            return (
              <div key={i} className={`overflow-hidden rounded-lg border transition-all duration-300 ${isOpen ? "border-accent/20 bg-accent/[0.03] shadow-sm" : "border-silver/40 bg-white"}`}>
                <button onClick={() => select(i)} className="flex w-full min-h-[52px] items-center gap-3 px-5 py-4 text-left">
                  <Icon size={22} weight={isOpen ? "duotone" : "regular"} className={`shrink-0 transition-colors ${isOpen ? "text-accent" : "text-slate/50"}`} />
                  <span className={`flex-1 font-display text-base tracking-tight transition-colors ${isOpen ? "text-navy" : "text-slate"}`}>{f.title}</span>
                  <span className={`font-display text-xs tracking-wide transition-colors ${isOpen ? "text-accent/50" : "text-silver"}`}>{String(i + 1).padStart(2, "0")}</span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-slate">{f.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
