import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "@/store/editorStore";
import type { Slide, TextElement } from "@/types/elements";

function makeSlide(overrides?: Partial<Slide>): Slide {
  return {
    id: "slide-1",
    presentationId: "pres-1",
    order: 0,
    transition: "fade",
    backgroundColor: "#ffffff",
    backgroundImage: null,
    elements: [],
    mobileElements: null,
    notes: "",
    ...overrides,
  };
}

function makeTextElement(overrides?: Partial<TextElement>): TextElement {
  return {
    id: "el-1",
    type: "text",
    x: 100, y: 100, w: 200, h: 50,
    rotation: 0, opacity: 1, zIndex: 1, locked: false,
    content: "Hello",
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0,
    color: "#000000",
    textAlign: "left",
    verticalAlign: "top",
    ...overrides,
  };
}

describe("editorStore", () => {
  beforeEach(() => {
    useEditorStore.getState().init("pres-1", [makeSlide()]);
  });

  describe("init", () => {
    it("sets presentationId and slides", () => {
      const state = useEditorStore.getState();
      expect(state.presentationId).toBe("pres-1");
      expect(state.slides).toHaveLength(1);
      expect(state.activeSlideIndex).toBe(0);
    });

    it("sorts slides by order", () => {
      useEditorStore.getState().init("pres-1", [
        makeSlide({ id: "b", order: 1 }),
        makeSlide({ id: "a", order: 0 }),
      ]);
      const slides = useEditorStore.getState().slides;
      expect(slides[0].id).toBe("a");
      expect(slides[1].id).toBe("b");
    });
  });

  describe("slides CRUD", () => {
    it("addSlide appends a new slide", () => {
      useEditorStore.getState().addSlide();
      const state = useEditorStore.getState();
      expect(state.slides).toHaveLength(2);
      expect(state.activeSlideIndex).toBe(1);
      expect(state.dirty).toBe(true);
    });

    it("deleteSlide removes slide and adjusts index", () => {
      useEditorStore.getState().addSlide();
      expect(useEditorStore.getState().slides).toHaveLength(2);
      useEditorStore.getState().deleteSlide(useEditorStore.getState().slides[0].id);
      expect(useEditorStore.getState().slides).toHaveLength(1);
    });

    it("deleteSlide prevents deleting last slide", () => {
      useEditorStore.getState().deleteSlide("slide-1");
      expect(useEditorStore.getState().slides).toHaveLength(1);
    });

    it("reorderSlides moves slide", () => {
      useEditorStore.getState().addSlide();
      useEditorStore.getState().addSlide();
      const ids = useEditorStore.getState().slides.map((s) => s.id);
      useEditorStore.getState().reorderSlides(0, 2);
      const newIds = useEditorStore.getState().slides.map((s) => s.id);
      expect(newIds[2]).toBe(ids[0]);
    });
  });

  describe("elements CRUD", () => {
    it("addElement adds to active slide", () => {
      const el = makeTextElement();
      useEditorStore.getState().addElement(el);
      const slide = useEditorStore.getState().getActiveSlide();
      expect(slide?.elements).toHaveLength(1);
      expect(slide?.elements[0].id).toBe("el-1");
    });

    it("updateElement modifies element properties", () => {
      useEditorStore.getState().addElement(makeTextElement());
      useEditorStore.getState().updateElement("el-1", { x: 500 });
      const el = useEditorStore.getState().getActiveSlide()?.elements[0];
      expect(el?.x).toBe(500);
    });

    it("deleteElement removes element", () => {
      useEditorStore.getState().addElement(makeTextElement());
      useEditorStore.getState().deleteElement("el-1");
      expect(useEditorStore.getState().getActiveSlide()?.elements).toHaveLength(0);
    });

    it("duplicateElement creates copy with offset", () => {
      useEditorStore.getState().addElement(makeTextElement());
      useEditorStore.getState().duplicateElement("el-1");
      const els = useEditorStore.getState().getActiveSlide()?.elements;
      expect(els).toHaveLength(2);
      expect(els![1].x).toBe(120); // +20 offset
      expect(els![1].id).not.toBe("el-1");
    });
  });

  describe("selection", () => {
    it("selectElement sets selection", () => {
      useEditorStore.getState().selectElement("el-1");
      expect(useEditorStore.getState().selectedElementIds).toEqual(["el-1"]);
    });

    it("selectElement multi adds to selection", () => {
      useEditorStore.getState().selectElement("el-1");
      useEditorStore.getState().selectElement("el-2", true);
      expect(useEditorStore.getState().selectedElementIds).toEqual(["el-1", "el-2"]);
    });

    it("selectElement multi toggles off", () => {
      useEditorStore.getState().selectElement("el-1");
      useEditorStore.getState().selectElement("el-1", true);
      expect(useEditorStore.getState().selectedElementIds).toEqual([]);
    });

    it("clearSelection empties selection", () => {
      useEditorStore.getState().selectElement("el-1");
      useEditorStore.getState().clearSelection();
      expect(useEditorStore.getState().selectedElementIds).toEqual([]);
    });
  });

  describe("undo/redo", () => {
    it("undo reverts last change", () => {
      useEditorStore.getState().addElement(makeTextElement());
      expect(useEditorStore.getState().getActiveSlide()?.elements).toHaveLength(1);
      useEditorStore.getState().undo();
      expect(useEditorStore.getState().getActiveSlide()?.elements).toHaveLength(0);
    });

    it("redo restores undone change", () => {
      useEditorStore.getState().addElement(makeTextElement());
      useEditorStore.getState().undo();
      useEditorStore.getState().redo();
      expect(useEditorStore.getState().getActiveSlide()?.elements).toHaveLength(1);
    });

    it("undo at beginning does nothing", () => {
      const before = useEditorStore.getState().slides;
      useEditorStore.getState().undo();
      expect(useEditorStore.getState().slides).toEqual(before);
    });
  });

  describe("slide properties", () => {
    it("updateSlideBackground changes color", () => {
      useEditorStore.getState().updateSlideBackground("#ff0000");
      expect(useEditorStore.getState().getActiveSlide()?.backgroundColor).toBe("#ff0000");
    });

    it("updateSlideNotes changes notes", () => {
      useEditorStore.getState().updateSlideNotes("Speaker note here");
      expect(useEditorStore.getState().getActiveSlide()?.notes).toBe("Speaker note here");
    });

    it("updateSlideTransition changes transition", () => {
      const slideId = useEditorStore.getState().slides[0].id;
      useEditorStore.getState().updateSlideTransition(slideId, "zoom");
      expect(useEditorStore.getState().slides[0].transition).toBe("zoom");
    });
  });

  describe("layer operations", () => {
    it("bringToFront sets highest zIndex", () => {
      useEditorStore.getState().addElement(makeTextElement({ id: "a", zIndex: 1 }));
      useEditorStore.getState().addElement(makeTextElement({ id: "b", zIndex: 2 }));
      useEditorStore.getState().bringToFront("a");
      const el = useEditorStore.getState().getActiveSlide()?.elements.find((e) => e.id === "a");
      expect(el?.zIndex).toBe(3);
    });

    it("sendToBack sets lowest zIndex", () => {
      useEditorStore.getState().addElement(makeTextElement({ id: "a", zIndex: 1 }));
      useEditorStore.getState().addElement(makeTextElement({ id: "b", zIndex: 2 }));
      useEditorStore.getState().sendToBack("b");
      const el = useEditorStore.getState().getActiveSlide()?.elements.find((e) => e.id === "b");
      expect(el?.zIndex).toBeLessThan(1);
    });
  });

  describe("copy/paste", () => {
    it("copies and pastes selected elements", () => {
      useEditorStore.getState().addElement(makeTextElement());
      useEditorStore.getState().selectElement("el-1");
      useEditorStore.getState().copySelection();
      useEditorStore.getState().pasteClipboard();
      const els = useEditorStore.getState().getActiveSlide()?.elements;
      expect(els).toHaveLength(2);
      expect(els![1].x).toBe(120);
    });
  });
});
