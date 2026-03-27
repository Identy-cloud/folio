import { nanoid } from "nanoid";
import type { Slide, TextElement, ShapeElement } from "@/types/elements";
import { THEMES, type Theme } from "./themes";

function txt(
  t: Theme,
  overrides: Partial<TextElement> & { x: number; y: number; w: number; h: number; content: string }
): TextElement {
  return {
    id: nanoid(),
    type: "text",
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    locked: false,
    fontFamily: t.fontBody,
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    color: t.text,
    textAlign: "left",
    verticalAlign: "top",
    ...overrides,
  };
}

function shape(
  overrides: Partial<ShapeElement> & { x: number; y: number; w: number; h: number }
): ShapeElement {
  return {
    id: nanoid(),
    type: "shape",
    rotation: 0,
    opacity: 1,
    zIndex: 0,
    locked: false,
    shape: "rect",
    fill: "#cccccc",
    stroke: "transparent",
    strokeWidth: 0,
    borderRadius: 0,
    ...overrides,
  };
}

function coverSlide(t: Theme, pid: string): Slide {
  return {
    id: nanoid(),
    presentationId: pid,
    order: 0,
    backgroundColor: t.background,
    backgroundImage: null,
    mobileElements: null,
    elements: [
      shape({ x: 960, y: 0, w: 960, h: 1080, fill: t.accent, opacity: 0.08, zIndex: 0 }),
      txt(t, {
        x: 120, y: 280, w: 800, h: 200, content: "TU TÍTULO AQUÍ",
        fontFamily: t.fontDisplay, fontSize: 120, fontWeight: 400,
        lineHeight: 1.0, letterSpacing: 0.02, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 500, w: 600, h: 60, content: "Subtítulo de la presentación",
        fontSize: 28, color: t.accent, letterSpacing: 0.05, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 920, w: 300, h: 30, content: "Tu Nombre — 2026",
        fontSize: 14, letterSpacing: 0.1, color: t.text, opacity: 0.5, zIndex: 2,
      }),
      shape({ x: 120, y: 580, w: 80, h: 3, fill: t.accent, zIndex: 1 }),
    ],
  };
}

function aboutSlide(t: Theme, pid: string): Slide {
  return {
    id: nanoid(),
    presentationId: pid,
    order: 1,
    backgroundColor: t.background,
    backgroundImage: null,
    mobileElements: null,
    elements: [
      txt(t, {
        x: 120, y: 80, w: 200, h: 40, content: "ABOUT",
        fontFamily: t.fontDisplay, fontSize: 48, letterSpacing: 0.05, color: t.accent, zIndex: 2,
      }),
      shape({ x: 120, y: 140, w: 60, h: 3, fill: t.accent, zIndex: 1 }),
      txt(t, {
        x: 120, y: 200, w: 700, h: 300,
        content: "Somos un estudio creativo especializado en diseño editorial y branding. Nuestro enfoque combina tipografía expresiva con layouts asimétricos para crear experiencias visuales memorables.",
        fontSize: 28, lineHeight: 1.6, zIndex: 2,
      }),
      shape({ x: 1000, y: 120, w: 780, h: 840, fill: t.accent, opacity: 0.06, zIndex: 0 }),
      txt(t, {
        x: 1040, y: 200, w: 700, h: 60, content: "10+ años de experiencia",
        fontFamily: t.fontDisplay, fontSize: 64, zIndex: 2,
      }),
      txt(t, {
        x: 1040, y: 320, w: 700, h: 60, content: "200+ proyectos completados",
        fontFamily: t.fontDisplay, fontSize: 64, zIndex: 2,
      }),
      txt(t, {
        x: 1040, y: 440, w: 700, h: 60, content: "50+ clientes satisfechos",
        fontFamily: t.fontDisplay, fontSize: 64, zIndex: 2,
      }),
    ],
  };
}

function teamSlide(t: Theme, pid: string): Slide {
  const members = ["Director Creativo", "Diseñador Senior", "Estratega Digital"];
  return {
    id: nanoid(),
    presentationId: pid,
    order: 2,
    backgroundColor: t.background,
    backgroundImage: null,
    mobileElements: null,
    elements: [
      txt(t, {
        x: 120, y: 80, w: 400, h: 40, content: "EQUIPO",
        fontFamily: t.fontDisplay, fontSize: 48, letterSpacing: 0.05, color: t.accent, zIndex: 2,
      }),
      shape({ x: 120, y: 140, w: 60, h: 3, fill: t.accent, zIndex: 1 }),
      ...members.flatMap((role, i) => {
        const x = 120 + i * 580;
        return [
          shape({ x, y: 220, w: 500, h: 500, fill: t.accent, opacity: 0.06, zIndex: 0 }),
          txt(t, {
            x: x + 30, y: 750, w: 440, h: 40, content: `Nombre ${i + 1}`,
            fontFamily: t.fontDisplay, fontSize: 36, zIndex: 2,
          }),
          txt(t, {
            x: x + 30, y: 800, w: 440, h: 30, content: role,
            fontSize: 18, color: t.accent, letterSpacing: 0.05, zIndex: 2,
          }),
        ];
      }),
    ],
  };
}

function conceptSlide(t: Theme, pid: string): Slide {
  return {
    id: nanoid(),
    presentationId: pid,
    order: 3,
    backgroundColor: t.background,
    backgroundImage: null,
    mobileElements: null,
    elements: [
      shape({ x: 0, y: 0, w: 1100, h: 1080, fill: t.accent, opacity: 0.05, zIndex: 0 }),
      txt(t, {
        x: 120, y: 80, w: 400, h: 40, content: "CONCEPTO",
        fontFamily: t.fontDisplay, fontSize: 48, letterSpacing: 0.05, color: t.accent, zIndex: 2,
      }),
      shape({ x: 120, y: 140, w: 60, h: 3, fill: t.accent, zIndex: 1 }),
      txt(t, {
        x: 1180, y: 200, w: 620, h: 100, content: "El concepto del proyecto",
        fontFamily: t.fontDisplay, fontSize: 56, lineHeight: 1.1, zIndex: 2,
      }),
      txt(t, {
        x: 1180, y: 340, w: 620, h: 400,
        content: "Describe aquí la visión del proyecto, los objetivos principales y el enfoque creativo que propones. Usa este espacio para conectar la idea con el cliente.",
        fontSize: 22, lineHeight: 1.7, zIndex: 2,
      }),
    ],
  };
}

function timelineSlide(t: Theme, pid: string): Slide {
  const stages = ["Investigación", "Concepto", "Diseño", "Desarrollo", "Lanzamiento"];
  return {
    id: nanoid(),
    presentationId: pid,
    order: 4,
    backgroundColor: t.background,
    backgroundImage: null,
    mobileElements: null,
    elements: [
      txt(t, {
        x: 120, y: 80, w: 400, h: 40, content: "PROCESO",
        fontFamily: t.fontDisplay, fontSize: 48, letterSpacing: 0.05, color: t.accent, zIndex: 2,
      }),
      shape({ x: 120, y: 140, w: 60, h: 3, fill: t.accent, zIndex: 1 }),
      shape({ x: 120, y: 520, w: 1680, h: 2, fill: t.accent, opacity: 0.3, zIndex: 1 }),
      ...stages.flatMap((stage, i) => {
        const x = 120 + i * 340;
        return [
          shape({ x: x + 130, y: 508, w: 24, h: 24, fill: t.accent, shape: "circle", zIndex: 2 }),
          txt(t, {
            x, y: 560, w: 300, h: 40, content: `0${i + 1}`,
            fontFamily: t.fontDisplay, fontSize: 48, color: t.accent, textAlign: "center", zIndex: 2,
          }),
          txt(t, {
            x, y: 620, w: 300, h: 30, content: stage,
            fontSize: 20, textAlign: "center", letterSpacing: 0.03, zIndex: 2,
          }),
          txt(t, {
            x, y: 660, w: 300, h: 80, content: "Descripción breve de esta fase del proyecto.",
            fontSize: 14, textAlign: "center", lineHeight: 1.6, opacity: 0.6, zIndex: 2,
          }),
        ];
      }),
    ],
  };
}

function ctaSlide(t: Theme, pid: string): Slide {
  return {
    id: nanoid(),
    presentationId: pid,
    order: 5,
    backgroundColor: t.accent,
    backgroundImage: null,
    mobileElements: null,
    elements: [
      txt(t, {
        x: 200, y: 300, w: 1520, h: 200, content: "¿LISTOS PARA EMPEZAR?",
        fontFamily: t.fontDisplay, fontSize: 120, fontWeight: 400,
        lineHeight: 1.0, textAlign: "center",
        color: t.background, zIndex: 2,
      }),
      txt(t, {
        x: 200, y: 540, w: 1520, h: 60, content: "Contacto — hello@tuestudio.com",
        fontSize: 24, textAlign: "center", letterSpacing: 0.1,
        color: t.background, opacity: 0.7, zIndex: 2,
      }),
      shape({ x: 910, y: 630, w: 100, h: 3, fill: t.background, opacity: 0.5, zIndex: 1 }),
    ],
  };
}

export function generateTemplate(themeKey: string, presentationId: string): Slide[] {
  const t = THEMES[themeKey];
  if (!t) return [];

  return [
    coverSlide(t, presentationId),
    aboutSlide(t, presentationId),
    teamSlide(t, presentationId),
    conceptSlide(t, presentationId),
    timelineSlide(t, presentationId),
    ctaSlide(t, presentationId),
  ];
}
