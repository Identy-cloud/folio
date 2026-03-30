import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useEditorStore } from "@/store/editorStore";
import { captureSlideThumb, uploadThumbnail } from "@/lib/thumbnail";
import { useTranslation } from "@/lib/i18n/context";

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const VERSION_INTERVAL_MS = 10 * 60 * 1000;

async function saveWithRetry(presentationId: string, slides: unknown[]) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(
        `/api/presentations/${presentationId}/slides`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slides),
        }
      );
      if (res.ok) return true;
    } catch {
      /* retry */
    }
    if (attempt < MAX_RETRIES - 1) {
      await new Promise((r) => setTimeout(r, BASE_DELAY * 2 ** attempt));
    }
  }
  return false;
}

let thumbTimer: ReturnType<typeof setTimeout> | null = null;

async function captureThumbnail(presentationId: string) {
  try {
    const slideEl = document.querySelector("[data-slide-canvas]") as HTMLElement;
    if (!slideEl) return;
    const blob = await captureSlideThumb(slideEl);
    await uploadThumbnail(presentationId, blob);
  } catch {
    /* thumbnail capture is best-effort */
  }
}

export function createVersionSnapshot(presentationId: string, title?: string) {
  return fetch(`/api/presentations/${presentationId}/versions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title ?? null }),
  }).catch(() => null);
}

export function useAutoSave() {
  const { t } = useTranslation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const versionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastVersionRef = useRef<number>(Date.now());

  useEffect(() => {
    const unsub = useEditorStore.subscribe((state, prev) => {
      if (!state.dirty) return;
      if (state.slides === prev.slides) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        const { presentationId, slides, setSaveStatus, markClean } =
          useEditorStore.getState();

        setSaveStatus("saving");
        const ok = await saveWithRetry(presentationId, slides);

        if (ok) {
          setSaveStatus("saved");
          markClean();

          if (thumbTimer) clearTimeout(thumbTimer);
          thumbTimer = setTimeout(() => captureThumbnail(presentationId), 5000);

          const elapsed = Date.now() - lastVersionRef.current;
          if (elapsed >= VERSION_INTERVAL_MS) {
            lastVersionRef.current = Date.now();
            createVersionSnapshot(presentationId, "Auto-save");
          }
        } else {
          setSaveStatus("error");
          toast.error(t.editor.saveToastError);
        }
      }, 3000);
    });

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (versionTimerRef.current) clearTimeout(versionTimerRef.current);
    };
  }, [t]);
}
