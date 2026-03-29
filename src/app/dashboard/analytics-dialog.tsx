"use client";

import { useState, useEffect } from "react";
import { DialogShell } from "@/components/ui/DialogShell";
import { ChartBar, Eye, Users, Timer } from "@phosphor-icons/react";

interface Analytics {
  totalViews: number;
  uniqueViewers: number;
  avgDuration: number;
  viewsBySlide: { slideIndex: number; views: number }[];
}

interface Props {
  open: boolean;
  presentationId: string | null;
  title: string;
  onClose: () => void;
}

export function AnalyticsDialog({ open, presentationId, title, onClose }: Props) {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !presentationId) return;
    setLoading(true);
    setError(false);
    fetch(`/api/analytics?presentationId=${presentationId}`)
      .then((r) => {
        if (r.status === 403) throw new Error("PLAN");
        if (!r.ok) throw new Error("FAIL");
        return r.json();
      })
      .then(setData)
      .catch((e) => {
        setError(true);
        if (e.message === "PLAN") setData(null);
      })
      .finally(() => setLoading(false));
  }, [open, presentationId]);

  return (
    <DialogShell
      open={open}
      ariaLabel="Analytics"
      onClose={onClose}
      className="w-full max-w-md rounded bg-[#1e1e1e] border border-neutral-700 p-6 shadow-xl mx-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <ChartBar size={18} weight="duotone" className="text-blue-400" />
        <h3 className="font-display text-lg tracking-tight text-neutral-200">Analytics</h3>
      </div>
      <p className="text-xs text-neutral-500 mb-4">{title}</p>

      {loading && <p className="py-8 text-center text-xs text-neutral-500">Loading...</p>}

      {error && !data && (
        <p className="py-8 text-center text-xs text-neutral-500">
          Upgrade to Creator plan to access analytics.
        </p>
      )}

      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded border border-neutral-700 p-3 text-center">
              <Eye size={16} className="mx-auto text-neutral-500" />
              <p className="mt-1 font-display text-2xl text-white">{data.totalViews}</p>
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Views</p>
            </div>
            <div className="rounded border border-neutral-700 p-3 text-center">
              <Users size={16} className="mx-auto text-neutral-500" />
              <p className="mt-1 font-display text-2xl text-white">{data.uniqueViewers}</p>
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Unique</p>
            </div>
            <div className="rounded border border-neutral-700 p-3 text-center">
              <Timer size={16} className="mx-auto text-neutral-500" />
              <p className="mt-1 font-display text-2xl text-white">{data.avgDuration}s</p>
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Avg time</p>
            </div>
          </div>

          {data.viewsBySlide.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                Views by slide
              </p>
              <div className="space-y-1">
                {data.viewsBySlide.map((s) => {
                  const max = Math.max(...data.viewsBySlide.map((v) => v.views), 1);
                  return (
                    <div key={s.slideIndex} className="flex items-center gap-2">
                      <span className="w-8 text-right text-[10px] text-neutral-500">
                        #{s.slideIndex + 1}
                      </span>
                      <div className="flex-1 h-4 rounded bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full rounded bg-blue-500/40"
                          style={{ width: `${(s.views / max) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-[10px] text-neutral-400">{s.views}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {presentationId && data && (
          <a
            href={`/dashboard/${presentationId}/analytics`}
            className="flex-1 rounded border border-neutral-700 py-2 text-center text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            Full report →
          </a>
        )}
        <button
          onClick={onClose}
          className="flex-1 rounded px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
        >
          Close
        </button>
      </div>
    </DialogShell>
  );
}
