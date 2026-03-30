"use client";

import { useEditorStore } from "@/store/editorStore";
import { SLIDE_LAYOUTS } from "@/lib/slide-layouts";
import { THEMES } from "@/lib/templates/themes";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PREVIEW_RECTS: Record<string, { x: number; y: number; w: number; h: number; fill: string }[]> = {
  title: [
    { x: 8, y: 30, w: 84, h: 16, fill: "currentColor" },
    { x: 24, y: 52, w: 52, h: 6, fill: "rgba(128,128,128,0.5)" },
  ],
  "title-content": [
    { x: 6, y: 6, w: 60, h: 10, fill: "currentColor" },
    { x: 6, y: 18, w: 12, h: 2, fill: "var(--accent)" },
    { x: 6, y: 24, w: 88, h: 60, fill: "rgba(128,128,128,0.2)" },
  ],
  "two-columns": [
    { x: 6, y: 6, w: 60, h: 10, fill: "currentColor" },
    { x: 6, y: 18, w: 12, h: 2, fill: "var(--accent)" },
    { x: 6, y: 24, w: 40, h: 60, fill: "rgba(128,128,128,0.2)" },
    { x: 53, y: 24, w: 40, h: 60, fill: "rgba(128,128,128,0.2)" },
  ],
  "image-text": [
    { x: 0, y: 0, w: 48, h: 100, fill: "rgba(128,128,128,0.3)" },
    { x: 54, y: 20, w: 40, h: 8, fill: "currentColor" },
    { x: 54, y: 32, w: 6, h: 2, fill: "var(--accent)" },
    { x: 54, y: 38, w: 40, h: 40, fill: "rgba(128,128,128,0.2)" },
  ],
  "full-image": [
    { x: 0, y: 0, w: 100, h: 100, fill: "rgba(128,128,128,0.3)" },
    { x: 10, y: 36, w: 80, h: 14, fill: "rgba(255,255,255,0.9)" },
    { x: 25, y: 56, w: 50, h: 5, fill: "rgba(255,255,255,0.5)" },
  ],
  quote: [
    { x: 10, y: 28, w: 80, h: 30, fill: "rgba(128,128,128,0.2)" },
    { x: 44, y: 62, w: 12, h: 2, fill: "var(--accent)" },
    { x: 30, y: 68, w: 40, h: 5, fill: "rgba(128,128,128,0.3)" },
  ],
  "section-header": [
    { x: 10, y: 38, w: 80, h: 14, fill: "currentColor" },
    { x: 40, y: 56, w: 20, h: 2, fill: "var(--accent)" },
  ],
  blank: [],
};

export function LayoutPicker({ open, onClose }: Props) {
  const themeKey = useEditorStore((s) => s.theme);
  const theme = THEMES[themeKey] ?? THEMES["editorial-blue"];
  const activeSlide = useEditorStore((s) => s.getActiveSlide());

  if (!open) return null;

  function applyLayout(layoutId: string) {
    const layout = SLIDE_LAYOUTS.find((l) => l.id === layoutId);
    if (!layout) return;
    const slide = useEditorStore.getState().getActiveSlide();
    if (!slide) return;
    const hasContent = slide.elements.length > 0;
    if (hasContent && !confirm("Replace current slide content with this layout?")) return;

    const state = useEditorStore.getState();
    const th = THEMES[state.theme] ?? THEMES["editorial-blue"];
    const elements = layout.generate(th, 1);
    const { slides, activeSlideIndex } = state;
    const updated = slides.map((s, i) =>
      i === activeSlideIndex ? { ...s, elements } : s
    );
    useEditorStore.setState({
      slides: updated,
      selectedElementIds: [],
      dirty: true,
      saveStatus: "unsaved" as const,
    });
    state.pushHistory();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] md:pt-[15vh]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded border border-neutral-700 bg-[#1e1e1e] p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-sm font-medium text-white">Slide Layouts</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {SLIDE_LAYOUTS.map((layout) => {
            const rects = PREVIEW_RECTS[layout.id] ?? [];
            return (
              <button
                key={layout.id}
                onClick={() => applyLayout(layout.id)}
                className="group flex flex-col items-center gap-1.5 rounded p-2 transition-colors hover:bg-neutral-800"
              >
                <svg
                  viewBox="0 0 100 62.5"
                  className="w-full rounded border border-neutral-700 bg-neutral-900 group-hover:border-neutral-500"
                  style={{ "--accent": theme.accent } as React.CSSProperties}
                >
                  {rects.map((r, i) => (
                    <rect
                      key={i}
                      x={r.x}
                      y={r.y * 0.625}
                      width={r.w}
                      height={r.h * 0.625}
                      fill={r.fill}
                      rx={1}
                    />
                  ))}
                </svg>
                <span className="text-[10px] text-neutral-400 group-hover:text-neutral-200">
                  {layout.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
