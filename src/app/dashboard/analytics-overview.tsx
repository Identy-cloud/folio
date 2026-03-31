"use client";

import { useEffect, useState } from "react";
import { Eye, Users, Crown, TrendUp, Lock } from "@phosphor-icons/react";
import { UpgradeModal } from "@/components/UpgradeModal";
import { requiredPlanFor } from "@/lib/plan-limits";

interface OverviewData {
  totalViews: number;
  uniqueViewers: number;
  mostViewed: { title: string; views: number } | null;
  last7Days: { date: string; views: number }[];
}

export function AnalyticsOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [gated, setGated] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetch("/api/analytics/overview")
      .then((r) => {
        if (r.status === 403) { setGated(true); return null; }
        if (!r.ok) return null;
        return r.json();
      })
      .then((d: OverviewData | null) => { if (d) setData(d); })
      .catch(() => {});
  }, []);

  if (gated) {
    return (
      <div className="mb-6 rounded border border-steel/60 bg-gradient-to-r from-neutral-900 to-neutral-800 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Lock size={20} className="text-silver/50" />
          <div>
            <p className="text-sm font-medium text-silver">
              Unlock analytics
            </p>
            <p className="text-xs text-silver/50">
              Upgrade to Creator plan to see views, unique visitors, and trends.
            </p>
          </div>
          <button
            onClick={() => setShowUpgrade(true)}
            className="ml-auto shrink-0 rounded bg-accent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Upgrade
          </button>
        </div>
        <UpgradeModal
          open={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          feature="Analytics"
          requiredPlan={requiredPlanFor("canUseAnalytics")}
        />
      </div>
    );
  }

  if (!data) return null;

  const maxBar = Math.max(...data.last7Days.map((d) => d.views), 1);
  const weekTotal = data.last7Days.reduce((s, d) => s + d.views, 0);
  const dayLabels = data.last7Days.map((d) => {
    const dt = new Date(d.date + "T00:00:00");
    return dt.toLocaleDateString("en", { weekday: "short" }).slice(0, 2);
  });

  return (
    <div className="mb-6">
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-3 min-w-[600px] md:grid md:grid-cols-4 md:min-w-0">
          {/* Total views */}
          <div className="flex-1 rounded border border-steel/60 bg-slate p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={14} className="text-silver/50" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
                Total views
              </span>
            </div>
            <p className="font-display text-2xl text-white md:text-3xl">
              {data.totalViews.toLocaleString()}
            </p>
            {weekTotal > 0 && (
              <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                <TrendUp size={10} /> {weekTotal} this week
              </p>
            )}
          </div>

          {/* Unique viewers */}
          <div className="flex-1 rounded border border-steel/60 bg-slate p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} className="text-silver/50" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
                Unique viewers
              </span>
            </div>
            <p className="font-display text-2xl text-white md:text-3xl">
              {data.uniqueViewers.toLocaleString()}
            </p>
          </div>

          {/* Most popular */}
          <div className="flex-1 rounded border border-steel/60 bg-slate p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={14} className="text-amber-500" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
                Most popular
              </span>
            </div>
            {data.mostViewed ? (
              <>
                <p className="truncate text-sm font-medium text-white">
                  {data.mostViewed.title}
                </p>
                <p className="mt-1 text-[10px] text-silver/50">
                  {data.mostViewed.views.toLocaleString()} views
                </p>
              </>
            ) : (
              <p className="text-xs text-silver/50">No views yet</p>
            )}
          </div>

          {/* Last 7 days chart */}
          <div className="flex-1 rounded border border-steel/60 bg-slate p-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
              Last 7 days
            </span>
            <div className="mt-2 flex items-end gap-1 h-12">
              {data.last7Days.map((d, i) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-blue-500/50 transition-all"
                    style={{ height: `${Math.max((d.views / maxBar) * 48, 2)}px` }}
                  />
                  <span className="text-[8px] text-silver/40">{dayLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
