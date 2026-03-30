"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
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
  const [data, setData] = useState<RemotePresentation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/presentations/${presentationId}/import-slide`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [open, presentationId]);

  function importSlide(slide: RemoteSlide) {
    const newSlide = {
      id: nanoid(),
      presentationId,
      order: slides.length,
      transition: "fade" as const,
      backgroundColor: slide.backgroundColor,
      backgroundImage: null,
      elements: (slide.elements as SlideElement[]).map((el) => ({
        ...el,
        id: nanoid(),
      })),
      mobileElements: null,
      notes: "",
    };

    const store = useEditorStore.getState();
    const updated = [...store.slides, newSlide];
    useEditorStore.setState({
      slides: updated,
      activeSlideIndex: updated.length - 1,
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
      className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded bg-[#1e1e1e] border border-neutral-700 p-6 shadow-xl mx-4"
    >
      <h3 className="font-display text-lg tracking-tight text-neutral-200">
        {t.editor.importSlide ?? "IMPORT SLIDE"}
      </h3>
      <p className="mt-1 text-xs text-neutral-500">
        {t.editor.importSlideDesc ?? "Select a slide from another presentation to import"}
      </p>

      {loading ? (
        <p className="py-8 text-center text-xs text-neutral-500">{t.common.loading}</p>
      ) : data.length === 0 ? (
        <p className="py-8 text-center text-xs text-neutral-500">
          {t.editor.noOtherPresentations ?? "No other presentations found"}
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          {data.map((pres) => (
            <div key={pres.id}>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                {pres.title}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {pres.slides.map((slide) => (
                  <button
                    key={slide.id}
                    onClick={() => importSlide(slide)}
                    className="group relative overflow-hidden rounded border border-neutral-700 hover:border-neutral-500 transition-colors"
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
        className="mt-4 w-full rounded px-4 py-2 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
      >
        {t.common.cancel}
      </button>
    </DialogShell>
  );
}
