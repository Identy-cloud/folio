"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { SlidePreview } from "@/components/SlidePreview";
import type { SlideElement } from "@/types/elements";

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
}

export function PresentationCard({
  presentation,
  onDuplicate,
  onRename,
  onDelete,
  onTogglePublic,
  onChangeTheme,
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
            {presentation.isPublic && " · Público"}
          </p>
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 rounded p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
          >
            <DotsThreeVertical size={18} weight="duotone" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 z-50 w-44 border border-neutral-700 bg-[#242424] py-1 shadow-lg rounded">
              <MenuItem label="Renombrar" onClick={() => { setMenuOpen(false); onRename(); }} />
              <MenuItem label="Duplicar" onClick={() => { setMenuOpen(false); onDuplicate(); }} />
              <MenuItem label="Cambiar tema" onClick={() => { setMenuOpen(false); onChangeTheme(); }} />
              <MenuItem
                label={presentation.isPublic ? "Hacer privado" : "Hacer público"}
                onClick={() => { setMenuOpen(false); onTogglePublic(); }}
              />
              <MenuItem label="Eliminar" onClick={() => { setMenuOpen(false); onDelete(); }} destructive />
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
