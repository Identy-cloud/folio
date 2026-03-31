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
  index: number;
}

export function PricingTierCard({
  name, price, annualTotal, description, features, cta,
  plan, highlighted, isCurrent, loading,
  currentPlanLabel, popularLabel, perMonthLabel, perYearLabel,
  onCheckout, index,
}: PricingTierCardProps) {
  const delay = `${index * 100}ms`;

  return (
    <div
      className={`animate-card-entrance group relative flex flex-col rounded-sm border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy/10 ${
        highlighted
          ? "border-accent/30 bg-gradient-to-b from-navy to-slate text-white"
          : "border-silver/40 bg-white hover:border-steel/40"
      }`}
      style={{ animationDelay: delay }}
    >
      {/* Accent top stripe */}
      <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-sm transition-all duration-300 ${
        highlighted
          ? "bg-accent animate-border-glow"
          : "bg-silver/30 group-hover:bg-accent/50"
      }`} />

      {/* Popular badge */}
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-accent px-4 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-accent/20">
          {popularLabel}
        </span>
      )}

      <p className={`text-[10px] font-semibold tracking-[0.4em] uppercase ${
        highlighted ? "text-white/60" : "text-steel"
      }`}>
        {name}
      </p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-4xl tracking-tight sm:text-5xl">
          ${price}
        </span>
        {price > 0 && (
          <span className={`text-sm ${highlighted ? "text-white/40" : "text-steel/60"}`}>{perMonthLabel}</span>
        )}
      </div>

      {annualTotal !== null && price > 0 && (
        <p className="mt-1 text-[11px] font-medium text-green-600">
          ${annualTotal}{perYearLabel}
        </p>
      )}

      <p className={`mt-3 text-xs leading-relaxed ${
        highlighted ? "text-white/50" : "text-slate"
      }`}>
        {description}
      </p>

      <div className={`my-5 h-px ${highlighted ? "bg-white/10" : "bg-silver/30"}`} />

      <ul className="flex-1 space-y-3">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5 text-xs">
            {f.included ? (
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                highlighted ? "bg-green-500/20" : "bg-green-500/10"
              }`}>
                <Check size={10} weight="bold" className={highlighted ? "text-green-400" : "text-green-600"} />
              </span>
            ) : (
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                highlighted ? "bg-white/5" : "bg-silver/20"
              }`}>
                <XIcon size={10} weight="bold" className={highlighted ? "text-white/20" : "text-silver/50"} />
              </span>
            )}
            <span className={
              f.included
                ? highlighted ? "text-white/80" : "text-navy/80"
                : highlighted ? "text-white/25" : "text-silver"
            }>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isCurrent ? (
          <span className={`flex w-full min-h-[48px] items-center justify-center rounded-sm border text-xs font-semibold tracking-[0.2em] uppercase ${
            highlighted ? "border-green-400/50 text-green-400" : "border-green-600/50 text-green-600"
          }`}>
            {currentPlanLabel}
          </span>
        ) : plan ? (
          <button
            onClick={() => onCheckout(plan)}
            disabled={loading !== null}
            className={`flex w-full min-h-[48px] touch-manipulation select-none items-center justify-center rounded-sm text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${
              highlighted
                ? "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover hover:shadow-accent/30"
                : "bg-navy text-white hover:bg-slate"
            }`}
          >
            {loading === plan ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-btn-spin" />
            ) : cta}
          </button>
        ) : (
          <Link
            href="/login"
            className="flex w-full min-h-[48px] items-center justify-center rounded-sm border border-silver/40 text-xs font-semibold tracking-[0.2em] text-steel uppercase transition-all duration-200 hover:border-navy hover:text-navy"
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
