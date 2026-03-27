import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";

export function useKeyboard() {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      const state = useEditorStore.getState();

      if (e.key === "z" && meta && !e.shiftKey) {
        e.preventDefault();
        state.undo();
        return;
      }
      if ((e.key === "y" && meta) || (e.key === "z" && meta && e.shiftKey)) {
        e.preventDefault();
        state.redo();
        return;
      }
      if (e.key === "c" && meta) {
        e.preventDefault();
        state.copySelection();
        return;
      }
      if (e.key === "v" && meta) {
        e.preventDefault();
        state.pasteClipboard();
        return;
      }
      if (e.key === "d" && meta) {
        e.preventDefault();
        state.selectedElementIds.forEach((id) => state.duplicateElement(id));
        return;
      }
      if (e.key === "Escape") {
        state.clearSelection();
        state.setActiveTool("select");
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if ((e.target as HTMLElement).isContentEditable) return;
        e.preventDefault();
        [...state.selectedElementIds].forEach((id) => state.deleteElement(id));
        return;
      }

      const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (ARROW_KEYS.includes(e.key) && state.selectedElementIds.length > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const slide = state.getActiveSlide();
        if (!slide) return;
        state.selectedElementIds.forEach((id) => {
          const el = slide.elements.find((el) => el.id === id);
          if (!el) return;
          const updates: Record<string, number> = {};
          if (e.key === "ArrowUp") updates.y = el.y - step;
          if (e.key === "ArrowDown") updates.y = el.y + step;
          if (e.key === "ArrowLeft") updates.x = el.x - step;
          if (e.key === "ArrowRight") updates.x = el.x + step;
          state.updateElement(id, updates);
        });
        state.pushHistory();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
