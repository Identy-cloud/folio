import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Slide, SlideElement, SlideTransition } from "@/types/elements";
import { generateMobileElements } from "@/lib/mobile-layout";
import { THEMES, type Theme } from "@/lib/templates/themes";

export type ActiveTool = "select" | "text" | "image" | "shape" | "arrow";
export type SaveStatus = "saved" | "saving" | "error" | "unsaved";
export type EditingMode = "desktop" | "mobile";

interface EditorState {
  presentationId: string;
  theme: string;
  slides: Slide[];
  activeSlideIndex: number;
  selectedElementIds: string[];
  activeTool: ActiveTool;
  editingMode: EditingMode;
  clipboard: SlideElement[];
  saveStatus: SaveStatus;

  history: Slide[][];
  historyIndex: number;

  init: (presentationId: string, slides: Slide[], theme?: string) => void;
  getTheme: () => Theme;
  setActiveSlide: (index: number) => void;
  addSlide: () => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (from: number, to: number) => void;

  addElement: (element: SlideElement) => void;
  updateElement: (elementId: string, updates: Partial<SlideElement>) => void;
  deleteElement: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;
  duplicateSlide: (id: string) => void;
  moveSlideToStart: (id: string) => void;
  moveSlideToEnd: (id: string) => void;

  updateSlideBackground: (color: string) => void;
  updateSlideBackgroundImage: (url: string | null) => void;
  updateSlideTransition: (slideId: string, transition: SlideTransition) => void;

  setEditingMode: (mode: EditingMode) => void;
  generateMobileLayout: () => void;

  bringToFront: (elementId: string) => void;
  sendToBack: (elementId: string) => void;
  bringForward: (elementId: string) => void;
  sendBackward: (elementId: string) => void;

  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setActiveTool: (tool: ActiveTool) => void;

  copySelection: () => void;
  pasteClipboard: () => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  busyElementIds: Set<string>;
  setElementBusy: (id: string) => void;
  clearElementBusy: (id: string) => void;

  setSaveStatus: (s: SaveStatus) => void;
  getActiveSlide: () => Slide | undefined;
  dirty: boolean;
  markClean: () => void;
}

function cloneSlides(slides: Slide[]): Slide[] {
  return JSON.parse(JSON.stringify(slides));
}

let historyTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedPushHistory() {
  if (historyTimer) clearTimeout(historyTimer);
  historyTimer = setTimeout(() => {
    useEditorStore.getState().pushHistory();
  }, 300);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  presentationId: "",
  theme: "editorial-blue",
  slides: [],
  activeSlideIndex: 0,
  selectedElementIds: [],
  activeTool: "select",
  editingMode: "desktop",
  clipboard: [],
  saveStatus: "saved",
  history: [],
  historyIndex: -1,
  dirty: false,
  busyElementIds: new Set<string>(),

  init: (presentationId, slides, theme) => {
    const sorted = [...slides]
      .sort((a, b) => a.order - b.order)
      .map((s) => ({ ...s, transition: s.transition ?? "fade" }));
    set({
      presentationId,
      theme: theme ?? "editorial-blue",
      slides: sorted,
      editingMode: "desktop",
      activeSlideIndex: 0,
      selectedElementIds: [],
      history: [cloneSlides(sorted)],
      historyIndex: 0,
      saveStatus: "saved",
      dirty: false,
    });
  },

  setActiveSlide: (index) =>
    set({ activeSlideIndex: index, selectedElementIds: [] }),

  addSlide: () => {
    const { slides, presentationId } = get();
    const newSlide: Slide = {
      id: nanoid(),
      presentationId,
      order: slides.length,
      transition: "fade",
      backgroundColor: "#ffffff",
      backgroundImage: null,
      elements: [],
      mobileElements: null,
    };
    set({
      slides: [...slides, newSlide],
      activeSlideIndex: slides.length,
      selectedElementIds: [],
      dirty: true,
      saveStatus: "unsaved",
    });
    get().pushHistory();
  },

  deleteSlide: (id) => {
    const { slides, activeSlideIndex } = get();
    if (slides.length <= 1) return;
    const filtered = slides
      .filter((s) => s.id !== id)
      .map((s, i) => ({ ...s, order: i }));
    const newIndex = Math.min(activeSlideIndex, filtered.length - 1);
    set({
      slides: filtered,
      activeSlideIndex: newIndex,
      selectedElementIds: [],
      dirty: true,
      saveStatus: "unsaved",
    });
    get().pushHistory();
  },

  reorderSlides: (from, to) => {
    const slides = [...get().slides];
    const [moved] = slides.splice(from, 1);
    slides.splice(to, 0, moved);
    set({
      slides: slides.map((s, i) => ({ ...s, order: i })),
      activeSlideIndex: to,
      dirty: true,
      saveStatus: "unsaved",
    });
    get().pushHistory();
  },

  duplicateSlide: (id) => {
    const { slides, presentationId } = get();
    const source = slides.find((s) => s.id === id);
    if (!source) return;
    const idx = slides.indexOf(source);
    const dup: Slide = {
      ...JSON.parse(JSON.stringify(source)),
      id: nanoid(),
      presentationId,
      order: idx + 1,
    };
    const updated = [...slides];
    updated.splice(idx + 1, 0, dup);
    set({
      slides: updated.map((s, i) => ({ ...s, order: i })),
      activeSlideIndex: idx + 1,
      dirty: true,
      saveStatus: "unsaved",
    });
    get().pushHistory();
  },

  moveSlideToStart: (id) => {
    const { slides } = get();
    const idx = slides.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    get().reorderSlides(idx, 0);
  },

  moveSlideToEnd: (id) => {
    const { slides } = get();
    const idx = slides.findIndex((s) => s.id === id);
    if (idx < 0 || idx >= slides.length - 1) return;
    get().reorderSlides(idx, slides.length - 1);
  },

  addElement: (element) => {
    const { slides, activeSlideIndex, editingMode } = get();
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const updated = slides.map((s, i) => {
      if (i !== activeSlideIndex) return s;
      const arr = (key === "mobileElements" ? s.mobileElements : s.elements) ?? [];
      return { ...s, [key]: [...arr, element] };
    });
    set({
      slides: updated,
      selectedElementIds: [element.id],
      activeTool: "select",
      dirty: true,
      saveStatus: "unsaved",
    });
    get().pushHistory();
  },

  updateElement: (elementId, updates) => {
    const { slides, activeSlideIndex, editingMode } = get();
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const updated = slides.map((s, i) => {
      if (i !== activeSlideIndex) return s;
      const arr = (key === "mobileElements" ? s.mobileElements : s.elements) ?? [];
      return {
        ...s,
        [key]: arr.map((el) =>
          el.id === elementId ? ({ ...el, ...updates } as SlideElement) : el
        ),
      };
    });
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    debouncedPushHistory();
  },

  deleteElement: (elementId) => {
    const { slides, activeSlideIndex, editingMode } = get();
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const updated = slides.map((s, i) => {
      if (i !== activeSlideIndex) return s;
      const arr = (key === "mobileElements" ? s.mobileElements : s.elements) ?? [];
      return { ...s, [key]: arr.filter((el) => el.id !== elementId) };
    });
    set({
      slides: updated,
      selectedElementIds: get().selectedElementIds.filter(
        (id) => id !== elementId
      ),
      dirty: true,
      saveStatus: "unsaved",
    });
    get().pushHistory();
  },

  duplicateElement: (elementId) => {
    const slide = get().getActiveSlide();
    if (!slide) return;
    const { editingMode } = get();
    const els = editingMode === "mobile" && slide.mobileElements ? slide.mobileElements : slide.elements;
    const el = els.find((e) => e.id === elementId);
    if (!el) return;
    const dup = { ...el, id: nanoid(), x: el.x + 20, y: el.y + 20 };
    get().addElement(dup as SlideElement);
  },

  updateSlideBackground: (color) => {
    const { slides, activeSlideIndex } = get();
    const updated = slides.map((s, i) =>
      i === activeSlideIndex ? { ...s, backgroundColor: color } : s
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  setEditingMode: (mode) => {
    const { slides, activeSlideIndex } = get();
    if (mode === "mobile") {
      const slide = slides[activeSlideIndex];
      if (slide && !slide.mobileElements) {
        const mobile = generateMobileElements(slide.elements);
        const updated = slides.map((s, i) =>
          i === activeSlideIndex ? { ...s, mobileElements: mobile } : s
        );
        set({ slides: updated, dirty: true, saveStatus: "unsaved" });
      }
    }
    set({ editingMode: mode, selectedElementIds: [] });
  },

  generateMobileLayout: () => {
    const { slides, activeSlideIndex } = get();
    const slide = slides[activeSlideIndex];
    if (!slide) return;
    const mobile = generateMobileElements(slide.elements);
    const updated = slides.map((s, i) =>
      i === activeSlideIndex ? { ...s, mobileElements: mobile } : s
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  updateSlideBackgroundImage: (url) => {
    const { slides, activeSlideIndex } = get();
    const updated = slides.map((s, i) =>
      i === activeSlideIndex ? { ...s, backgroundImage: url } : s
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  updateSlideTransition: (slideId, transition) => {
    const { slides } = get();
    const updated = slides.map((s) =>
      s.id === slideId ? { ...s, transition } : s
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  bringToFront: (elementId) => {
    const { slides, activeSlideIndex, editingMode } = get();
    const slide = slides[activeSlideIndex];
    if (!slide) return;
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const els = (key === "mobileElements" ? slide.mobileElements : slide.elements) ?? [];
    const maxZ = Math.max(...els.map((e) => e.zIndex), 0);
    const updated = slides.map((s, i) =>
      i !== activeSlideIndex ? s : { ...s, [key]: els.map((e) => e.id === elementId ? { ...e, zIndex: maxZ + 1 } : e) }
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  sendToBack: (elementId) => {
    const { slides, activeSlideIndex, editingMode } = get();
    const slide = slides[activeSlideIndex];
    if (!slide) return;
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const els = (key === "mobileElements" ? slide.mobileElements : slide.elements) ?? [];
    const minZ = Math.min(...els.map((e) => e.zIndex), 0);
    const updated = slides.map((s, i) =>
      i !== activeSlideIndex ? s : { ...s, [key]: els.map((e) => e.id === elementId ? { ...e, zIndex: minZ - 1 } : e) }
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  bringForward: (elementId) => {
    const { slides, activeSlideIndex, editingMode } = get();
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const updated = slides.map((s, i) => {
      if (i !== activeSlideIndex) return s;
      const els = (key === "mobileElements" ? s.mobileElements : s.elements) ?? [];
      return { ...s, [key]: els.map((e) => e.id === elementId ? { ...e, zIndex: e.zIndex + 1 } : e) };
    });
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  sendBackward: (elementId) => {
    const { slides, activeSlideIndex, editingMode } = get();
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const updated = slides.map((s, i) => {
      if (i !== activeSlideIndex) return s;
      const els = (key === "mobileElements" ? s.mobileElements : s.elements) ?? [];
      return { ...s, [key]: els.map((e) => e.id === elementId ? { ...e, zIndex: Math.max(0, e.zIndex - 1) } : e) };
    });
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  selectElement: (id, multi) =>
    set((state) => ({
      selectedElementIds: multi
        ? state.selectedElementIds.includes(id)
          ? state.selectedElementIds.filter((eid) => eid !== id)
          : [...state.selectedElementIds, id]
        : [id],
    })),

  clearSelection: () => set({ selectedElementIds: [] }),

  setActiveTool: (tool) => set({ activeTool: tool, selectedElementIds: [] }),

  copySelection: () => {
    const slide = get().getActiveSlide();
    if (!slide) return;
    const { editingMode } = get();
    const els = editingMode === "mobile" && slide.mobileElements ? slide.mobileElements : slide.elements;
    const copied = els.filter((el) =>
      get().selectedElementIds.includes(el.id)
    );
    set({ clipboard: cloneSlides([{ elements: copied } as Slide])[0].elements });
  },

  pasteClipboard: () => {
    const { clipboard } = get();
    clipboard.forEach((el) => {
      get().addElement({ ...el, id: nanoid(), x: el.x + 20, y: el.y + 20 });
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({
      slides: cloneSlides(history[newIndex]),
      historyIndex: newIndex,
      selectedElementIds: [],
      dirty: true,
      saveStatus: "unsaved",
    });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({
      slides: cloneSlides(history[newIndex]),
      historyIndex: newIndex,
      selectedElementIds: [],
      dirty: true,
      saveStatus: "unsaved",
    });
  },

  pushHistory: () => {
    const { slides, historyIndex, history } = get();
    const trimmed = history.slice(0, historyIndex + 1);
    const next = [...trimmed, cloneSlides(slides)];
    if (next.length > 50) next.shift();
    set({ history: next, historyIndex: next.length - 1 });
  },

  setElementBusy: (id) => {
    const next = new Set(get().busyElementIds);
    next.add(id);
    set({ busyElementIds: next });
  },
  clearElementBusy: (id) => {
    const next = new Set(get().busyElementIds);
    next.delete(id);
    set({ busyElementIds: next });
  },

  setSaveStatus: (s) => set({ saveStatus: s }),
  markClean: () => set({ dirty: false }),

  getTheme: () => {
    return THEMES[get().theme] ?? THEMES["editorial-blue"];
  },

  getActiveSlide: () => {
    const { slides, activeSlideIndex } = get();
    return slides[activeSlideIndex];
  },
}));
