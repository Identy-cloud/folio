"use client";

import { useEditorStore } from "@/store/editorStore";
import { THEMES } from "@/lib/templates/themes";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { X } from "@phosphor-icons/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ThemeCustomizer({ open, onClose }: Props) {
  const slides = useEditorStore((s) => s.slides);
  const theme = useEditorStore((s) => s.theme);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const themeObj = THEMES[theme] ?? THEMES["editorial-blue"];

  if (!open) return null;

  function applyColorToAllSlides(color: string) {
    const updated = slides.map((s) => ({ ...s, backgroundColor: color }));
    useEditorStore.setState({ slides: updated, dirty: true, saveStatus: "unsaved" as const });
    pushHistory();
  }

  function applyAccentToAll(accent: string) {
    const updated = slides.map((slide) => ({
      ...slide,
      elements: slide.elements.map((el) => {
        if (el.type === "text" && el.color === themeObj.accent) return { ...el, color: accent };
        if (el.type === "shape" && el.fill === themeObj.accent) return { ...el, fill: accent };
        return el;
      }),
    }));
    useEditorStore.setState({ slides: updated, dirty: true, saveStatus: "unsaved" as const });
    pushHistory();
  }

  return (
    <div className="fixed top-14 left-60 z-50 w-64 rounded border border-neutral-700 bg-[#1e1e1e] p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Theme Colors</span>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300"><X size={14} /></button>
      </div>
      <p className="text-[10px] text-neutral-600 mb-3">
        Current: {themeObj.label}
      </p>
      <div className="space-y-3">
        <div>
          <span className="text-[10px] text-neutral-500">Background (all slides)</span>
          <ColorPicker value={themeObj.background} onChange={applyColorToAllSlides} />
        </div>
        <div>
          <span className="text-[10px] text-neutral-500">Accent color (all slides)</span>
          <ColorPicker value={themeObj.accent} onChange={applyAccentToAll} />
        </div>
      </div>
      <p className="mt-3 text-[9px] text-neutral-700 leading-relaxed">
        Changes background of all slides and replaces accent-colored elements.
      </p>
    </div>
  );
}
