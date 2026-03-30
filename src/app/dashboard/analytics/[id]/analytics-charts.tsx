"use client";

interface DayData {
  date: string;
  views: number;
}

interface SlideData {
  slideIndex: number;
  views: number;
}

export function ViewsOverTimeChart({ data }: { data: DayData[] }) {
  const max = Math.max(...data.map((d) => d.views), 1);

  return (
    <section>
      <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-400">
        Views over time (30 days)
      </h2>
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex items-end gap-px min-w-[480px] h-40 md:min-w-0">
          {data.map((d) => {
            const pct = Math.max((d.views / max) * 100, 2);
            const label = new Date(d.date + "T00:00:00");
            const dayNum = label.getDate();
            const showLabel = dayNum === 1 || dayNum === 15;
            return (
              <div
                key={d.date}
                className="group relative flex flex-1 flex-col items-center justify-end h-full"
              >
                <div
                  className="w-full rounded-t bg-blue-500/50 transition-all hover:bg-blue-500/70"
                  style={{ height: `${pct}%` }}
                />
                {showLabel && (
                  <span className="absolute -bottom-5 text-[8px] text-neutral-600">
                    {label.toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </span>
                )}
                <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block rounded bg-neutral-700 px-2 py-0.5 text-[10px] text-white whitespace-nowrap">
                  {d.views} views
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ViewsBySlideChart({ data }: { data: SlideData[] }) {
  const max = Math.max(...data.map((s) => s.views), 1);

  return (
    <section>
      <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-400">
        Views by slide
      </h2>
      <div className="space-y-2">
        {data.map((s) => {
          const pct = Math.max((s.views / max) * 100, 4);
          return (
            <div key={s.slideIndex} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-right text-sm text-neutral-500">
                Slide {s.slideIndex + 1}
              </span>
              <div className="flex-1 h-6 rounded bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded bg-blue-500/40 flex items-center px-2 transition-all"
                  style={{ width: `${pct}%` }}
                >
                  <span className="text-[10px] text-white/80">{s.views}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
