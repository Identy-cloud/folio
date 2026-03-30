"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Confetti } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

function UpgradeCelebrationInner() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    if (searchParams.get("upgraded") !== "true") return;

    setShown(true);

    const fetchPlan = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const data = await res.json();
        const planName = (data.plan ?? "Pro").charAt(0).toUpperCase() + (data.plan ?? "pro").slice(1);

        const features = [
          t.dashboard.upgradeFeatureNowatermark,
          t.dashboard.upgradeFeatureUnlimited,
          t.dashboard.upgradeFeatureExport,
          t.dashboard.upgradeFeatureThemes,
          t.dashboard.upgradeFeatureAI,
          t.dashboard.upgradeFeatureCollab,
        ];

        toast(
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-medium">
              <Confetti size={18} weight="fill" className="text-yellow-400" />
              {t.dashboard.upgradeCelebrationTitle.replace("{plan}", planName)}
            </div>
            <p className="text-xs text-neutral-400">{t.dashboard.upgradeCelebrationDesc}</p>
            <ul className="space-y-1">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-neutral-300">
                  <Check size={12} weight="bold" className="text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>,
          { duration: 8000 },
        );
      } catch {
        /* ignore */
      }
    };

    fetchPlan();

    const url = new URL(window.location.href);
    url.searchParams.delete("upgraded");
    router.replace(url.pathname + url.search, { scroll: false });
  }, [searchParams, router, t, shown]);

  return null;
}

export function UpgradeCelebration() {
  return (
    <Suspense fallback={null}>
      <UpgradeCelebrationInner />
    </Suspense>
  );
}
