"use client";

import { useState, useEffect, useMemo } from "react";
import { nanoid } from "nanoid";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { DialogShell } from "@/components/ui/DialogShell";
import { SlidePreview } from "@/components/SlidePreview";
import { useEditorStore } from "@/store/editorStore";
import { useTranslation } from "@/lib/i18n/context";
import type { SlideElement, GradientDef } from "@/types/elements";

interface RemoteSlide {
  id: string;
  order: number;
  backgroundColor: string;
  backgroundGradient?: GradientDef;
  elements: SlideElement[];
}

interface RemotePresentation {
  id: string;
  title: string;
  slides: RemoteSlide[];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ImportSlideModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const presentationId = useEditorStore((s) => s.presentationId);
  const slides = useEditorStore((s) => s.slides);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const [data, setData] = useState<RemotePresentation[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setSearch("");
    fetch(`/api/presentations/${presentationId}/import-slide`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [open, presentationId]);

  const filtered = useMemo(() =>
    search.trim() ? data.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())) : data
  , [data, search]);

  function importSlide(slide: RemoteSlide) {
    const insertAt = activeSlideIndex + 1;
    const newSlide = {
      id: nanoid(),
      presentationId,
      order: insertAt,
      transition: "fade" as const,
      backgroundColor: slide.backgroundColor,
      backgroundImage: null,
      elements: (slide.elements as SlideElement[]).map((el) => ({ ...el, id: nanoid() })),
      mobileElements: null,
      notes: "",
    };

    const store = useEditorStore.getState();
    const updated = [...store.slides];
    updated.splice(insertAt, 0, newSlide);
    useEditorStore.setState({
      slides: updated.map((s, i) => ({ ...s, order: i })),
      activeSlideIndex: insertAt,
      dirty: true,
      saveStatus: "unsaved",
    });
    store.pushHistory();
    onClose();
  }

  return (
    <DialogShell
      open={open}
      ariaLabel={t.editor.importSlide ?? "Import slide"}
      onClose={onClose}
      className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded bg-slate border border-steel p-4 md:p-6 shadow-xl mx-4"
    >
      <h3 className="font-display text-lg tracking-tight text-silver">
        {t.editor.importSlide ?? "IMPORT SLIDE"}
      </h3>
      <p className="mt-1 text-xs text-silver/50">
        {t.editor.importSlideDesc ?? "Select a slide from another presentation to import"}
      </p>

      <div className="relative mt-3">
        <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-silver/50" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search presentations..."
          className="w-full rounded border border-steel bg-white/5 py-2 pl-8 pr-3 text-xs text-silver outline-none placeholder:text-silver/50 focus:border-silver/50"
        />
      </div>

      {loading ? (
        <p className="py-8 text-center text-xs text-silver/50">{t.common.loading}</p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-xs text-silver/50">
          {search ? "No presentations match your search" : (t.editor.noOtherPresentations ?? "No other presentations found")}
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          {filtered.map((pres) => (
            <div key={pres.id}>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-silver/70">
                {pres.title}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {pres.slides.map((slide) => (
                  <button
                    key={slide.id}
                    onClick={() => importSlide(slide)}
                    className="group relative overflow-hidden rounded border border-steel hover:border-silver/50 transition-colors"
                  >
                    <SlidePreview
                      slide={{ backgroundColor: slide.backgroundColor, backgroundGradient: slide.backgroundGradient, backgroundImage: null, elements: slide.elements as SlideElement[] }}
                      className="w-full"
                    />
                    <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-1 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {slide.order + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-4 w-full rounded px-4 py-2 text-xs text-silver/70 hover:bg-white/5 transition-colors"
      >
        {t.common.cancel}
      </button>
    </DialogShell>
  );
}
