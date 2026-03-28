"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const THEME_COLORS: Record<string, string> = {
  "editorial-blue": "bg-[#1a1aff]",
  monochrome: "bg-[#0a0a0a]",
  "dark-editorial": "bg-[#0f0f0f]",
  "warm-magazine": "bg-[#c44b1b]",
  "swiss-minimal": "bg-[#ff0000]",
};

interface Props {
  presentation: {
    id: string;
    title: string;
    slug: string;
    theme: string;
    isPublic: boolean;
    thumbnailUrl: string | null;
    updatedAt: string;
  };
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
  onTogglePublic: () => void;
}

export function PresentationCard({
  presentation,
  onDuplicate,
  onRename,
  onDelete,
  onTogglePublic,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const bg = THEME_COLORS[presentation.theme] ?? "bg-neutral-800";

  return (
    <div className="group relative flex flex-col border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/editor/${presentation.id}`} className="block">
        {presentation.thumbnailUrl ? (
          <img
            src={presentation.thumbnailUrl}
            alt={presentation.title}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div
            className={`flex aspect-video items-center justify-center ${bg}`}
          >
            <span className="font-display text-2xl tracking-tight text-white/60">
              {presentation.title}
            </span>
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{presentation.title}</p>
          <p className="text-xs text-neutral-400">
            {formatDistanceToNow(new Date(presentation.updatedAt), {
              addSuffix: true,
              locale: es,
            })}
            {presentation.isPublic && " · Público"}
          </p>
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 z-50 w-44 border border-neutral-200 bg-white py-1 shadow-lg rounded">
              <MenuItem
                label="Renombrar"
                onClick={() => {
                  setMenuOpen(false);
                  onRename();
                }}
              />
              <MenuItem
                label="Duplicar"
                onClick={() => {
                  setMenuOpen(false);
                  onDuplicate();
                }}
              />
              <MenuItem
                label={
                  presentation.isPublic ? "Hacer privado" : "Hacer público"
                }
                onClick={() => {
                  setMenuOpen(false);
                  onTogglePublic();
                }}
              />
              <MenuItem
                label="Eliminar"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                destructive
              />
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
      className={`block w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 ${
        destructive ? "text-red-600" : "text-neutral-700"
      }`}
    >
      {label}
    </button>
  );
}
