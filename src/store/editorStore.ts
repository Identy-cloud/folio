import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Slide, SlideElement, SlideTransition, TransitionEasing, GradientDef } from "@/types/elements";
import { generateMobileElements } from "@/lib/mobile-layout";
import { THEMES, type Theme, type CustomThemeMap } from "@/lib/templates/themes";
import type { SnapLine, SpacingIndicator } from "@/lib/snap-utils";

export type ActiveTool = "select" | "text" | "image" | "shape" | "arrow";
export type SaveStatus = "saved" | "saving" | "error" | "unsaved";
export type EditingMode = "desktop" | "mobile";

interface EditorState {
  presentationId: string;
  theme: string;
  customThemes: CustomThemeMap;
  slides: Slide[];
  activeSlideIndex: number;
  selectedElementIds: string[];
  activeTool: ActiveTool;
  editingMode: EditingMode;
  snapToGrid: boolean;
  clipboard: SlideElement[];
  saveStatus: SaveStatus;

  history: Slide[][];
  historyIndex: number;

  init: (presentationId: string, slides: Slide[], theme?: string, customThemes?: CustomThemeMap) => void;
  getTheme: () => Theme;
  setCustomThemes: (themes: CustomThemeMap) => void;
  addCustomTheme: (key: string, theme: Theme) => void;
  deleteCustomTheme: (key: string) => void;
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
  updateSlideBackgroundGradient: (gradient: GradientDef | null) => void;
  updateSlideBackgroundImage: (url: string | null) => void;
  updateSlideTransition: (slideId: string, transition: SlideTransition) => void;
  updateSlideTransitionDuration: (slideId: string, duration: number) => void;
  updateSlideTransitionEasing: (slideId: string, easing: TransitionEasing) => void;
  updateSlideNotes: (notes: string) => void;

  setEditingMode: (mode: EditingMode) => void;
  generateMobileLayout: () => void;

  toggleElementVisibility: (elementId: string) => void;

  bringToFront: (elementId: string) => void;
  sendToBack: (elementId: string) => void;
  bringForward: (elementId: string) => void;
  sendBackward: (elementId: string) => void;

  selectElement: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setActiveTool: (tool: ActiveTool) => void;
  groupSelection: () => void;
  ungroupSelection: () => void;

  copySelection: () => void;
  pasteClipboard: () => void;
  copyStyle: () => void;
  pasteStyle: () => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  editingTextId: string | null;
  setEditingTextId: (id: string | null) => void;

  busyElementIds: Set<string>;
  setElementBusy: (id: string) => void;
  clearElementBusy: (id: string) => void;

  snapGuides: SnapLine[];
  snapSpacing: SpacingIndicator[];
  setSnapGuides: (guides: SnapLine[], spacing: SpacingIndicator[]) => void;
  clearSnapGuides: () => void;

  distributeHorizontally: () => void;
  distributeVertically: () => void;

  setSaveStatus: (s: SaveStatus) => void;
  getActiveSlide: () => Slide | undefined;
  dirty: boolean;
  markClean: () => void;
}

let styleClipboard: Record<string, unknown> | null = null;

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
  customThemes: {},
  slides: [],
  activeSlideIndex: 0,
  selectedElementIds: [],
  activeTool: "select",
  editingMode: "desktop",
  snapToGrid: false,
  clipboard: [],
  saveStatus: "saved",
  history: [],
  historyIndex: -1,
  dirty: false,
  editingTextId: null,
  busyElementIds: new Set<string>(),
  snapGuides: [],
  snapSpacing: [],

  init: (presentationId, slides, theme, customThemes) => {
    const sorted = [...slides]
      .sort((a, b) => a.order - b.order)
      .map((s) => ({ ...s, transition: s.transition ?? "fade" }));
    set({
      presentationId,
      theme: theme ?? "editorial-blue",
      customThemes: customThemes ?? {},
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
      notes: "",
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

  updateSlideBackgroundGradient: (gradient) => {
    const { slides, activeSlideIndex } = get();
    const updated = slides.map((s, i) =>
      i === activeSlideIndex ? { ...s, backgroundGradient: gradient ?? undefined } : s
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

  updateSlideTransitionDuration: (slideId, duration) => {
    const { slides } = get();
    const clamped = Math.max(200, Math.min(2000, duration));
    const updated = slides.map((s) =>
      s.id === slideId ? { ...s, transitionDuration: clamped } : s
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  updateSlideTransitionEasing: (slideId, easing) => {
    const { slides } = get();
    const updated = slides.map((s) =>
      s.id === slideId ? { ...s, transitionEasing: easing } : s
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  updateSlideNotes: (notes) => {
    const { slides, activeSlideIndex } = get();
    const updated = slides.map((s, i) =>
      i === activeSlideIndex ? { ...s, notes } : s
    );
    set({ slides: updated, dirty: true, saveStatus: "unsaved" });
  },

  toggleElementVisibility: (elementId) => {
    const { slides, activeSlideIndex, editingMode } = get();
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const updated = slides.map((s, i) => {
      if (i !== activeSlideIndex) return s;
      const arr = (key === "mobileElements" ? s.mobileElements : s.elements) ?? [];
      return {
        ...s,
        [key]: arr.map((el) =>
          el.id === elementId ? { ...el, visible: el.visible === false } as typeof el : el
        ),
      };
    });
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

  selectElement: (id, multi) => {
    const state = get();
    const slide = state.getActiveSlide();
    const els = state.editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements ?? [];
    const el = els.find((e) => e.id === id);
    const groupId = el?.groupId;

    if (multi) {
      set((s) => ({
        selectedElementIds: s.selectedElementIds.includes(id)
          ? s.selectedElementIds.filter((eid) => eid !== id)
          : [...s.selectedElementIds, id],
      }));
    } else if (groupId) {
      const groupIds = els.filter((e) => e.groupId === groupId).map((e) => e.id);
      set({ selectedElementIds: groupIds });
    } else {
      set({ selectedElementIds: [id] });
    }
  },

  clearSelection: () => set({ selectedElementIds: [], editingTextId: null }),

  setActiveTool: (tool) => set({ activeTool: tool, selectedElementIds: [] }),

  groupSelection: () => {
    const { selectedElementIds, slides, activeSlideIndex, editingMode } = get();
    if (selectedElementIds.length < 2) return;
    const gid = nanoid(8);
    const slide = slides[activeSlideIndex];
    const key = editingMode === "mobile" && slide.mobileElements ? "mobileElements" : "elements";
    const els = (slide[key] ?? slide.elements) as import("@/types/elements").SlideElement[];
    const updated = els.map((e) =>
      selectedElementIds.includes(e.id) ? { ...e, groupId: gid } : e
    );
    const newSlides = slides.map((s, i) =>
      i === activeSlideIndex ? { ...s, [key]: updated } : s
    );
    set({ slides: newSlides, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

  ungroupSelection: () => {
    const { selectedElementIds, slides, activeSlideIndex, editingMode } = get();
    if (selectedElementIds.length === 0) return;
    const slide = slides[activeSlideIndex];
    const key = editingMode === "mobile" && slide.mobileElements ? "mobileElements" : "elements";
    const els = (slide[key] ?? slide.elements) as import("@/types/elements").SlideElement[];
    const updated = els.map((e) =>
      selectedElementIds.includes(e.id) ? { ...e, groupId: undefined } : e
    );
    const newSlides = slides.map((s, i) =>
      i === activeSlideIndex ? { ...s, [key]: updated } : s
    );
    set({ slides: newSlides, dirty: true, saveStatus: "unsaved" });
    get().pushHistory();
  },

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

  copyStyle: () => {
    const { selectedElementIds } = get();
    if (selectedElementIds.length !== 1) return;
    const slide = get().getActiveSlide();
    const els = get().editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements;
    const el = els?.find((e) => e.id === selectedElementIds[0]);
    if (!el) return;
    const { id, type, x, y, w, h, rotation, zIndex, locked, visible, groupId, animation, animationDelay, animationDuration, animationEasing, ...style } = el as unknown as Record<string, unknown>;
    styleClipboard = style;
  },

  pasteStyle: () => {
    if (!styleClipboard) return;
    const { selectedElementIds } = get();
    const slide = get().getActiveSlide();
    const els = get().editingMode === "mobile" && slide?.mobileElements ? slide.mobileElements : slide?.elements;
    for (const id of selectedElementIds) {
      const el = els?.find((e) => e.id === id);
      if (!el) continue;
      const applicable: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(styleClipboard)) {
        if (key in el) applicable[key] = val;
      }
      get().updateElement(id, applicable);
    }
    get().pushHistory();
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
    if (historyTimer) { clearTimeout(historyTimer); historyTimer = null; }
    const { slides, historyIndex, history } = get();
    const trimmed = history.slice(0, historyIndex + 1);
    const next = [...trimmed, cloneSlides(slides)];
    if (next.length > 50) next.shift();
    set({ history: next, historyIndex: next.length - 1 });
  },

  setEditingTextId: (id) => set({ editingTextId: id }),

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

  setSnapGuides: (guides, spacing) => set({ snapGuides: guides, snapSpacing: spacing }),
  clearSnapGuides: () => set({ snapGuides: [], snapSpacing: [] }),

  distributeHorizontally: () => {
    const { selectedElementIds, slides, activeSlideIndex, editingMode } = get();
    if (selectedElementIds.length < 3) return;
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const slide = slides[activeSlideIndex];
    if (!slide) return;
    const els = ((key === "mobileElements" ? slide.mobileElements : slide.elements) ?? []);
    const selected = els.filter((e) => selectedElementIds.includes(e.id));
    if (selected.length < 3) return;
    const sorted = [...selected].sort((a, b) => a.x - b.x);
    const minX = sorted[0].x;
    const maxRight = sorted[sorted.length - 1].x + sorted[sorted.length - 1].w;
    const totalW = sorted.reduce((sum, e) => sum + e.w, 0);
    const gap = (maxRight - minX - totalW) / (sorted.length - 1);
    let x = minX;
    for (const el of sorted) {
      get().updateElement(el.id, { x });
      x += el.w + gap;
    }
    get().pushHistory();
  },

  distributeVertically: () => {
    const { selectedElementIds, slides, activeSlideIndex, editingMode } = get();
    if (selectedElementIds.length < 3) return;
    const key = editingMode === "mobile" ? "mobileElements" : "elements";
    const slide = slides[activeSlideIndex];
    if (!slide) return;
    const els = ((key === "mobileElements" ? slide.mobileElements : slide.elements) ?? []);
    const selected = els.filter((e) => selectedElementIds.includes(e.id));
    if (selected.length < 3) return;
    const sorted = [...selected].sort((a, b) => a.y - b.y);
    const minY = sorted[0].y;
    const maxBottom = sorted[sorted.length - 1].y + sorted[sorted.length - 1].h;
    const totalH = sorted.reduce((sum, e) => sum + e.h, 0);
    const gap = (maxBottom - minY - totalH) / (sorted.length - 1);
    let y = minY;
    for (const el of sorted) {
      get().updateElement(el.id, { y });
      y += el.h + gap;
    }
    get().pushHistory();
  },

  setSaveStatus: (s) => set({ saveStatus: s }),
  markClean: () => set({ dirty: false }),

  getTheme: () => {
    const { theme, customThemes } = get();
    return customThemes[theme] ?? THEMES[theme] ?? THEMES["editorial-blue"];
  },

  setCustomThemes: (themes) => set({ customThemes: themes }),

  addCustomTheme: (key, theme) => {
    const updated = { ...get().customThemes, [key]: theme };
    set({ customThemes: updated, dirty: true, saveStatus: "unsaved" as const });
  },

  deleteCustomTheme: (key) => {
    const { [key]: _, ...rest } = get().customThemes;
    const updates: Partial<EditorState> = { customThemes: rest, dirty: true, saveStatus: "unsaved" as const };
    if (get().theme === key) updates.theme = "editorial-blue";
    set(updates);
  },

  getActiveSlide: () => {
    const { slides, activeSlideIndex } = get();
    return slides[activeSlideIndex];
  },
}));
