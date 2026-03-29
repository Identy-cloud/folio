import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";

export function useKeyboard() {
  useEffect(() => {
    function isInputFocused(e: KeyboardEvent): boolean {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if ((e.target as HTMLElement).isContentEditable) return true;
      return false;
    }

    function handler(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      const state = useEditorStore.getState();
      const inInput = isInputFocused(e);

      if (e.key === "z" && meta && !e.shiftKey) {
        if (inInput) return;
        e.preventDefault();
        state.undo();
        return;
      }
      if ((e.key === "y" && meta) || (e.key === "z" && meta && e.shiftKey)) {
        if (inInput) return;
        e.preventDefault();
        state.redo();
        return;
      }
      if (e.key === "c" && meta && e.altKey) {
        if (inInput) return;
        e.preventDefault();
        state.copyStyle();
        return;
      }
      if (e.key === "v" && meta && e.altKey) {
        if (inInput) return;
        e.preventDefault();
        state.pasteStyle();
        return;
      }
      if (e.key === "c" && meta) {
        if (inInput) return;
        e.preventDefault();
        state.copySelection();
        return;
      }
      if (e.key === "v" && meta) {
        if (inInput) return;
        e.preventDefault();
        state.pasteClipboard();
        return;
      }
      if (e.key === "d" && meta) {
        if (inInput) return;
        e.preventDefault();
        if (state.selectedElementIds.length > 0) {
          state.selectedElementIds.forEach((id) => state.duplicateElement(id));
        } else {
          const slide = state.getActiveSlide();
          if (slide) state.duplicateSlide(slide.id);
        }
        return;
      }
      if (e.key === "g" && meta && !e.shiftKey) {
        if (inInput) return;
        e.preventDefault();
        state.groupSelection();
        return;
      }
      if (e.key === "g" && meta && e.shiftKey) {
        if (inInput) return;
        e.preventDefault();
        state.ungroupSelection();
        return;
      }
      if (e.key === "a" && meta) {
        if (inInput) return;
        e.preventDefault();
        const slide = state.getActiveSlide();
        if (!slide) return;
        const els = state.editingMode === "mobile" && slide.mobileElements ? slide.mobileElements : slide.elements;
        useEditorStore.setState({ selectedElementIds: els.map((e) => e.id) });
        return;
      }
      if (e.key === "Escape") {
        state.clearSelection();
        state.setActiveTool("select");
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (inInput) return;
        const busy = state.busyElementIds;
        const deletable = state.selectedElementIds.filter((id) => !busy.has(id));
        if (deletable.length === 0) return;
        e.preventDefault();
        deletable.forEach((id) => state.deleteElement(id));
        return;
      }

      // Ctrl+Arrow Up/Down = reorder slides
      if (meta && (e.key === "ArrowUp" || e.key === "ArrowDown") && state.selectedElementIds.length === 0) {
        if (inInput) return;
        e.preventDefault();
        const idx = state.activeSlideIndex;
        const newIdx = e.key === "ArrowUp" ? idx - 1 : idx + 1;
        if (newIdx >= 0 && newIdx < state.slides.length) {
          state.reorderSlides(idx, newIdx);
          state.setActiveSlide(newIdx);
        }
        return;
      }

      // Number keys 1-9 = opacity 10%-90%, 0 = 100%
      if (!meta && !e.altKey && e.key >= "0" && e.key <= "9" && state.selectedElementIds.length > 0) {
        if (inInput) return;
        e.preventDefault();
        const opacity = e.key === "0" ? 1 : parseInt(e.key) / 10;
        state.selectedElementIds.forEach((id) => state.updateElement(id, { opacity }));
        state.pushHistory();
        return;
      }

      const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (ARROW_KEYS.includes(e.key) && state.selectedElementIds.length > 0) {
        if (inInput) return;
        const movable = state.selectedElementIds.filter((id) => !state.busyElementIds.has(id));
        if (movable.length === 0) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const slide = state.getActiveSlide();
        if (!slide) return;
        const els = state.editingMode === "mobile" && slide.mobileElements ? slide.mobileElements : slide.elements;

        if (e.altKey) {
          // Alt+Arrow = resize
          movable.forEach((id) => {
            const el = els.find((el) => el.id === id);
            if (!el) return;
            const updates: Record<string, number> = {};
            if (e.key === "ArrowRight") updates.w = el.w + step;
            if (e.key === "ArrowLeft") updates.w = Math.max(10, el.w - step);
            if (e.key === "ArrowDown") updates.h = el.h + step;
            if (e.key === "ArrowUp") updates.h = Math.max(10, el.h - step);
            state.updateElement(id, updates);
          });
        } else {
          // Arrow / Shift+Arrow = move
          movable.forEach((id) => {
            const el = els.find((el) => el.id === id);
            if (!el) return;
            const updates: Record<string, number> = {};
            if (e.key === "ArrowUp") updates.y = el.y - step;
            if (e.key === "ArrowDown") updates.y = el.y + step;
            if (e.key === "ArrowLeft") updates.x = el.x - step;
            if (e.key === "ArrowRight") updates.x = el.x + step;
            state.updateElement(id, updates);
          });
        }
        state.pushHistory();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
