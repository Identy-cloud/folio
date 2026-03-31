"use client";

import { useTranslation } from "@/lib/i18n/context";
import { Check, X, Minus } from "@phosphor-icons/react";

type Support = "yes" | "no" | "partial";
interface Row { feature: string; folio: Support; canva: Support; google: Support; powerpoint: Support }

function Cell({ value, highlight }: { value: Support; highlight?: boolean }) {
  const bg = highlight ? "bg-accent/[0.04]" : "";
  if (value === "yes") return <td className={`py-4 text-center ${bg}`}><Check size={18} weight="bold" className="mx-auto text-accent" /></td>;
  if (value === "partial") return <td className={`py-4 text-center ${bg}`}><Minus size={18} weight="bold" className="mx-auto text-silver" /></td>;
  return <td className={`py-4 text-center ${bg}`}><X size={18} weight="bold" className="mx-auto text-silver/50" /></td>;
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
    <div className="mt-14 flex flex-col gap-3 lg:hidden">
      {rows.map((row) => (
        <div key={row.feature} className="overflow-hidden rounded-lg border border-silver/40 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-accent/10 bg-accent/[0.04] px-5 py-4">
            <span className="text-sm font-medium text-navy">{row.feature}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-[0.15em] text-accent uppercase">Folio</span>
              <CellLabel value={row.folio} />
            </div>
          </div>
          <div className="flex divide-x divide-silver/30 px-2 py-3">
            {competitors.map((c) => (
              <div key={c} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] tracking-wider text-steel/60 uppercase">{labels[c]}</span>
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
    <section className="relative overflow-hidden bg-white px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
      {/* Atmospheric radial gradients — light theme adaptation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,76,41,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(255,76,41,0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0.01),transparent_70%)]" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />

      {/* Corner crosses — structural decoration */}
      <div className="absolute top-[10%] left-[6%] hidden h-px w-16 bg-navy/[0.06] sm:block sm:w-24" />
      <div className="absolute top-[10%] left-[6%] hidden h-16 w-px bg-navy/[0.06] sm:block sm:h-24" />
      <div className="absolute right-[6%] bottom-[10%] hidden h-px w-16 bg-navy/[0.06] sm:block sm:w-24" />
      <div className="absolute right-[6%] bottom-[10%] hidden h-16 w-px bg-navy/[0.06] sm:block sm:h-24" />

      {/* Floating geometric shapes — desktop only */}
      <div className="absolute top-[18%] right-[10%] hidden h-14 w-14 rotate-45 border border-accent/8 animate-float lg:block lg:h-20 lg:w-20" />
      <div className="absolute bottom-[22%] left-[8%] hidden h-10 w-10 rotate-12 border border-navy/[0.06] animate-float lg:block lg:h-14 lg:w-14" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[55%] right-[22%] hidden h-2 w-2 rounded-full bg-accent/15 animate-float lg:block" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="text-center text-[10px] font-semibold tracking-[0.5em] text-accent uppercase sm:text-[11px]">
          {l.comparisonLabel}
        </p>
        <h2 className="mt-3 text-center font-display text-4xl tracking-tight text-navy sm:text-5xl lg:text-6xl">
          {l.comparisonHeading}
        </h2>
        <div className="mx-auto mt-4 h-px w-10 bg-accent animate-glow-pulse sm:w-14" />
        <MobileCards rows={rows} />
        <div className="mt-14 hidden lg:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-navy">
                {headers.map((h, i) => (
                  <th key={h} className={`pb-4 text-[11px] font-semibold tracking-[0.15em] uppercase ${i === 0 ? "text-steel" : i === 1 ? "border-t-2 border-accent bg-accent/[0.04] text-center text-accent" : "text-center text-steel/50"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.feature} className={`border-b border-silver/40 transition-colors hover:bg-slate/[0.02] ${idx % 2 === 1 ? "bg-silver/[0.06]" : ""}`}>
                  <td className="py-4 text-sm text-slate">{row.feature}</td>
                  <Cell value={row.folio} highlight /><Cell value={row.canva} /><Cell value={row.google} /><Cell value={row.powerpoint} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
