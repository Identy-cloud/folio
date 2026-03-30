"use client";

import Link from "next/link";
import { Eye, GitFork } from "@phosphor-icons/react";

interface PortfolioPresentation {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  forkCount: number;
  viewCount: number;
}

interface Props {
  presentations: PortfolioPresentation[];
}

export function PortfolioClient({ presentations }: Props) {
  if (presentations.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-neutral-600">
        No public presentations yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {presentations.map((p) => (
        <Link
          key={p.id}
          href={`/p/${p.slug}`}
          className="group overflow-hidden border border-neutral-800 bg-[#1a1a1a] transition-colors hover:border-neutral-600"
        >
          <div className="relative aspect-video w-full bg-neutral-900">
            {p.thumbnailUrl ? (
              <img
                src={p.thumbnailUrl}
                alt={p.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-xs tracking-[0.2em] text-neutral-700 uppercase">
                  No preview
                </span>
              </div>
            )}
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="truncate text-sm font-medium text-neutral-200 group-hover:text-white">
              {p.title}
            </h3>
            <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {p.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={14} />
                {p.forkCount}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
