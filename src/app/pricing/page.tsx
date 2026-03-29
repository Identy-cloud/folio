"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check, X as XIcon } from "@phosphor-icons/react";

const tiers = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    description: "Para empezar a crear presentaciones editoriales.",
    features: [
      { text: "3 presentaciones", included: true },
      { text: "1 tema (editorial-blue)", included: true },
      { text: "Link publico", included: true },
      { text: "Watermark de Folio", included: false },
      { text: "Colaboracion", included: false },
      { text: "Export PDF", included: false },
    ],
    cta: "Empezar gratis",
    plan: null,
    highlighted: false,
  },
  {
    name: "Creator",
    monthly: 19,
    annual: 15,
    description: "Para profesionales que necesitan control total.",
    features: [
      { text: "Presentaciones ilimitadas", included: true },
      { text: "Todos los temas", included: true },
      { text: "Sin watermark", included: true },
      { text: "Custom domain", included: true },
      { text: "Analytics basicos", included: true },
      { text: "Export PDF", included: true },
      { text: "Colaboracion", included: false },
      { text: "Brand kit", included: false },
    ],
    cta: "Comenzar Creator",
    plan: "creator" as const,
    highlighted: false,
  },
  {
    name: "Studio",
    monthly: 49,
    annual: 39,
    description: "Para equipos creativos que colaboran en tiempo real.",
    features: [
      { text: "Todo lo de Creator", included: true },
      { text: "Colaboracion (hasta 5)", included: true },
      { text: "Brand kit", included: true },
      { text: "Fuentes custom", included: true },
      { text: "Export PDF + PPTX", included: true },
      { text: "Templates privados", included: true },
    ],
    cta: "Comenzar Studio",
    plan: "studio" as const,
    highlighted: true,
  },
  {
    name: "Agency",
    monthly: 149,
    annual: 119,
    description: "Para agencias. Precio flat, no por seat.",
    features: [
      { text: "Todo lo de Studio", included: true },
      { text: "Colaboracion ilimitada", included: true },
      { text: "Multi-workspace", included: true },
      { text: "White label", included: true },
      { text: "Analytics avanzados", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Comenzar Agency",
    plan: "agency" as const,
    highlighted: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.plan) setCurrentPlan(d.plan); })
      .catch(() => {});
  }, []);

  async function handleCheckout(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, period: annual ? "annual" : "monthly" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (res.status === 401) router.push("/login");
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#161616] text-white">
      <header className="flex items-center justify-between px-4 py-6 sm:px-8">
        <Link href="/" className="font-display text-xl tracking-tight sm:text-2xl">FOLIO</Link>
        <Link href="/" className="text-xs tracking-[0.25em] text-neutral-400 uppercase hover:text-white transition-colors">Volver</Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 lg:py-16">
        <p className="text-[10px] tracking-[0.5em] text-neutral-500 uppercase">Planes</p>
        <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl lg:text-7xl">Elige tu plan</h1>
        <p className="mt-4 max-w-lg text-center text-sm leading-relaxed text-neutral-400">
          Un deck de agencia cuesta $3,000–$15,000. Studio se paga solo con el primer proyecto.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className={`text-xs ${!annual ? "text-white" : "text-neutral-500"}`}>Mensual</span>
          <button
            onClick={() => setAnnual(!annual)}
            role="switch"
            aria-checked={annual}
            className={`relative h-6 w-11 rounded-full transition-colors ${annual ? "bg-green-600" : "bg-neutral-700"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${annual ? "left-[22px]" : "left-0.5"}`} />
          </button>
          <span className={`text-xs ${annual ? "text-white" : "text-neutral-500"}`}>Anual <span className="text-green-500">-20%</span></span>
        </div>

        <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => {
            const price = annual ? tier.annual : tier.monthly;
            const isCurrent = currentPlan === (tier.plan ?? "free");
            return (
              <div key={tier.name} className={`flex flex-col border p-5 sm:p-6 ${tier.highlighted ? "border-neutral-400 bg-[#1c1c1c] relative" : "border-neutral-800 bg-[#1a1a1a]"}`}>
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-[10px] font-semibold tracking-widest text-black uppercase">Popular</span>
                )}
                <p className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase">{tier.name}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-3xl tracking-tight sm:text-4xl">${price}</span>
                  {price > 0 && <span className="text-sm text-neutral-500">/mes</span>}
                </div>
                {annual && price > 0 && <p className="mt-1 text-[10px] text-green-500">${price * 12}/ano</p>}
                <p className="mt-3 text-xs leading-relaxed text-neutral-500">{tier.description}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-xs">
                      {f.included
                        ? <Check size={14} className="mt-0.5 shrink-0 text-green-500" />
                        : <XIcon size={14} className="mt-0.5 shrink-0 text-neutral-600" />}
                      <span className={f.included ? "text-neutral-300" : "text-neutral-600"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {isCurrent ? (
                    <span className="block w-full border border-green-600 py-2.5 text-center text-xs font-semibold tracking-[0.2em] text-green-500 uppercase">Plan actual</span>
                  ) : tier.plan ? (
                    <button onClick={() => handleCheckout(tier.plan!)} disabled={loading !== null}
                      className={`block w-full py-2.5 text-center text-xs font-semibold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 ${tier.highlighted ? "bg-white text-black hover:bg-neutral-200" : "border border-neutral-600 text-neutral-300 hover:border-white hover:text-white"}`}>
                      {loading === tier.plan ? "..." : tier.cta}
                    </button>
                  ) : (
                    <Link href="/login" className="block w-full border border-neutral-700 py-2.5 text-center text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase hover:border-neutral-500 transition-colors">
                      {tier.cta}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-10 text-xs text-neutral-600">Todos los precios en USD. Cancela cuando quieras.</p>
      </main>

      <footer className="flex items-center justify-center py-8">
        <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">Folio — Identy Cloud</p>
      </footer>
    </div>
  );
}
