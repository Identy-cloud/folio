"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { PricingTierCard } from "./PricingTierCard";
import { PricingToggle } from "./PricingToggle";
import { toast } from "sonner";

function useTiers(p: ReturnType<typeof useTranslation>["t"]["pricing"]) {
  return [
    { name: p.freeName, monthly: 0, annual: 0, description: p.freeDesc,
      features: [{ text: p.freeF1, included: true }, { text: p.freeF2, included: true }, { text: p.freeF3, included: true }, { text: p.freeF4, included: false }, { text: p.freeF5, included: false }, { text: p.freeF6, included: false }],
      cta: p.freeCta, plan: null as string | null, highlighted: false },
    { name: p.creatorName, monthly: 19, annual: 15, description: p.creatorDesc,
      features: [{ text: p.creatorF1, included: true }, { text: p.creatorF2, included: true }, { text: p.creatorF3, included: true }, { text: p.creatorF4, included: true }, { text: p.creatorF5, included: true }, { text: p.creatorF6, included: true }, { text: p.creatorF7, included: false }, { text: p.creatorF8, included: false }],
      cta: p.creatorCta, plan: "creator" as string | null, highlighted: false },
    { name: p.studioName, monthly: 49, annual: 39, description: p.studioDesc,
      features: [{ text: p.studioF1, included: true }, { text: p.studioF2, included: true }, { text: p.studioF3, included: true }, { text: p.studioF4, included: true }, { text: p.studioF5, included: true }, { text: p.studioF6, included: true }],
      cta: p.studioCta, plan: "studio" as string | null, highlighted: true },
    { name: p.agencyName, monthly: 149, annual: 119, description: p.agencyDesc,
      features: [{ text: p.agencyF1, included: true }, { text: p.agencyF2, included: true }, { text: p.agencyF3, included: true }, { text: p.agencyF4, included: true }, { text: p.agencyF5, included: true }, { text: p.agencyF6, included: true }],
      cta: p.agencyCta, plan: "agency" as string | null, highlighted: false },
  ];
}

export function PricingClient() {
  const router = useRouter();
  const { t } = useTranslation();
  const p = t.pricing;
  const tiers = useTiers(p);
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { plan?: string } | null) => { if (d?.plan) setCurrentPlan(d.plan); })
      .catch(() => {});
  }, []);

  async function handleCheckout(plan: string) {
    setLoading(plan);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, period: annual ? "annual" : "monthly" }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 401) { router.push(`/login?redirect=/pricing`); return; }
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) { window.location.href = data.url; return; }
      toast.error(data.error ?? "Error creating checkout session");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.error("Request timed out. Check your connection and try again.");
      } else {
        toast.error("Connection error. Please try again.");
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-navy">
      <PublicHeader />

      <main className="flex flex-1 flex-col items-center px-5 py-8 sm:px-8 lg:py-16">
        <p className="text-[10px] font-semibold tracking-[0.5em] text-accent uppercase">{p.label}</p>
        <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl lg:text-7xl">{p.heading}</h1>
        <div className="mx-auto mt-3 h-px w-12 bg-accent/40" />
        <p className="mt-5 max-w-lg text-center text-sm leading-relaxed text-slate">{p.description}</p>

        <PricingToggle annual={annual} setAnnual={setAnnual} monthlyLabel={p.monthly} annualLabel={p.annual} discountLabel={p.discount} />

        <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => {
            const price = annual ? tier.annual : tier.monthly;
            return (
              <PricingTierCard key={tier.name} name={tier.name} price={price}
                annualTotal={annual ? price * 12 : null} description={tier.description}
                features={tier.features} cta={tier.cta} plan={tier.plan}
                highlighted={tier.highlighted} isCurrent={currentPlan === (tier.plan ?? "free")}
                loading={loading} currentPlanLabel={p.currentPlan} popularLabel={p.popular}
                perMonthLabel={p.perMonth} perYearLabel={p.perYear}
                onCheckout={handleCheckout} index={i} />
            );
          })}
        </div>
        <p className="mt-10 text-xs text-steel/60">{p.allPricesNote}</p>
      </main>

      <PublicFooter />
    </div>
  );
}
