"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

interface Billing {
  plan: string;
  billingPeriod: string;
  status: string;
  currentPeriodEnd: string | null;
  presentationCount: number;
  maxPresentations: number;
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  creator: "Creator",
  studio: "Studio",
  agency: "Agency",
};

const STORAGE_LIMITS: Record<string, number> = {
  free: 100 * 1024 * 1024,
  creator: 10 * 1024 * 1024 * 1024,
  studio: 50 * 1024 * 1024 * 1024,
  agency: 200 * 1024 * 1024 * 1024,
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function ProgressBar({ value, max, color = "bg-white" }: { value: number; max: number; color?: string }) {
  const pct = max === Infinity ? 0 : Math.min((value / max) * 100, 100);
  const isHigh = pct > 80;
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
      <div
        className={`h-full rounded-full transition-all ${isHigh ? "bg-amber-500" : color}`}
        style={{ width: `${Math.max(pct, 1)}%` }}
      />
    </div>
  );
}

interface Props {
  plan: string;
  storageUsed: number;
}

export function PlanUsageSection({ plan, storageUsed }: Props) {
  const { t } = useTranslation();
  const [billing, setBilling] = useState<Billing | null>(null);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => (r.ok ? r.json() : null))
      .then(setBilling)
      .catch(() => {});
  }, []);

  const maxStorage = STORAGE_LIMITS[plan] ?? STORAGE_LIMITS.free;
  const presCount = billing?.presentationCount ?? 0;
  const maxPres = billing?.maxPresentations ?? 3;

  return (
    <div className="space-y-4">
      {/* Plan card */}
      <div className="border border-neutral-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
              {t.dashboard.profilePlan ?? "Plan"}
            </p>
            <p className="mt-1 text-lg font-medium text-neutral-200">
              {PLAN_LABELS[plan] ?? plan}
            </p>
            {billing && plan !== "free" && (
              <p className="mt-0.5 text-xs text-neutral-500">
                {billing.billingPeriod === "annual" ? "Anual" : "Mensual"}
                {billing.currentPeriodEnd && (
                  <> &middot; Renueva el {new Date(billing.currentPeriodEnd).toLocaleDateString()}</>
                )}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {plan !== "free" && (
              <button
                onClick={async () => {
                  const res = await fetch("/api/stripe/portal", { method: "POST" });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                className="text-xs tracking-[0.2em] text-neutral-500 uppercase hover:text-white transition-colors"
              >
                Facturas
              </button>
            )}
            <Link
              href="/pricing"
              className="text-xs tracking-[0.2em] text-neutral-400 uppercase hover:text-white transition-colors"
            >
              {t.dashboard.profileUpgrade ?? "Ver planes"}
            </Link>
          </div>
        </div>
      </div>

      {/* Usage bars */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border border-neutral-800 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            Almacenamiento
          </p>
          <p className="mt-1 text-sm text-neutral-200">
            {formatBytes(storageUsed)}
            <span className="text-neutral-500"> / {formatBytes(maxStorage)}</span>
          </p>
          <ProgressBar value={storageUsed} max={maxStorage} />
        </div>
        <div className="border border-neutral-800 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            {t.dashboard.profilePresentations ?? "Presentaciones"}
          </p>
          <p className="mt-1 text-sm text-neutral-200">
            {presCount}
            <span className="text-neutral-500">
              {maxPres === Infinity ? " / ilimitadas" : ` / ${maxPres}`}
            </span>
          </p>
          <ProgressBar value={presCount} max={maxPres} />
        </div>
      </div>
    </div>
  );
}
