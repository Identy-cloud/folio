import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useEditorStore } from "@/store/editorStore";
import { captureSlideThumb, uploadThumbnail } from "@/lib/thumbnail";

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

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

export function useAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        } else {
          setSaveStatus("error");
          toast.error("Error al guardar. Revisa tu conexión.");
        }
      }, 3000);
    });

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
