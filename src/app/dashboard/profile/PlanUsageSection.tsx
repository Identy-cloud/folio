"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";

interface Billing {
  presentationCount: number;
  maxPresentations: number;
}

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

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === Infinity ? 0 : Math.min((value / max) * 100, 100);
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className={`h-full rounded-full transition-all ${pct > 80 ? "bg-amber-500" : "bg-accent"}`}
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
      <p className="text-[10px] font-medium uppercase tracking-wider text-silver/50">Uso</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border border-steel/30 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-silver/50">Almacenamiento</p>
          <p className="mt-1 text-sm text-silver">
            {formatBytes(storageUsed)}
            <span className="text-silver/50"> / {formatBytes(maxStorage)}</span>
          </p>
          <ProgressBar value={storageUsed} max={maxStorage} />
        </div>
        <div className="border border-steel/30 p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
            {t.dashboard.profilePresentations ?? "Presentaciones"}
          </p>
          <p className="mt-1 text-sm text-silver">
            {presCount}
            <span className="text-silver/50">{maxPres === Infinity ? " / ilimitadas" : ` / ${maxPres}`}</span>
          </p>
          <ProgressBar value={presCount} max={maxPres} />
        </div>
      </div>
    </div>
  );
}
