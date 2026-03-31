"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";
import {
  PencilLine,
  Layout,
  Palette,
  Users,
  DeviceMobile,
  Sliders,
} from "@phosphor-icons/react";

const ICONS = [PencilLine, Layout, Palette, Users, DeviceMobile, Sliders];

export function LandingFeatures() {
  const { t } = useTranslation();
  const l = t.landing;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = el.querySelectorAll("[data-feature-card]");
            cards.forEach((card, i) => {
              (card as HTMLElement).style.transitionDelay = `${i * 100}ms`;
              card.classList.add("visible");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const features = [
    { title: l.feat1Title, desc: l.feat1Desc },
    { title: l.feat2Title, desc: l.feat2Desc },
    { title: l.feat3Title, desc: l.feat3Desc },
    { title: l.feat4Title, desc: l.feat4Desc },
    { title: l.feat5Title, desc: l.feat5Desc },
    { title: l.feat6Title, desc: l.feat6Desc },
  ];

  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-[10px] font-semibold tracking-[0.5em] text-accent uppercase sm:text-[11px]">
          {l.featuresLabel}
        </p>
        <h2 className="mt-3 text-center font-display text-4xl tracking-tight text-navy sm:text-5xl lg:text-6xl">
          {l.featuresHeading}
        </h2>

        <div
          ref={gridRef}
          className="mt-16 grid grid-cols-1 gap-px bg-silver/50 border border-silver/50 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={f.title}
                data-feature-card
                className="fade-up-element bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/5 hover:border-accent/20 lg:p-10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/[0.08]">
                  <Icon size={26} weight="duotone" className="text-accent" />
                </div>
                <h3 className="mt-5 font-display text-xl tracking-tight text-navy">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
