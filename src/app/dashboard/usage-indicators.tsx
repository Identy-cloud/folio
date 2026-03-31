"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { getPlanLimits } from "@/lib/plan-limits";

interface ProfileData {
  plan: string;
  storageUsed: number;
  presentationCount: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function UsageIndicators() {
  const { t } = useTranslation();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setData(d); })
      .catch(() => {});
  }, []);

  if (!data) return null;

  const limits = getPlanLimits(data.plan);
  const isPaid = data.plan !== "free";

  if (isPaid && limits.maxPresentations === Infinity) return null;

  const presUsed = data.presentationCount;
  const presMax = limits.maxPresentations;
  const presPercent = presMax === Infinity ? 0 : Math.min((presUsed / presMax) * 100, 100);

  const storageUsed = data.storageUsed;
  const storageMax = limits.maxStorageBytes;
  const storagePercent = Math.min((storageUsed / storageMax) * 100, 100);

  return (
    <div className="mb-4 flex flex-col gap-3 rounded border border-steel/30 bg-navy/50 p-3 sm:flex-row sm:items-center sm:gap-6 sm:p-4">
      {presMax !== Infinity && (
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-silver/70">
            <span>
              {t.dashboard.usagePresentations
                .replace("{used}", String(presUsed))
                .replace("{max}", String(presMax))}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full transition-all ${presPercent >= 90 ? "bg-red-500" : presPercent >= 70 ? "bg-yellow-500" : "bg-silver/50"}`}
              style={{ width: `${presPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-silver/70">
          <span>
            {t.dashboard.usageStorage
              .replace("{used}", formatBytes(storageUsed))
              .replace("{max}", formatBytes(storageMax))}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full transition-all ${storagePercent >= 90 ? "bg-red-500" : storagePercent >= 70 ? "bg-yellow-500" : "bg-silver/50"}`}
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      </div>

      {!isPaid && (
        <Link
          href="/pricing"
          className="shrink-0 text-xs font-medium tracking-widest text-silver uppercase transition-colors hover:text-white"
        >
          {t.dashboard.usageUpgrade}
        </Link>
      )}
    </div>
  );
}
