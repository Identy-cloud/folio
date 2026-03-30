"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { DotsThreeVertical, Star, Clock } from "@phosphor-icons/react";
import { SlidePreview } from "@/components/SlidePreview";
import type { SlideElement, GradientDef } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";
import { useClickOutside } from "@/hooks/useClickOutside";
import { SelectionCheckbox } from "./selection-checkbox";

interface Props {
  presentation: {
    id: string;
    title: string;
    slug: string;
    theme: string;
    isPublic: boolean;
    thumbnailUrl: string | null;
    updatedAt: string;
    publishAt?: string | null;
    coverSlide?: {
      backgroundColor: string;
      backgroundGradient?: GradientDef;
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
  onExportJson: () => void;
  onMove?: () => void;
  isStarred?: boolean;
  onToggleStar?: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onLongPress?: () => void;
}

export function PresentationCard({
  presentation,
  onDuplicate,
  onRename,
  onDelete,
  onTogglePublic,
  onChangeTheme,
  onAnalytics,
  onExportJson,
  onMove,
  isStarred,
  onToggleStar,
  selectionMode,
  isSelected,
  onToggleSelect,
  onLongPress,
}: Props) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const handleTouchStart = useCallback(() => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress?.();
    }, 500);
  }, [onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (selectionMode && onToggleSelect) {
      e.preventDefault();
      onToggleSelect();
    }
  }, [selectionMode, onToggleSelect]);

  return (
    <div
      className={`group relative flex flex-col border bg-[#1e1e1e] transition-shadow hover:shadow-lg ${
        isSelected ? "border-white" : "border-neutral-800"
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {onToggleSelect && (
        <div className="absolute left-2 top-2 z-10">
          <SelectionCheckbox
            checked={isSelected ?? false}
            visible={selectionMode ?? false}
            onChange={onToggleSelect}
            ariaLabel={`Select ${presentation.title}`}
          />
        </div>
      )}
      <Link
        href={`/editor/${presentation.id}`}
        className="block"
        onClick={handleCardClick}
      >
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

      {presentation.publishAt && !presentation.isPublic && (
        <div className="flex items-center gap-1 px-4 pt-2">
          <Clock size={12} className="text-amber-400" />
          <span className="text-[10px] text-amber-400">
            {t.editor.scheduledFor}{" "}
            {new Date(presentation.publishAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}{" "}
            {new Date(presentation.publishAt).toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-200">{presentation.title}</p>
          <p className="text-xs text-neutral-500">
            {formatDistanceToNow(new Date(presentation.updatedAt), {
              addSuffix: true,
              locale: es,
            })}
            {presentation.isPublic && ` · ${t.dashboard.public}`}
            {` · ${presentation.theme.replace(/-/g, " ")}`}
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
            <DotsThreeVertical size={18} weight="regular" />
          </button>

          {menuOpen && (
            <MenuContainer onClose={() => setMenuOpen(false)}>
              <MenuItem label={t.dashboard.rename} onClick={() => { setMenuOpen(false); onRename(); }} />
              <MenuItem label={t.dashboard.duplicate} onClick={() => { setMenuOpen(false); onDuplicate(); }} />
              <MenuItem label={t.dashboard.changeTheme} onClick={() => { setMenuOpen(false); onChangeTheme(); }} />
              <MenuItem label="View analytics" onClick={() => { setMenuOpen(false); onAnalytics(); }} />
              <MenuItem label="Export JSON" onClick={() => { setMenuOpen(false); onExportJson(); }} />
              {onMove && <MenuItem label="Move to folder" onClick={() => { setMenuOpen(false); onMove(); }} />}
              <MenuItem
                label={presentation.isPublic ? t.dashboard.makePrivate : t.dashboard.makePublic}
                onClick={() => { setMenuOpen(false); onTogglePublic(); }}
              />
              <MenuItem label={t.common.delete} onClick={() => { setMenuOpen(false); onDelete(); }} destructive />
            </MenuContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuContainer({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[role='menuitem']");
    if (items.length > 0) items[0].focus();
    function handleKey(e: KeyboardEvent) {
      const focusable = el!.querySelectorAll<HTMLElement>("[role='menuitem']");
      const arr = Array.from(focusable);
      const idx = arr.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown") { e.preventDefault(); arr[(idx + 1) % arr.length]?.focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); arr[(idx - 1 + arr.length) % arr.length]?.focus(); }
      else if (e.key === "Escape") onClose();
    }
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 bottom-full mb-1 z-50 w-44 border border-neutral-700 bg-[#242424] py-1 shadow-lg rounded" role="menu">
      {children}
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
      role="menuitem"
      onClick={onClick}
      className={`block w-full px-4 py-2 text-left text-sm hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none ${
        destructive ? "text-red-500" : "text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
