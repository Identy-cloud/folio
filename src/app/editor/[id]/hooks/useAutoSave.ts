import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";

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

        try {
          const res = await fetch(
            `/api/presentations/${presentationId}/slides`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(slides),
            }
          );

          if (res.ok) {
            setSaveStatus("saved");
            markClean();
          } else {
            setSaveStatus("error");
          }
        } catch {
          setSaveStatus("error");
        }
      }, 3000);
    });

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
