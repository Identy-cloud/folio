"use client";

import { useEffect, useRef, useState, useCallback, Fragment } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Star } from "@phosphor-icons/react";

interface StatConfig {
  end: number;
  suffix: string;
  decimals: number;
  label: string;
  stars?: boolean;
}

function AnimatedStat({ config, active }: { config: StatConfig; active: boolean }) {
  const [display, setDisplay] = useState("0");
  const [done, setDone] = useState(false);

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
      else setDone(true);
    };
    requestAnimationFrame(step);
  }, [config]);

  useEffect(() => {
    if (active) animate();
  }, [active, animate]);

  return (
    <div className="text-center">
      <div className="mx-auto mb-3 h-px w-8 bg-accent/40 animate-glow-pulse" />
      <p
        className={
          "font-display text-4xl tracking-tight text-accent transition-transform duration-300 sm:text-5xl lg:text-6xl" +
          (done ? " scale-105" : " scale-100")
        }
      >
        {display}
        {config.suffix}
      </p>
      {config.stars && (
        <div className="mt-2 flex justify-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} weight="fill" className="h-4 w-4 text-amber-400 sm:h-5 sm:w-5" />
          ))}
        </div>
      )}
      <p className="mt-3 text-[11px] tracking-[0.3em] text-steel uppercase">{config.label}</p>
      <div className="mx-auto mt-3 h-px w-8 bg-accent/40 animate-glow-pulse" />
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
    { end: 5, suffix: "", decimals: 0, label: l.statsRating, stars: true },
    { end: 99.9, suffix: "%", decimals: 1, label: l.statsUptime },
  ];

  return (
    <section className="relative overflow-hidden border-y border-silver/30 bg-[#FAFAFA] px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
      {/* Radial gradient overlays for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,76,41,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,76,41,0.03),transparent_50%)]" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #1a1a2e 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Corner cross decorations */}
      <div className="absolute top-[10%] left-[6%] hidden h-px w-16 bg-navy/[0.07] sm:block sm:w-20" />
      <div className="absolute top-[10%] left-[6%] hidden h-16 w-px bg-navy/[0.07] sm:block sm:h-20" />
      <div className="absolute right-[6%] bottom-[10%] hidden h-px w-16 bg-navy/[0.07] sm:block sm:w-20" />
      <div className="absolute right-[6%] bottom-[10%] hidden h-16 w-px bg-navy/[0.07] sm:block sm:h-20" />

      {/* Floating geometric decorations */}
      <div className="absolute top-[20%] right-[10%] hidden h-3 w-3 rounded-full bg-accent/10 animate-float lg:block" />
      <div
        className="absolute bottom-[25%] left-[8%] hidden h-2 w-2 rounded-full bg-accent/15 animate-float lg:block"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-[55%] right-[20%] hidden h-10 w-10 rotate-45 border border-accent/[0.06] animate-float lg:block"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute top-[15%] left-[18%] hidden h-8 w-8 rotate-12 border border-navy/[0.05] animate-float lg:block"
        style={{ animationDelay: "3s" }}
      />

      {/* Content */}
      <div
        ref={ref}
        className="relative z-10 mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:gap-10 lg:flex lg:items-start lg:justify-around"
      >
        {stats.map((s, i) => (
          <Fragment key={s.label}>
            {i > 0 && (
              <div className="hidden lg:flex lg:items-center lg:self-center">
                <div className="h-16 w-px bg-silver/40" />
              </div>
            )}
            <AnimatedStat config={s} active={active} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
