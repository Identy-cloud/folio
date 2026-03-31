"use client";

import { useTranslation } from "@/lib/i18n/context";

type Support = "yes" | "no" | "partial";

interface Row {
  feature: string;
  folio: Support;
  canva: Support;
  google: Support;
  powerpoint: Support;
}

function Cell({ value }: { value: Support }) {
  if (value === "yes") {
    return <span className="text-white">&#10003;</span>;
  }
  if (value === "partial") {
    return <span className="text-silver/50">~</span>;
  }
  return <span className="text-silver/40">&mdash;</span>;
}

export function LandingComparison() {
  const { t } = useTranslation();
  const l = t.landing;

  const rows: Row[] = [
    { feature: l.compEditorialDesign, folio: "yes", canva: "no", google: "no", powerpoint: "no" },
    { feature: l.compRealtimeCollab, folio: "yes", canva: "partial", google: "yes", powerpoint: "partial" },
    { feature: l.compInteractiveSlides, folio: "yes", canva: "partial", google: "no", powerpoint: "no" },
    { feature: l.compMobileAdaptive, folio: "yes", canva: "no", google: "partial", powerpoint: "no" },
    { feature: l.compCustomThemes, folio: "yes", canva: "partial", google: "partial", powerpoint: "partial" },
    { feature: l.compBrandKit, folio: "yes", canva: "yes", google: "no", powerpoint: "partial" },
  ];

  const headers = [l.compFeature, "Folio", "Canva", "Google Slides", "PowerPoint"];

  return (
    <section className="border-t border-steel/30 px-4 py-16 sm:px-8 sm:py-24">
      <p className="text-center text-[10px] tracking-[0.5em] text-silver/50 uppercase">
        {l.comparisonLabel}
      </p>
      <h2 className="mt-3 text-center font-display text-3xl tracking-tight sm:text-5xl">
        {l.comparisonHeading}
      </h2>
      <div className="mx-auto mt-12 max-w-4xl overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-xs">
          <thead>
            <tr className="border-b border-steel/30">
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={`pb-3 font-semibold tracking-[0.15em] uppercase ${
                    i === 0 ? "text-silver/50" : i === 1 ? "text-white" : "text-silver/40"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-steel/30/50">
                <td className="py-3 text-silver/70">{row.feature}</td>
                <td className="py-3 text-center"><Cell value={row.folio} /></td>
                <td className="py-3 text-center"><Cell value={row.canva} /></td>
                <td className="py-3 text-center"><Cell value={row.google} /></td>
                <td className="py-3 text-center"><Cell value={row.powerpoint} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
