"use client";

import { useTranslation } from "@/lib/i18n/context";

export function LandingStats() {
  const { t } = useTranslation();
  const l = t.landing;

  const stats = [
    { value: "1,000+", label: l.statsPresCreated },
    { value: "50+", label: l.statsTeams },
    { value: "99.9%", label: l.statsUptime },
  ];

  return (
    <section className="border-t border-steel/30 px-4 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 sm:flex-row sm:justify-around">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl tracking-tight sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-[10px] tracking-[0.3em] text-silver/50 uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
