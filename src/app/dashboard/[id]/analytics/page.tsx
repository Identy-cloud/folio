"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, ChartBar, Eye, Users, Timer } from "@phosphor-icons/react";
import { FolioLogo } from "@/components/FolioLogo";

interface Analytics {
  totalViews: number;
  uniqueViewers: number;
  avgDuration: number;
  viewsBySlide: { slideIndex: number; views: number }[];
  recentViews: { createdAt: string; duration: number | null }[];
}

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Analytics | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/analytics?presentationId=${id}`).then((r) => {
        if (r.status === 403) throw new Error("PLAN");
        if (!r.ok) throw new Error("FAIL");
        return r.json();
      }),
      fetch(`/api/presentations/${id}`).then((r) => r.ok ? r.json() : null),
    ])
      .then(([analytics, pres]) => {
        setData(analytics);
        setTitle(pres?.title ?? "Presentation");
      })
      .catch((e) => setError(e.message === "PLAN" ? "Upgrade to Creator to access analytics." : "Failed to load analytics."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-navy text-white">
      <header className="flex items-center gap-4 border-b border-steel/30 px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="text-silver/50 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <FolioLogo size={18} className="text-lg text-white/40" />
        <span className="text-xs text-silver/50">/ Analytics</span>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <ChartBar size={20} weight="duotone" className="text-blue-400" />
          <h1 className="font-display text-2xl tracking-tight">{title}</h1>
        </div>

        {loading && <p className="py-12 text-center text-silver/50">Loading analytics...</p>}
        {error && <p className="py-12 text-center text-silver/50">{error}</p>}

        {data && (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded border border-steel/30 p-6 text-center">
                <Eye size={24} className="mx-auto text-silver/50" />
                <p className="mt-2 font-display text-4xl">{data.totalViews}</p>
                <p className="mt-1 text-xs text-silver/50 uppercase tracking-wider">Total views</p>
              </div>
              <div className="rounded border border-steel/30 p-6 text-center">
                <Users size={24} className="mx-auto text-silver/50" />
                <p className="mt-2 font-display text-4xl">{data.uniqueViewers}</p>
                <p className="mt-1 text-xs text-silver/50 uppercase tracking-wider">Unique viewers</p>
              </div>
              <div className="rounded border border-steel/30 p-6 text-center">
                <Timer size={24} className="mx-auto text-silver/50" />
                <p className="mt-2 font-display text-4xl">{data.avgDuration}s</p>
                <p className="mt-1 text-xs text-silver/50 uppercase tracking-wider">Avg. duration</p>
              </div>
            </div>

            {/* Views by slide */}
            {data.viewsBySlide.length > 0 && (
              <div>
                <h2 className="mb-4 text-xs font-medium text-silver/70 uppercase tracking-wider">Views by slide</h2>
                <div className="space-y-2">
                  {data.viewsBySlide.map((s) => {
                    const max = Math.max(...data.viewsBySlide.map((v) => v.views), 1);
                    return (
                      <div key={s.slideIndex} className="flex items-center gap-3">
                        <span className="w-16 text-right text-sm text-silver/50">Slide {s.slideIndex + 1}</span>
                        <div className="flex-1 h-6 rounded bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded bg-blue-500/40 flex items-center px-2"
                            style={{ width: `${Math.max((s.views / max) * 100, 5)}%` }}
                          >
                            <span className="text-[10px] text-white/80">{s.views}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent views */}
            {data.recentViews.length > 0 && (
              <div>
                <h2 className="mb-4 text-xs font-medium text-silver/70 uppercase tracking-wider">Recent views</h2>
                <div className="rounded border border-steel/30 divide-y divide-neutral-800">
                  {data.recentViews.slice(0, 20).map((v, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2">
                      <span className="text-xs text-silver/70">
                        {new Date(v.createdAt).toLocaleString()}
                      </span>
                      <span className="text-xs text-silver/50">
                        {v.duration ? `${v.duration}s` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
