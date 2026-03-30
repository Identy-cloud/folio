"use client";

import Link from "next/link";
import { usePlanLimits } from "@/hooks/usePlanLimits";

export function UpgradeButton() {
  const { plan, loading } = usePlanLimits();

  if (loading || plan !== "free") return null;

  return (
    <Link
      href="/pricing"
      className="flex items-center rounded bg-amber-500/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase hover:bg-amber-400 transition-colors"
    >
      Upgrade
    </Link>
  );
}
