"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DialogShell } from "@/components/ui/DialogShell";
import type { Plan } from "@/lib/stripe";

const PLAN_LABELS: Record<Plan, string> = {
  free: "Free",
  creator: "Creator",
  studio: "Studio",
  agency: "Agency",
};

const PLAN_PRICES: Record<Exclude<Plan, "free">, number> = {
  creator: 19,
  studio: 49,
  agency: 149,
};

interface Props {
  open: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan: Plan;
}

export function UpgradeModal({ open, onClose, feature, requiredPlan }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: requiredPlan, period: "monthly" }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) { window.location.href = data.url; return; }
      console.error("Stripe checkout error:", data.error);
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoading(false);
    }
  }

  if (requiredPlan === "free") return null;

  return (
    <DialogShell open={open} ariaLabel="Upgrade" onClose={onClose}>
      <div className="text-center">
        <p className="text-[10px] tracking-[0.4em] text-silver/50 uppercase">
          Upgrade
        </p>
        <h3 className="mt-3 font-display text-2xl tracking-tight text-silver">
          {feature}
        </h3>
        <p className="mt-3 text-sm text-silver/70">
          Disponible en el plan{" "}
          <span className="font-medium text-white">{PLAN_LABELS[requiredPlan]}</span>
          {" "}por{" "}
          <span className="font-medium text-white">${PLAN_PRICES[requiredPlan]}/mes</span>
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-accent py-3 text-xs font-semibold tracking-[0.25em] text-white uppercase hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : `Upgrade a ${PLAN_LABELS[requiredPlan]}`}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-silver/50 hover:text-silver transition-colors"
          >
            Ahora no
          </button>
        </div>
      </div>
    </DialogShell>
  );
}
