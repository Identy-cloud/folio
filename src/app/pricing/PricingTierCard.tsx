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
    <div className={`flex flex-col border p-5 sm:p-6 ${highlighted ? "border-neutral-400 bg-[#1c1c1c] relative" : "border-neutral-800 bg-[#1a1a1a]"}`}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-[10px] font-semibold tracking-widest text-black uppercase">{popularLabel}</span>
      )}
      <p className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase">{name}</p>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-3xl tracking-tight sm:text-4xl">${price}</span>
        {price > 0 && <span className="text-sm text-neutral-500">{perMonthLabel}</span>}
      </div>
      {annualTotal !== null && price > 0 && <p className="mt-1 text-[10px] text-green-500">${annualTotal}{perYearLabel}</p>}
      <p className="mt-3 text-xs leading-relaxed text-neutral-500">{description}</p>
      <ul className="mt-5 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-2 text-xs">
            {f.included
              ? <Check size={14} className="mt-0.5 shrink-0 text-green-500" />
              : <XIcon size={14} className="mt-0.5 shrink-0 text-neutral-600" />}
            <span className={f.included ? "text-neutral-300" : "text-neutral-500"}>{f.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {isCurrent ? (
          <span className="block w-full border border-green-600 py-2.5 text-center text-xs font-semibold tracking-[0.2em] text-green-500 uppercase">{currentPlanLabel}</span>
        ) : plan ? (
          <button onClick={() => onCheckout(plan)} disabled={loading !== null}
            className={`block w-full py-2.5 text-center text-xs font-semibold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 ${highlighted ? "bg-white text-black hover:bg-neutral-200" : "border border-neutral-600 text-neutral-300 hover:border-white hover:text-white"}`}>
            {loading === plan ? "..." : cta}
          </button>
        ) : (
          <Link href="/login" className="block w-full border border-neutral-700 py-2.5 text-center text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase hover:border-neutral-500 transition-colors">
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
