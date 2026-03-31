"use client";

import { useTranslation } from "@/lib/i18n/context";

export function LandingFeatures() {
  const { t } = useTranslation();
  const l = t.landing;

  const features = [
    { title: l.feat1Title, desc: l.feat1Desc },
    { title: l.feat2Title, desc: l.feat2Desc },
    { title: l.feat3Title, desc: l.feat3Desc },
    { title: l.feat4Title, desc: l.feat4Desc },
    { title: l.feat5Title, desc: l.feat5Desc },
    { title: l.feat6Title, desc: l.feat6Desc },
  ];

  return (
    <section className="border-t border-steel/30 px-4 py-16 sm:px-8 sm:py-24">
      <p className="text-center text-[10px] tracking-[0.5em] text-silver/50 uppercase">{l.featuresLabel}</p>
      <h2 className="mt-3 text-center font-display text-3xl tracking-tight sm:text-5xl">
        {l.featuresHeading}
      </h2>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="border border-steel/30 p-6">
            <h3 className="font-display text-lg tracking-tight">{f.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-silver/70">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
