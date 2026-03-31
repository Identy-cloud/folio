"use client";

import Link from "next/link";
import { Check, X as XIcon } from "@phosphor-icons/react";

interface Feature {
  text: string;
  included: boolean;
}

interface PricingTierCardProps {
  name: string;
  price: number;
  annualTotal: number | null;
  description: string;
  features: Feature[];
  cta: string;
  plan: string | null;
  highlighted: boolean;
  isCurrent: boolean;
  loading: string | null;
  currentPlanLabel: string;
  popularLabel: string;
  perMonthLabel: string;
  perYearLabel: string;
  onCheckout: (plan: string) => void;
}

export function PricingTierCard({
  name, price, annualTotal, description, features, cta,
  plan, highlighted, isCurrent, loading,
  currentPlanLabel, popularLabel, perMonthLabel, perYearLabel,
  onCheckout,
}: PricingTierCardProps) {
  return (
    <div className={`flex flex-col border p-5 sm:p-6 ${highlighted ? "border-silver/50 bg-navy relative" : "border-steel/30 bg-navy"}`}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-[10px] font-semibold tracking-widest text-black uppercase">{popularLabel}</span>
      )}
      <p className="text-[10px] tracking-[0.4em] text-silver/50 uppercase">{name}</p>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-3xl tracking-tight sm:text-4xl">${price}</span>
        {price > 0 && <span className="text-sm text-silver/50">{perMonthLabel}</span>}
      </div>
      {annualTotal !== null && price > 0 && <p className="mt-1 text-[10px] text-green-500">${annualTotal}{perYearLabel}</p>}
      <p className="mt-3 text-xs leading-relaxed text-silver/50">{description}</p>
      <ul className="mt-5 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-2 text-xs">
            {f.included
              ? <Check size={14} className="mt-0.5 shrink-0 text-green-500" />
              : <XIcon size={14} className="mt-0.5 shrink-0 text-silver/40" />}
            <span className={f.included ? "text-silver" : "text-silver/50"}>{f.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {isCurrent ? (
          <span className="block w-full border border-green-600 py-2.5 text-center text-xs font-semibold tracking-[0.2em] text-green-500 uppercase">{currentPlanLabel}</span>
        ) : plan ? (
          <button onClick={() => onCheckout(plan)} disabled={loading !== null}
            className={`block w-full py-2.5 text-center text-xs font-semibold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 ${highlighted ? "bg-accent text-white hover:bg-accent-hover" : "border border-steel/60 text-silver hover:border-white hover:text-white"}`}>
            {loading === plan ? "..." : cta}
          </button>
        ) : (
          <Link href="/login" className="block w-full border border-steel py-2.5 text-center text-xs font-semibold tracking-[0.2em] text-silver/70 uppercase hover:border-silver/50 transition-colors">
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
