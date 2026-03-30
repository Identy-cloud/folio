"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  ChartBar,
  Eye,
  Users,
  Timer,
  PencilSimple,
} from "@phosphor-icons/react";
import { FolioLogo } from "@/components/FolioLogo";
import { ViewsOverTimeChart, ViewsBySlideChart } from "./analytics-charts";

interface Analytics {
  totalViews: number;
  uniqueViewers: number;
  avgDuration: number;
  viewsBySlide: { slideIndex: number; views: number }[];
  viewsOverTime: { date: string; views: number }[];
  recentViews: { createdAt: string; duration: number | null }[];
}

export function AnalyticsClient({ presentationId }: { presentationId: string }) {
  const [data, setData] = useState<Analytics | null>(null);
  const [title, setTitle] = useState("Presentation");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/analytics?presentationId=${presentationId}`).then((r) => {
        if (r.status === 403) throw new Error("PLAN");
        if (!r.ok) throw new Error("FAIL");
        return r.json();
      }),
      fetch(`/api/presentations/${presentationId}`)
        .then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([analytics, pres]) => {
        setData(analytics as Analytics);
        if (pres?.title) setTitle(pres.title as string);
      })
      .catch((e: Error) =>
        setError(
          e.message === "PLAN"
            ? "Upgrade to Creator plan to access analytics."
            : "Failed to load analytics.",
        ),
      )
      .finally(() => setLoading(false));
  }, [presentationId]);

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <header className="flex items-center gap-4 border-b border-neutral-800 px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="text-neutral-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <FolioLogo size={18} className="text-lg text-white/40" />
        <span className="text-xs text-neutral-500">/ Analytics</span>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ChartBar size={20} weight="duotone" className="text-blue-400" />
            <h1 className="font-display text-xl tracking-tight sm:text-2xl">{title}</h1>
          </div>
          <Link
            href={`/editor/${presentationId}`}
            className="flex items-center gap-1.5 rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors w-fit"
          >
            <PencilSimple size={12} /> Open in editor
          </Link>
        </div>

        {loading && <p className="py-12 text-center text-neutral-500">Loading analytics...</p>}
        {error && <p className="py-12 text-center text-neutral-500">{error}</p>}

        {data && (
          <div className="space-y-8">
            <StatsCards data={data} />
            {data.viewsOverTime.length > 0 && <ViewsOverTimeChart data={data.viewsOverTime} />}
            {data.viewsBySlide.length > 0 && <ViewsBySlideChart data={data.viewsBySlide} />}
            {data.recentViews.length > 0 && <RecentViews views={data.recentViews} />}
          </div>
        )}
      </main>
    </div>
  );
}

function StatsCards({ data }: { data: Analytics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard icon={<Eye size={24} className="text-neutral-500" />} value={data.totalViews} label="Total views" />
      <StatCard icon={<Users size={24} className="text-neutral-500" />} value={data.uniqueViewers} label="Unique viewers" />
      <StatCard icon={<Timer size={24} className="text-neutral-500" />} value={`${data.avgDuration}s`} label="Avg. duration" />
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="rounded border border-neutral-800 p-6 text-center">
      <div className="mx-auto w-fit">{icon}</div>
      <p className="mt-2 font-display text-3xl sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs text-neutral-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function RecentViews({ views }: { views: Analytics["recentViews"] }) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-400">
        Recent views (last 50)
      </h2>
      <div className="rounded border border-neutral-800 divide-y divide-neutral-800">
        {views.map((v, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2">
            <span className="text-xs text-neutral-400">
              {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
            </span>
            <span className="text-xs text-neutral-500">
              {v.duration ? `${v.duration}s` : "\u2014"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
