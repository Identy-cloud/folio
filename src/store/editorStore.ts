import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Slide, SlideElement, SlideTransition } from "@/types/elements";

export type ActiveTool = "select" | "text" | "image" | "shape" | "arrow";
export type SaveStatus = "saved" | "saving" | "error" | "unsaved";

interface EditorState {
  presentationId: string;
  slides: Slide[];
  activeSlideIndex: number;
  selectedElementIds: string[];
  activeTool: ActiveTool;
  clipboard: SlideElement[];
  saveStatus: SaveStatus;

  history: Slide[][];
  historyIndex: number;

  init: (presentationId: string, slides: Slide[]) => void;
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
  updateSlideTransition: (slideId: string, transition: SlideTransition) => void;

  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setActiveTool: (tool: ActiveTool) => void;

  copySelection: () => void;
  pasteClipboard: () => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  setSaveStatus: (s: SaveStatus) => void;
  getActiveSlide: () => Slide | undefined;
  dirty: boolean;
  markClean: () => void;
}

function cloneSlides(slides: Slide[]): Slide[] {
  return JSON.parse(JSON.stringify(slides));
}

export const useEditorStore = create<EditorState>((set, get) => ({
  presentationId: "",
  slides: [],
  activeSlideIndex: 0,
  selectedElementIds: [],
  activeTool: "select",
  clipboard: [],
  saveStatus: "saved",
  history: [],
  historyIndex: -1,
  dirty: false,

  init: (presentationId, slides) => {
    const sorted = [...slides].sort((a, b) => a.order - b.order);
    set({
      presentationId,
      slides: sorted,
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
    const { slides, activeSlideIndex } = get();
    const updated = slides.map((s, i) =>
      i === activeSlideIndex
        ? { ...s, elements: [...s.elements, element] }
        : s
    );
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
    const { slides, activeSlideIndex } = get();
    const updated = slides.map((s, i) =>
      i === activeSlideIndex
        ? {
            ...s,
            elements: s.elements.map((el) =>
              el.id === elementId
                ? ({ ...el, ...updates } as SlideElement)
                : el
            ),
          }
        : s
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
  },

  deleteElement: (elementId) => {
    const { slides, activeSlideIndex } = get();
    const updated = slides.map((s, i) =>
      i === activeSlideIndex
        ? { ...s, elements: s.elements.filter((el) => el.id !== elementId) }
        : s
    );
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
    const el = slide.elements.find((e) => e.id === elementId);
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

  updateSlideTransition: (slideId, transition) => {
    const { slides } = get();
    const updated = slides.map((s) =>
      s.id === slideId ? { ...s, transition } : s
    );
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
    const copied = slide.elements.filter((el) =>
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

  setSaveStatus: (s) => set({ saveStatus: s }),
  markClean: () => set({ dirty: false }),

  getActiveSlide: () => {
    const { slides, activeSlideIndex } = get();
    return slides[activeSlideIndex];
  },
}));
