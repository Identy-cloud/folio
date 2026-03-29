"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { DotsThreeVertical, Star } from "@phosphor-icons/react";
import { SlidePreview } from "@/components/SlidePreview";
import type { SlideElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Props {
  presentation: {
    id: string;
    title: string;
    slug: string;
    theme: string;
    isPublic: boolean;
    thumbnailUrl: string | null;
    updatedAt: string;
    coverSlide?: {
      backgroundColor: string;
      backgroundImage: string | null;
      elements: SlideElement[];
    } | null;
  };
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
  onTogglePublic: () => void;
  onChangeTheme: () => void;
  onAnalytics: () => void;
  isStarred?: boolean;
  onToggleStar?: () => void;
}

export function PresentationCard({
  presentation,
  onDuplicate,
  onRename,
  onDelete,
  onTogglePublic,
  onChangeTheme,
  onAnalytics,
  isStarred,
  onToggleStar,
}: Props) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <div className="group relative flex flex-col border border-neutral-800 bg-[#1e1e1e] transition-shadow hover:shadow-lg">
      <Link href={`/editor/${presentation.id}`} className="block">
        {presentation.coverSlide ? (
          <SlidePreview
            slide={presentation.coverSlide}
            className="w-full"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-neutral-800">
            <span className="font-display text-2xl tracking-tight text-neutral-200/60">
              {presentation.title}
            </span>
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-200">{presentation.title}</p>
          <p className="text-xs text-neutral-500">
            {formatDistanceToNow(new Date(presentation.updatedAt), {
              addSuffix: true,
              locale: es,
            })}
            {presentation.isPublic && ` · ${t.dashboard.public}`}
          </p>
        </div>

        {onToggleStar && (
          <button
            onClick={onToggleStar}
            className="ml-1 rounded p-1.5 text-neutral-600 hover:text-amber-400 transition-colors"
            aria-label={isStarred ? "Unstar" : "Star"}
          >
            <Star size={16} weight={isStarred ? "fill" : "regular"} className={isStarred ? "text-amber-400" : ""} />
          </button>
        )}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 rounded p-2 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
            aria-label={t.dashboard.options}
            aria-expanded={menuOpen}
          >
            <DotsThreeVertical size={18} weight="duotone" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 z-50 w-44 border border-neutral-700 bg-[#242424] py-1 shadow-lg rounded" role="menu">
              <MenuItem label={t.dashboard.rename} onClick={() => { setMenuOpen(false); onRename(); }} />
              <MenuItem label={t.dashboard.duplicate} onClick={() => { setMenuOpen(false); onDuplicate(); }} />
              <MenuItem label={t.dashboard.changeTheme} onClick={() => { setMenuOpen(false); onChangeTheme(); }} />
              <MenuItem label="Analytics" onClick={() => { setMenuOpen(false); onAnalytics(); }} />
              <MenuItem
                label={presentation.isPublic ? t.dashboard.makePrivate : t.dashboard.makePublic}
                onClick={() => { setMenuOpen(false); onTogglePublic(); }}
              />
              <MenuItem label={t.common.delete} onClick={() => { setMenuOpen(false); onDelete(); }} destructive />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  label,
  onClick,
  destructive,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-4 py-2 text-left text-sm hover:bg-neutral-800 ${
        destructive ? "text-red-500" : "text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
