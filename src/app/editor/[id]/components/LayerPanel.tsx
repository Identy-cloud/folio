"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { Stack, Eye, EyeSlash, LockSimple, LockSimpleOpen, TextT, Image as ImageIcon, Rectangle, ArrowRight, Minus, MagnifyingGlass, LineSegment, VideoCamera, Smiley } from "@phosphor-icons/react";

const TYPE_ICONS: Record<string, typeof TextT> = {
  text: TextT,
  image: ImageIcon,
  shape: Rectangle,
  arrow: ArrowRight,
  divider: Minus,
  line: LineSegment,
  video: VideoCamera,
  icon: Smiley,
};

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

export function LayerPanel({ onClose }: { onClose: () => void }) {
  const slide = useEditorStore((s) => s.getActiveSlide());
  const selectedIds = useEditorStore((s) => s.selectedElementIds);
  const selectElement = useEditorStore((s) => s.selectElement);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const editingMode = useEditorStore((s) => s.editingMode);
  const [search, setSearch] = useState("");

  const elements = editingMode === "mobile" && slide?.mobileElements
    ? slide.mobileElements
    : slide?.elements ?? [];

  const sorted = [...elements]
    .sort((a, b) => b.zIndex - a.zIndex)
    .filter((el) => {
      if (!search) return true;
      const label = getLabel(el).toLowerCase();
      return label.includes(search.toLowerCase()) || el.type.includes(search.toLowerCase());
    });

  function getLabel(el: typeof elements[0]) {
    if (el.type === "text") {
      const raw = (el as { content: string }).content.replace(/<[^>]*>/g, "");
      return truncate(raw || "Text", 18);
    }
    if (el.type === "shape") return (el as { shape: string }).shape;
    return el.type;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-steel/30 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Stack size={14} className="text-silver/70" />
          <span className="text-xs font-medium text-silver/70 uppercase tracking-wider">Layers</span>
        </div>
        <button onClick={onClose} className="text-xs text-silver/50 hover:text-silver">Close</button>
      </div>
      {elements.length > 3 && (
        <div className="relative px-2 pt-2">
          <MagnifyingGlass size={12} className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-silver/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search layers..."
            className="w-full rounded border border-steel/30 bg-navy py-1.5 pl-7 pr-2 text-[10px] text-silver/70 outline-none placeholder:text-silver/30 focus:border-silver/40"
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-1">
        {sorted.length === 0 && (
          <p className="py-4 text-center text-xs text-silver/40">No elements</p>
        )}
        {sorted.map((el) => {
          const Icon = TYPE_ICONS[el.type] ?? Rectangle;
          const isSelected = selectedIds.includes(el.id);
          const isVisible = el.visible !== false;
          return (
            <div
              key={el.id}
              role="button"
              tabIndex={0}
              onClick={() => selectElement(el.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectElement(el.id); } }}
              className={`flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors ${
                isSelected ? "bg-white/10 text-white" : "text-silver/70 hover:bg-white/5"
              } ${!isVisible ? "opacity-50" : ""}`}
            >
              <Icon size={12} className="shrink-0" />
              <span className="flex-1 text-[11px] truncate text-left">{getLabel(el)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateElement(el.id, { locked: !el.locked });
                  pushHistory();
                }}
                aria-label={el.locked ? "Desbloquear capa" : "Bloquear capa"}
                className="p-0.5 text-silver/40 hover:text-silver"
              >
                {el.locked ? <LockSimple size={10} /> : <LockSimpleOpen size={10} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateElement(el.id, { visible: !isVisible });
                  pushHistory();
                }}
                aria-label={isVisible ? "Ocultar capa" : "Mostrar capa"}
                className="p-0.5 text-silver/40 hover:text-silver"
              >
                {isVisible ? <Eye size={10} /> : <EyeSlash size={10} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
