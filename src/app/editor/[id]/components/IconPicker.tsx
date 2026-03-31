"use client";

import { useState, useMemo } from "react";
import { nanoid } from "nanoid";
import { X } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { CURATED_ICONS, ICON_CATEGORIES } from "@/lib/icon-map";
import { THEMES } from "@/lib/templates/themes";
import { iconDefaults } from "@/lib/templates/element-defaults";
import type { IconElement } from "@/types/elements";

interface Props {
  onClose: () => void;
}

export function IconPicker({ onClose }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const theme = useEditorStore((s) => s.customThemes[s.theme] ?? THEMES[s.theme] ?? THEMES["editorial-blue"]);
  const zBase = (activeSlide?.elements.length ?? 0) + 1;

  const filtered = useMemo(() => {
    let icons = CURATED_ICONS;
    if (activeCategory !== "All") {
      icons = icons.filter((i) => i.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      icons = icons.filter((i) => i.label.toLowerCase().includes(q) || i.name.toLowerCase().includes(q));
    }
    return icons;
  }, [search, activeCategory]);

  function insertIcon(iconName: string) {
    const el: IconElement = {
      id: nanoid(),
      type: "icon",
      x: 200,
      y: 200,
      w: 120,
      h: 120,
      rotation: 0,
      opacity: 1,
      zIndex: zBase,
      locked: false,
      iconName,
      ...iconDefaults(theme),
    };
    addElement(el);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded border border-steel bg-slate shadow-2xl md:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-steel px-4 py-2">
          <span className="text-xs font-medium text-silver uppercase tracking-wider">Icons</span>
          <button onClick={onClose} aria-label="Close" className="text-silver/50 hover:text-silver">
            <X size={16} />
          </button>
        </div>
        <div className="px-4 pt-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            autoFocus
            className="w-full rounded border border-steel bg-navy px-3 py-2 text-xs text-silver outline-none placeholder:text-silver/40 focus:border-silver/50"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto px-4 pt-2 pb-1 scrollbar-none">
          {["All", ...ICON_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded px-2 py-1 text-[10px] transition-colors ${
                activeCategory === cat ? "bg-accent text-white" : "text-silver/50 hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid max-h-64 grid-cols-4 gap-1 overflow-y-auto p-3 sm:grid-cols-5 md:grid-cols-6">
          {filtered.map((icon) => {
            const Icon = icon.component;
            return (
              <button
                key={icon.name}
                onClick={() => insertIcon(icon.name)}
                title={icon.label}
                className="flex aspect-square items-center justify-center rounded text-silver/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Icon size={24} weight="duotone" />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full py-6 text-center text-xs text-silver/40">No icons found</p>
          )}
        </div>
      </div>
    </div>
  );
}
