"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

interface BillingInfo {
  plan: string;
  billingPeriod: string;
  status: string;
  currentPeriodEnd: string | null;
  presentationCount: number;
  maxPresentations: number;
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-neutral-700 text-neutral-300",
  creator: "bg-blue-600 text-white",
  studio: "bg-purple-600 text-white",
  agency: "bg-amber-600 text-white",
};

export default function BillingPage() {
  const [info, setInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => (r.ok ? r.json() : null))
      .then(setInfo)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handlePortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#161616]">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] text-neutral-200">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard/profile"
            className="flex h-8 w-8 items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl tracking-tight sm:text-3xl">BILLING</h1>
        </div>

        {info && (
          <div className="space-y-6">
            {/* Current plan */}
            <div className="border border-neutral-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Plan actual</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${PLAN_COLORS[info.plan] ?? PLAN_COLORS.free}`}>
                      {info.plan}
                    </span>
                    {info.billingPeriod !== "monthly" && info.plan !== "free" && (
                      <span className="text-[10px] text-neutral-500 uppercase">{info.billingPeriod}</span>
                    )}
                  </div>
                </div>
                {info.status === "active" && info.plan !== "free" && (
                  <span className="flex items-center gap-1.5 text-[10px] text-green-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Activo
                  </span>
                )}
              </div>

              {info.currentPeriodEnd && (
                <p className="mt-3 text-xs text-neutral-500">
                  Proxima renovacion: {new Date(info.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Usage */}
            <div className="border border-neutral-800 p-5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Uso</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-neutral-300">Presentaciones</span>
                <span className="text-sm text-neutral-400">
                  {info.presentationCount}
                  {info.maxPresentations < Infinity ? ` / ${info.maxPresentations}` : ""}
                </span>
              </div>
              {info.maxPresentations < Infinity && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full bg-neutral-400 transition-all"
                    style={{ width: `${Math.min((info.presentationCount / info.maxPresentations) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {info.plan !== "free" && (
                <button
                  onClick={handlePortal}
                  className="w-full border border-neutral-700 py-3 text-xs font-medium tracking-[0.2em] text-neutral-300 uppercase hover:border-neutral-500 hover:text-white transition-colors"
                >
                  Gestionar suscripcion
                </button>
              )}
              {info.plan !== "agency" && (
                <Link
                  href="/pricing"
                  className="block w-full bg-white py-3 text-center text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 transition-colors"
                >
                  {info.plan === "free" ? "Upgrade" : "Cambiar plan"}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
