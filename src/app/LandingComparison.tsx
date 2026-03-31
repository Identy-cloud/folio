"use client";

import { useTranslation } from "@/lib/i18n/context";
import { Check, X, Minus } from "@phosphor-icons/react";

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
    return <Check size={16} weight="bold" className="mx-auto text-accent" />;
  }
  if (value === "partial") {
    return <Minus size={16} weight="bold" className="mx-auto text-silver" />;
  }
  return <X size={16} weight="bold" className="mx-auto text-silver/50" />;
}

function CellLabel({ value }: { value: Support }) {
  if (value === "yes") return <Check size={18} weight="bold" className="text-accent" />;
  if (value === "partial") return <Minus size={18} weight="bold" className="text-silver" />;
  return <X size={18} weight="bold" className="text-silver/50" />;
}

function MobileCards({ rows }: { rows: Row[] }) {
  const competitors = ["canva", "google", "powerpoint"] as const;
  const labels = { canva: "Canva", google: "Google Slides", powerpoint: "PowerPoint" };

  return (
    <div className="mt-14 flex flex-col gap-4 lg:hidden">
      {rows.map((row) => (
        <div key={row.feature} className="border border-silver/50 bg-white">
          <div className="flex items-center justify-between border-b border-silver/30 px-5 py-4">
            <span className="text-sm font-medium text-navy">{row.feature}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-[0.15em] text-accent uppercase">
                Folio
              </span>
              <CellLabel value={row.folio} />
            </div>
          </div>
          <div className="flex divide-x divide-silver/30 px-2 py-3">
            {competitors.map((c) => (
              <div key={c} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] tracking-wider text-steel/60 uppercase">
                  {labels[c]}
                </span>
                <CellLabel value={row[c]} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
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
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-[10px] font-semibold tracking-[0.5em] text-accent uppercase sm:text-[11px]">
          {l.comparisonLabel}
        </p>
        <h2 className="mt-3 text-center font-display text-4xl tracking-tight text-navy sm:text-5xl lg:text-6xl">
          {l.comparisonHeading}
        </h2>

        <MobileCards rows={rows} />

        <div className="mt-14 hidden lg:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-navy">
                {headers.map((h, i) => (
                  <th
                    key={h}
                    className={`pb-4 text-[11px] font-semibold tracking-[0.15em] uppercase ${
                      i === 0
                        ? "text-steel"
                        : i === 1
                          ? "text-center text-accent"
                          : "text-center text-steel/50"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-silver/40">
                  <td className="py-4 text-sm text-slate">{row.feature}</td>
                  <td className="py-4 text-center"><Cell value={row.folio} /></td>
                  <td className="py-4 text-center"><Cell value={row.canva} /></td>
                  <td className="py-4 text-center"><Cell value={row.google} /></td>
                  <td className="py-4 text-center"><Cell value={row.powerpoint} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
