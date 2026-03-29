import { useEffect } from "react";
import { toast } from "sonner";
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
        const before = state.historyIndex;
        state.undo();
        if (useEditorStore.getState().historyIndex < before) toast("Undo", { duration: 1000 });
        return;
      }
      if ((e.key === "y" && meta) || (e.key === "z" && meta && e.shiftKey)) {
        if (inInput) return;
        e.preventDefault();
        const before = state.historyIndex;
        state.redo();
        if (useEditorStore.getState().historyIndex > before) toast("Redo", { duration: 1000 });
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
      if (e.key === "d" && meta && e.shiftKey) {
        if (inInput) return;
        e.preventDefault();
        const slide = state.getActiveSlide();
        if (slide) state.duplicateSlide(slide.id);
        toast("Slide duplicated", { duration: 1000 });
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
      // Shift+H flip horizontal, Shift+V flip vertical (images only)
      if (e.key === "H" && e.shiftKey && !meta && state.selectedElementIds.length > 0) {
        if (inInput) return;
        e.preventDefault();
        state.selectedElementIds.forEach((id) => {
          const slide = state.getActiveSlide();
          const els = state.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [];
          const el = els.find((e) => e.id === id);
          if (el?.type === "image") state.updateElement(id, { flipX: !(el as { flipX?: boolean }).flipX });
        });
        state.pushHistory();
        return;
      }
      if (e.key === "V" && e.shiftKey && !meta && state.selectedElementIds.length > 0) {
        if (inInput) return;
        e.preventDefault();
        state.selectedElementIds.forEach((id) => {
          const slide = state.getActiveSlide();
          const els = state.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [];
          const el = els.find((e) => e.id === id);
          if (el?.type === "image") state.updateElement(id, { flipY: !(el as { flipY?: boolean }).flipY });
        });
        state.pushHistory();
        return;
      }

      // PageUp/PageDown navigate slides (when no elements selected)
      if ((e.key === "PageUp" || e.key === "PageDown") && state.selectedElementIds.length === 0) {
        if (inInput) return;
        e.preventDefault();
        const idx = state.activeSlideIndex;
        const next = e.key === "PageUp" ? Math.max(0, idx - 1) : Math.min(state.slides.length - 1, idx + 1);
        if (next !== idx) state.setActiveSlide(next);
        return;
      }

      // Ctrl+Shift+M = center element on canvas
      if (e.key === "m" && meta && e.shiftKey) {
        if (inInput) return;
        e.preventDefault();
        const slide = state.getActiveSlide();
        if (!slide) return;
        const isMobile = state.editingMode === "mobile";
        const cw = isMobile ? 430 : 1920;
        const ch = isMobile ? 932 : 1080;
        const els = isMobile && slide.mobileElements ? slide.mobileElements : slide.elements;
        state.selectedElementIds.forEach((id) => {
          const el = els.find((e) => e.id === id);
          if (!el) return;
          state.updateElement(id, { x: (cw - el.w) / 2, y: (ch - el.h) / 2 });
        });
        state.pushHistory();
        return;
      }

      // Ctrl+] bring forward, Ctrl+[ send backward, Ctrl+Shift+] front, Ctrl+Shift+[ back
      if (e.key === "]" && meta) {
        if (inInput) return;
        e.preventDefault();
        state.selectedElementIds.forEach((id) => e.shiftKey ? state.bringToFront(id) : state.bringForward(id));
        return;
      }
      if (e.key === "[" && meta) {
        if (inInput) return;
        e.preventDefault();
        state.selectedElementIds.forEach((id) => e.shiftKey ? state.sendToBack(id) : state.sendBackward(id));
        return;
      }

      // Tab / Shift+Tab = cycle through elements on slide
      if (e.key === "Tab" && !meta && state.selectedElementIds.length > 0) {
        if (inInput) return;
        e.preventDefault();
        const slide = state.getActiveSlide();
        if (!slide) return;
        const els = state.editingMode === "mobile" && slide.mobileElements ? slide.mobileElements : slide.elements;
        if (els.length === 0) return;
        const currentId = state.selectedElementIds[0];
        const idx = els.findIndex((el) => el.id === currentId);
        const nextIdx = e.shiftKey
          ? (idx <= 0 ? els.length - 1 : idx - 1)
          : (idx >= els.length - 1 ? 0 : idx + 1);
        useEditorStore.setState({ selectedElementIds: [els[nextIdx].id] });
        return;
      }

      // Ctrl+Enter = add new slide
      if (e.key === "Enter" && meta) {
        if (inInput) return;
        e.preventDefault();
        state.addSlide();
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

      // Ctrl+0 = reset zoom
      if (e.key === "0" && meta) {
        if (inInput) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("folio:zoom-fit"));
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
