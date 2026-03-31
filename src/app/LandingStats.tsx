"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "@/lib/i18n/context";

interface StatConfig {
  end: number;
  suffix: string;
  decimals: number;
  label: string;
}

function AnimatedStat({ config, active }: { config: StatConfig; active: boolean }) {
  const [display, setDisplay] = useState("0");

  const animate = useCallback(() => {
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * config.end;
      if (config.decimals > 0) {
        setDisplay(current.toFixed(config.decimals));
      } else {
        const val = Math.floor(current);
        setDisplay(val >= 1000 ? val.toLocaleString("en-US") : String(val));
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [config]);

  useEffect(() => {
    if (active) animate();
  }, [active, animate]);

  return (
    <div className="text-center">
      <p className="font-display text-5xl tracking-tight text-accent sm:text-6xl lg:text-7xl">
        {display}
        {config.suffix}
      </p>
      <p className="mt-3 text-[11px] tracking-[0.3em] text-steel uppercase">
        {config.label}
      </p>
    </div>
  );
}

export function LandingStats() {
  const { t } = useTranslation();
  const l = t.landing;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats: StatConfig[] = [
    { end: 1000, suffix: "+", decimals: 0, label: l.statsPresCreated },
    { end: 50, suffix: "+", decimals: 0, label: l.statsTeams },
    { end: 99.9, suffix: "%", decimals: 1, label: l.statsUptime },
  ];

  return (
    <section className="border-y border-silver/30 bg-[#FAFAFA] px-5 py-16 sm:px-8 sm:py-20">
      <div
        ref={ref}
        className="mx-auto flex max-w-5xl flex-col items-center gap-10 sm:flex-row sm:justify-around"
      >
        {stats.map((s) => (
          <AnimatedStat key={s.label} config={s} active={active} />
        ))}
      </div>
    </section>
  );
}
