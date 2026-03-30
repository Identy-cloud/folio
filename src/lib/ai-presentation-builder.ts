import { nanoid } from "nanoid";
import type { Theme } from "@/lib/templates/themes";
import type { Slide, SlideElement, TextElement, DividerElement, ShapeElement } from "@/types/elements";
import type { GeneratedSlide } from "@/app/api/ai/generate-presentation/route";

function text(
  theme: Theme,
  overrides: Partial<TextElement> & { content: string; x: number; y: number; w: number; h: number },
  zIndex: number,
): TextElement {
  return {
    id: nanoid(),
    type: "text",
    rotation: 0,
    opacity: 1,
    locked: false,
    fontFamily: theme.fontBody,
    fontSize: 32,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0,
    color: theme.text,
    textAlign: "left",
    verticalAlign: "top",
    zIndex,
    ...overrides,
  };
}

function divider(theme: Theme, x: number, y: number, w: number, zIndex: number): DividerElement {
  return {
    id: nanoid(),
    type: "divider",
    x, y, w, h: 4,
    rotation: 0,
    opacity: 1,
    zIndex,
    locked: false,
    color: theme.accent,
    strokeWidth: 3,
  };
}

function buildTitleSlide(theme: Theme, slide: GeneratedSlide): SlideElement[] {
  return [
    text(theme, {
      content: slide.title.toUpperCase(),
      x: 160, y: 320, w: 1600, h: 200,
      fontFamily: theme.fontDisplay, fontSize: 120, fontWeight: 400,
      lineHeight: 1.0, letterSpacing: 0.02, textAlign: "center", verticalAlign: "middle",
    }, 1),
    text(theme, {
      content: slide.subtitle,
      x: 360, y: 560, w: 1200, h: 80,
      fontSize: 28, color: theme.text + "99", textAlign: "center",
    }, 2),
  ];
}

function buildTitleContentSlide(theme: Theme, slide: GeneratedSlide): SlideElement[] {
  return [
    text(theme, {
      content: slide.title,
      x: 120, y: 80, w: 1680, h: 120,
      fontFamily: theme.fontDisplay, fontSize: 72, fontWeight: 400,
      lineHeight: 1.1, letterSpacing: 0.02,
    }, 1),
    divider(theme, 120, 220, 200, 2),
    text(theme, {
      content: slide.body || slide.subtitle,
      x: 120, y: 260, w: 1680, h: 700,
      fontSize: 28, lineHeight: 1.6,
    }, 3),
  ];
}

function buildTwoColumnsSlide(theme: Theme, slide: GeneratedSlide): SlideElement[] {
  const parts = slide.body.split("|||").map((s) => s.trim());
  const left = parts[0] || slide.body;
  const right = parts[1] || slide.subtitle;

  return [
    text(theme, {
      content: slide.title,
      x: 120, y: 80, w: 1680, h: 120,
      fontFamily: theme.fontDisplay, fontSize: 72, fontWeight: 400,
      lineHeight: 1.1, letterSpacing: 0.02,
    }, 1),
    divider(theme, 120, 220, 200, 2),
    text(theme, { content: left, x: 120, y: 280, w: 780, h: 680, fontSize: 24, lineHeight: 1.6 }, 3),
    text(theme, { content: right, x: 1020, y: 280, w: 780, h: 680, fontSize: 24, lineHeight: 1.6 }, 4),
  ];
}

function buildImageTextSlide(theme: Theme, slide: GeneratedSlide): SlideElement[] {
  return [
    {
      id: nanoid(), type: "shape" as const, x: 0, y: 0, w: 920, h: 1080,
      rotation: 0, opacity: 0.15, zIndex: 1, locked: false,
      shape: "rect" as const, fill: theme.accent, stroke: "transparent",
      strokeWidth: 0, borderRadius: 0,
    } satisfies ShapeElement,
    text(theme, {
      content: slide.title,
      x: 1000, y: 200, w: 800, h: 100,
      fontFamily: theme.fontDisplay, fontSize: 64, fontWeight: 400,
      lineHeight: 1.1, letterSpacing: 0.02,
    }, 2),
    divider(theme, 1000, 320, 120, 3),
    text(theme, {
      content: slide.body || slide.subtitle,
      x: 1000, y: 360, w: 800, h: 500,
      fontSize: 24, lineHeight: 1.6,
    }, 4),
  ];
}

function buildQuoteSlide(theme: Theme, slide: GeneratedSlide): SlideElement[] {
  const quoteText = slide.body || slide.title;
  return [
    text(theme, {
      content: `\u201C${quoteText}\u201D`,
      x: 200, y: 280, w: 1520, h: 300,
      fontFamily: theme.fontDisplay, fontSize: 56, fontWeight: 400,
      lineHeight: 1.4, textAlign: "center", verticalAlign: "middle",
    }, 1),
    divider(theme, 860, 620, 200, 2),
    text(theme, {
      content: slide.subtitle ? `\u2014 ${slide.subtitle}` : "",
      x: 560, y: 660, w: 800, h: 60,
      fontSize: 22, color: theme.text + "99", textAlign: "center", letterSpacing: 0.05,
    }, 3),
  ];
}

function buildSectionHeaderSlide(theme: Theme, slide: GeneratedSlide): SlideElement[] {
  return [
    text(theme, {
      content: slide.title.toUpperCase(),
      x: 160, y: 400, w: 1600, h: 160,
      fontFamily: theme.fontDisplay, fontSize: 120, fontWeight: 400,
      lineHeight: 1.0, letterSpacing: 0.08, textAlign: "center", verticalAlign: "middle",
    }, 1),
    divider(theme, 810, 580, 300, 2),
  ];
}

const LAYOUT_BUILDERS: Record<GeneratedSlide["layout"], (theme: Theme, slide: GeneratedSlide) => SlideElement[]> = {
  "title": buildTitleSlide,
  "title-content": buildTitleContentSlide,
  "two-columns": buildTwoColumnsSlide,
  "image-text": buildImageTextSlide,
  "quote": buildQuoteSlide,
  "section-header": buildSectionHeaderSlide,
};

export function buildPresentationSlides(
  generatedSlides: GeneratedSlide[],
  theme: Theme,
  presentationId: string,
): Slide[] {
  return generatedSlides.map((gs, index) => {
    const builder = LAYOUT_BUILDERS[gs.layout];
    const elements = builder(theme, gs);
    return {
      id: nanoid(),
      presentationId,
      order: index,
      transition: "fade" as const,
      backgroundColor: theme.background,
      backgroundImage: null,
      elements,
      mobileElements: null,
      notes: gs.notes,
    };
  });
}
