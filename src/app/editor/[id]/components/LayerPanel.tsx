"use client";

import { useEditorStore } from "@/store/editorStore";
import { Stack, Eye, EyeSlash, LockSimple, LockSimpleOpen, TextT, Image as ImageIcon, Rectangle, ArrowRight, Minus } from "@phosphor-icons/react";

const TYPE_ICONS: Record<string, typeof TextT> = {
  text: TextT,
  image: ImageIcon,
  shape: Rectangle,
  arrow: ArrowRight,
  divider: Minus,
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

  const elements = editingMode === "mobile" && slide?.mobileElements
    ? slide.mobileElements
    : slide?.elements ?? [];

  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

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
      <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Stack size={14} className="text-neutral-400" />
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Layers</span>
        </div>
        <button onClick={onClose} className="text-xs text-neutral-500 hover:text-neutral-300">Close</button>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {sorted.length === 0 && (
          <p className="py-4 text-center text-xs text-neutral-600">No elements</p>
        )}
        {sorted.map((el) => {
          const Icon = TYPE_ICONS[el.type] ?? Rectangle;
          const isSelected = selectedIds.includes(el.id);
          return (
            <div
              key={el.id}
              onClick={() => selectElement(el.id)}
              className={`flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer transition-colors ${
                isSelected ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              <Icon size={12} className="shrink-0" />
              <span className="flex-1 text-[11px] truncate">{getLabel(el)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateElement(el.id, { locked: !el.locked });
                  pushHistory();
                }}
                className="p-0.5 text-neutral-600 hover:text-neutral-300"
              >
                {el.locked ? <LockSimple size={10} /> : <LockSimpleOpen size={10} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateElement(el.id, { opacity: el.opacity > 0 ? 0 : 1 });
                  pushHistory();
                }}
                className="p-0.5 text-neutral-600 hover:text-neutral-300"
              >
                {el.opacity > 0 ? <Eye size={10} /> : <EyeSlash size={10} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
