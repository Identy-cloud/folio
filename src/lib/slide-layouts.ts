import { nanoid } from "nanoid";
import type { Theme } from "@/lib/templates/themes";
import type { SlideElement, TextElement, ImageElement, DividerElement } from "@/types/elements";

export interface SlideLayout {
  id: string;
  name: string;
  description: string;
  generate: (theme: Theme, zBase: number) => SlideElement[];
}

function text(
  overrides: Partial<TextElement> & { content: string; x: number; y: number; w: number; h: number },
  theme: Theme,
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

export const SLIDE_LAYOUTS: SlideLayout[] = [
  {
    id: "title",
    name: "Title Slide",
    description: "Large centered title with subtitle",
    generate: (theme, z) => [
      text({ content: "TITLE", x: 160, y: 320, w: 1600, h: 200, fontFamily: theme.fontDisplay, fontSize: 128, fontWeight: 400, lineHeight: 1.0, letterSpacing: 0.02, color: theme.text, textAlign: "center", verticalAlign: "middle" }, theme, z),
      text({ content: "Subtitle goes here", x: 460, y: 560, w: 1000, h: 80, fontSize: 28, color: theme.text + "99", textAlign: "center", verticalAlign: "top" }, theme, z + 1),
    ],
  },
  {
    id: "title-content",
    name: "Title + Content",
    description: "Title at top, text area below",
    generate: (theme, z) => [
      text({ content: "Section Title", x: 120, y: 80, w: 1680, h: 120, fontFamily: theme.fontDisplay, fontSize: 72, fontWeight: 400, lineHeight: 1.1, letterSpacing: 0.02, color: theme.text, textAlign: "left", verticalAlign: "top" }, theme, z),
      { id: nanoid(), type: "divider", x: 120, y: 220, w: 200, h: 4, rotation: 0, opacity: 1, zIndex: z + 1, locked: false, color: theme.accent, strokeWidth: 3 } satisfies DividerElement,
      text({ content: "Add your content here. This area is designed for body text, bullet points, or any descriptive content you need to present.", x: 120, y: 260, w: 1680, h: 700, fontSize: 28, lineHeight: 1.6, color: theme.text, textAlign: "left", verticalAlign: "top" }, theme, z + 2),
    ],
  },
  {
    id: "two-columns",
    name: "Two Columns",
    description: "Title at top, two text areas side by side",
    generate: (theme, z) => [
      text({ content: "Two Column Layout", x: 120, y: 80, w: 1680, h: 120, fontFamily: theme.fontDisplay, fontSize: 72, fontWeight: 400, lineHeight: 1.1, letterSpacing: 0.02, color: theme.text, textAlign: "left", verticalAlign: "top" }, theme, z),
      { id: nanoid(), type: "divider", x: 120, y: 220, w: 200, h: 4, rotation: 0, opacity: 1, zIndex: z + 1, locked: false, color: theme.accent, strokeWidth: 3 } satisfies DividerElement,
      text({ content: "Left column content goes here. Use this space for the first point or topic.", x: 120, y: 280, w: 780, h: 680, fontSize: 24, lineHeight: 1.6, color: theme.text, textAlign: "left", verticalAlign: "top" }, theme, z + 2),
      text({ content: "Right column content goes here. Use this space for the second point or topic.", x: 1020, y: 280, w: 780, h: 680, fontSize: 24, lineHeight: 1.6, color: theme.text, textAlign: "left", verticalAlign: "top" }, theme, z + 3),
    ],
  },
  {
    id: "image-text",
    name: "Image + Text",
    description: "Image on left, text on right",
    generate: (theme, z) => [
      { id: nanoid(), type: "image", x: 0, y: 0, w: 920, h: 1080, rotation: 0, opacity: 1, zIndex: z, locked: false, src: "", objectFit: "cover", filter: "none", isPlaceholder: true } satisfies ImageElement,
      text({ content: "Heading", x: 1000, y: 200, w: 800, h: 100, fontFamily: theme.fontDisplay, fontSize: 64, fontWeight: 400, lineHeight: 1.1, letterSpacing: 0.02, color: theme.text, textAlign: "left", verticalAlign: "top" }, theme, z + 1),
      { id: nanoid(), type: "divider", x: 1000, y: 320, w: 120, h: 4, rotation: 0, opacity: 1, zIndex: z + 2, locked: false, color: theme.accent, strokeWidth: 3 } satisfies DividerElement,
      text({ content: "Describe your image or expand on the topic here. This layout works great for case studies, portfolio items, or feature highlights.", x: 1000, y: 360, w: 800, h: 500, fontSize: 24, lineHeight: 1.6, color: theme.text, textAlign: "left", verticalAlign: "top" }, theme, z + 3),
    ],
  },
  {
    id: "full-image",
    name: "Full Image",
    description: "Full-bleed image with overlay text",
    generate: (theme, z) => [
      { id: nanoid(), type: "image", x: 0, y: 0, w: 1920, h: 1080, rotation: 0, opacity: 1, zIndex: z, locked: false, src: "", objectFit: "cover", filter: "none", isPlaceholder: true } satisfies ImageElement,
      { id: nanoid(), type: "shape", x: 0, y: 0, w: 1920, h: 1080, rotation: 0, opacity: 0.5, zIndex: z + 1, locked: false, shape: "rect", fill: "#000000", stroke: "transparent", strokeWidth: 0, borderRadius: 0 } as SlideElement,
      text({ content: "BOLD STATEMENT", x: 160, y: 380, w: 1600, h: 200, fontFamily: theme.fontDisplay, fontSize: 96, fontWeight: 400, lineHeight: 1.1, letterSpacing: 0.02, color: "#ffffff", textAlign: "center", verticalAlign: "middle" }, theme, z + 2),
      text({ content: "Supporting text over the image", x: 460, y: 600, w: 1000, h: 60, fontSize: 24, color: "#ffffffcc", textAlign: "center", verticalAlign: "top" }, theme, z + 3),
    ],
  },
  {
    id: "quote",
    name: "Quote",
    description: "Large centered quote with attribution",
    generate: (theme, z) => [
      text({ content: "\u201CGreat design is not just what it looks like. Great design is how it works.\u201D", x: 200, y: 280, w: 1520, h: 300, fontFamily: theme.fontDisplay, fontSize: 56, fontWeight: 400, lineHeight: 1.4, letterSpacing: 0, color: theme.text, textAlign: "center", verticalAlign: "middle" }, theme, z),
      { id: nanoid(), type: "divider", x: 860, y: 620, w: 200, h: 4, rotation: 0, opacity: 1, zIndex: z + 1, locked: false, color: theme.accent, strokeWidth: 2 } satisfies DividerElement,
      text({ content: "\u2014 Attribution", x: 560, y: 660, w: 800, h: 60, fontSize: 22, color: theme.text + "99", textAlign: "center", verticalAlign: "top", letterSpacing: 0.05 }, theme, z + 2),
    ],
  },
  {
    id: "section-header",
    name: "Section Header",
    description: "Bold centered section title with divider",
    generate: (theme, z) => [
      text({ content: "SECTION", x: 160, y: 400, w: 1600, h: 160, fontFamily: theme.fontDisplay, fontSize: 120, fontWeight: 400, lineHeight: 1.0, letterSpacing: 0.08, color: theme.text, textAlign: "center", verticalAlign: "middle" }, theme, z),
      { id: nanoid(), type: "divider", x: 810, y: 580, w: 300, h: 4, rotation: 0, opacity: 1, zIndex: z + 1, locked: false, color: theme.accent, strokeWidth: 3 } satisfies DividerElement,
    ],
  },
  {
    id: "blank",
    name: "Blank",
    description: "Empty slide",
    generate: () => [],
  },
];
