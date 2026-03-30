"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Star } from "@phosphor-icons/react";
import { SlidePreview } from "@/components/SlidePreview";
import type { SlideElement, GradientDef } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

interface RecentPresentation {
  id: string;
  title: string;
  slug: string;
  theme: string;
  isPublic: boolean;
  thumbnailUrl: string | null;
  updatedAt: string;
  coverSlide?: {
    backgroundColor: string;
    backgroundGradient?: GradientDef;
    backgroundImage: string | null;
    elements: SlideElement[];
  } | null;
}

interface Props {
  presentations: RecentPresentation[];
  starred: Set<string>;
  onToggleStar: (id: string) => void;
}

export function RecentSection({ presentations, starred, onToggleStar }: Props) {
  const { t } = useTranslation();
  const recent = [...presentations]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  if (recent.length === 0) return null;

  return (
    <section className="mb-6 sm:mb-8">
      <h3 className="mb-3 font-display text-sm tracking-widest text-neutral-500 uppercase">
        {t.dashboard.recentSection}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700">
        {recent.map((p) => (
          <div
            key={p.id}
            className="group relative w-56 shrink-0 border border-neutral-800 bg-[#1e1e1e] transition-shadow hover:shadow-lg sm:w-64"
          >
            <Link href={`/editor/${p.id}`} className="block">
              {p.coverSlide ? (
                <SlidePreview slide={p.coverSlide} className="w-full" />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-neutral-800">
                  <span className="font-display text-base tracking-tight text-neutral-200/60 sm:text-lg">
                    {p.title}
                  </span>
                </div>
              )}
            </Link>
            <div className="flex items-center justify-between px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-neutral-200">{p.title}</p>
                <p className="text-[10px] text-neutral-500">
                  {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true })}
                </p>
              </div>
              <button
                onClick={() => onToggleStar(p.id)}
                className={`ml-1 shrink-0 rounded p-1 transition-colors ${
                  starred.has(p.id)
                    ? "text-amber-400"
                    : "text-neutral-600 opacity-0 group-hover:opacity-100 hover:text-amber-400"
                }`}
                aria-label={starred.has(p.id) ? "Unstar" : "Star"}
              >
                <Star size={14} weight={starred.has(p.id) ? "fill" : "regular"} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
