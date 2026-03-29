import type { Slide, TextElement, ShapeElement, ImageElement } from "@/types/elements";
import { THEMES, type Theme } from "./themes";

const IMG = {
  portrait1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80&auto=format&fit=crop",
  portrait2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
  portrait3: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop",
  arch1: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop",
  arch2: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
  abstract1: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&auto=format&fit=crop",
  abstract2: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
  product1: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
  product2: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80&auto=format&fit=crop",
  nature1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop",
  nature2: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop",
};

function isDark(themeKey: string) {
  return themeKey === "dark-editorial" || themeKey === "monochrome";
}

function txt(
  t: Theme,
  o: Partial<TextElement> & { x: number; y: number; w: number; h: number; content: string }
): TextElement {
  return {
    id: crypto.randomUUID(), type: "text", rotation: 0, opacity: 1, zIndex: 1, locked: false,
    fontFamily: t.fontBody, fontSize: 24, fontWeight: 400, lineHeight: 1.5,
    letterSpacing: 0, color: t.text, textAlign: "left", verticalAlign: "top",
    ...o,
  };
}

function sh(
  o: Partial<ShapeElement> & { x: number; y: number; w: number; h: number }
): ShapeElement {
  return {
    id: crypto.randomUUID(), type: "shape", rotation: 0, opacity: 1, zIndex: 0, locked: false,
    shape: "rect", fill: "#cccccc", stroke: "transparent", strokeWidth: 0, borderRadius: 0,
    ...o,
  };
}

function img(
  src: string, x: number, y: number, w: number, h: number, themeKey: string, z = 1
): ImageElement {
  return {
    id: crypto.randomUUID(), type: "image", x, y, w, h,
    rotation: 0, opacity: 1, zIndex: z, locked: false,
    src, objectFit: "cover",
    filter: isDark(themeKey) ? "grayscale(100%)" : "",
    isPlaceholder: true,
  };
}

function pageNum(t: Theme, num: string): TextElement {
  return txt(t, {
    x: 1820, y: 1030, w: 60, h: 30, content: num,
    fontSize: 12, letterSpacing: 0.15, textAlign: "right", opacity: 0.35, zIndex: 1,
  });
}

function coverSlide(t: Theme, pid: string, tk: string): Omit<Slide, "id"> {
  return {
    presentationId: pid, order: 0, transition: "zoom",
    backgroundColor: t.background, backgroundImage: null, mobileElements: null, notes: "",
    elements: [
      txt(t, {
        x: 100, y: 60, w: 500, h: 30, content: "MARCH 2026  ·  CREATIVE BRIEF",
        fontSize: 11, letterSpacing: 0.25, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 100, y: 140, w: 800, h: 220, content: "2026",
        fontFamily: t.fontDisplay, fontSize: 240, fontWeight: 400,
        lineHeight: 0.9, letterSpacing: -0.02, color: t.accent, zIndex: 3,
      }),
      txt(t, {
        x: 100, y: 370, w: 800, h: 130, content: "PROJECT\nPROPOSAL",
        fontFamily: t.fontDisplay, fontSize: 100, fontWeight: 400,
        lineHeight: 1.05, letterSpacing: 0.03, zIndex: 3,
      }),
      sh({ x: 100, y: 530, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 100, y: 560, w: 500, h: 80,
        content: "A creative approach to visual storytelling and brand identity.",
        fontSize: 18, lineHeight: 1.6, opacity: 0.6, zIndex: 2,
      }),
      txt(t, {
        x: 100, y: 980, w: 300, h: 20, content: "YOUR STUDIO NAME",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.35, zIndex: 2,
      }),
      img(IMG.arch1, 1020, 80, 800, 920, tk, 1),
      pageNum(t, "01"),
    ],
  };
}

function aboutSlide(t: Theme, pid: string, tk: string): Omit<Slide, "id"> {
  return {
    presentationId: pid, order: 1, transition: "fade",
    backgroundColor: t.background, backgroundImage: null, mobileElements: null, notes: "",
    elements: [
      txt(t, {
        x: 1780, y: 150, w: 700, h: 60, content: "ABOUT",
        fontFamily: t.fontDisplay, fontSize: 120, letterSpacing: 0.05,
        color: t.accent, opacity: 0.12, rotation: 90, zIndex: 0,
      }),
      txt(t, {
        x: 100, y: 100, w: 140, h: 40, content: "ABOUT US",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      sh({ x: 100, y: 150, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 100, y: 200, w: 700, h: 60, content: "WE CREATE\nEDITORIAL MAGIC",
        fontFamily: t.fontDisplay, fontSize: 64, lineHeight: 1.05, zIndex: 3,
      }),
      txt(t, {
        x: 100, y: 340, w: 650, h: 200,
        content: "We are a creative studio specializing in editorial design, brand identity, and visual storytelling. Our approach combines expressive typography with asymmetric layouts to create memorable visual experiences that connect brands with their audiences.",
        fontSize: 17, lineHeight: 1.8, opacity: 0.65, zIndex: 2,
      }),
      txt(t, { x: 100, y: 600, w: 200, h: 80, content: "10+", fontFamily: t.fontDisplay, fontSize: 72, color: t.accent, zIndex: 3 }),
      txt(t, { x: 100, y: 680, w: 200, h: 25, content: "YEARS", fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 350, y: 600, w: 200, h: 80, content: "200+", fontFamily: t.fontDisplay, fontSize: 72, color: t.accent, zIndex: 3 }),
      txt(t, { x: 350, y: 680, w: 200, h: 25, content: "PROJECTS", fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 600, y: 600, w: 200, h: 80, content: "50+", fontFamily: t.fontDisplay, fontSize: 72, color: t.accent, zIndex: 3 }),
      txt(t, { x: 600, y: 680, w: 200, h: 25, content: "CLIENTS", fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
      img(IMG.portrait1, 1000, 100, 680, 880, tk, 1),
      txt(t, {
        x: 100, y: 820, w: 650, h: 60,
        content: "\"Design is not just what it looks like. Design is how it works.\"",
        fontSize: 22, lineHeight: 1.5, fontWeight: 400, opacity: 0.4, zIndex: 2,
      }),
      sh({ x: 100, y: 800, w: 30, h: 3, fill: t.accent, opacity: 0.5, zIndex: 1 }),
      pageNum(t, "02"),
    ],
  };
}

function teamSlide(t: Theme, pid: string, tk: string): Omit<Slide, "id"> {
  const roles = ["Creative Director", "Senior Designer", "Digital Strategist"];
  const names = ["Alex Morgan", "Sam Rivera", "Jordan Chen"];
  const photos = [IMG.portrait1, IMG.portrait2, IMG.portrait3];
  return {
    presentationId: pid, order: 2, transition: "slide-left",
    backgroundColor: t.background, backgroundImage: null, mobileElements: null, notes: "",
    elements: [
      txt(t, {
        x: 100, y: 100, w: 500, h: 50, content: "OUR TEAM  →",
        fontFamily: t.fontDisplay, fontSize: 52, letterSpacing: 0.02, zIndex: 3,
      }),
      sh({ x: 100, y: 165, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 100, y: 190, w: 500, h: 50,
        content: "The people behind every project.",
        fontSize: 17, opacity: 0.5, lineHeight: 1.6, zIndex: 2,
      }),
      ...names.flatMap((name, i) => {
        const x = 100 + i * 560;
        return [
          img(photos[i], x, 300, 480, 480, tk, 1),
          txt(t, {
            x, y: 810, w: 480, h: 35, content: name.toUpperCase(),
            fontFamily: t.fontDisplay, fontSize: 28, letterSpacing: 0.05, zIndex: 3,
          }),
          txt(t, {
            x, y: 850, w: 480, h: 25, content: roles[i],
            fontSize: 13, letterSpacing: 0.15, color: t.accent, opacity: 0.7, zIndex: 2,
          }),
          txt(t, {
            x, y: 885, w: 480, h: 60,
            content: "Brief description of experience and role within the creative team.",
            fontSize: 13, lineHeight: 1.6, opacity: 0.4, zIndex: 2,
          }),
        ];
      }),
      txt(t, { x: 1700, y: 100, w: 100, h: 30, content: "✦", fontSize: 20, color: t.accent, opacity: 0.3, textAlign: "right", zIndex: 1 }),
      pageNum(t, "03"),
    ],
  };
}

function conceptSlide(t: Theme, pid: string, tk: string): Omit<Slide, "id"> {
  return {
    presentationId: pid, order: 3, transition: "fade",
    backgroundColor: t.background, backgroundImage: null, mobileElements: null, notes: "",
    elements: [
      txt(t, { x: 100, y: 100, w: 140, h: 25, content: "04 / CONCEPT", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, {
        x: 100, y: 180, w: 750, h: 180, content: "PROJECT\nCONCEPT",
        fontFamily: t.fontDisplay, fontSize: 110, lineHeight: 1.0, letterSpacing: 0.01, zIndex: 3,
      }),
      sh({ x: 100, y: 400, w: 80, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 100, y: 440, w: 700, h: 160,
        content: "The creative vision merges editorial aesthetics with modern digital experiences. Every element is carefully positioned to guide the viewer's eye through a narrative that speaks to the brand's core values.",
        fontSize: 17, lineHeight: 1.8, opacity: 0.6, zIndex: 2,
      }),
      txt(t, { x: 100, y: 660, w: 300, h: 30, content: "SCOPE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 100, y: 700, w: 300, h: 100, content: "Brand Identity\nEditorial Design\nDigital Experience", fontSize: 15, lineHeight: 1.8, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 450, y: 660, w: 300, h: 30, content: "TIMELINE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 450, y: 700, w: 300, h: 100, content: "Phase 1 — 4 weeks\nPhase 2 — 6 weeks\nPhase 3 — 2 weeks", fontSize: 15, lineHeight: 1.8, opacity: 0.5, zIndex: 2 }),
      img(IMG.abstract1, 950, 80, 870, 920, tk, 1),
      pageNum(t, "04"),
    ],
  };
}

function timelineSlide(t: Theme, pid: string, tk: string): Omit<Slide, "id"> {
  const stages = [
    { num: "01", title: "RESEARCH", desc: "Market analysis, competitor audit, and user research to define the strategic foundation." },
    { num: "02", title: "CONCEPT", desc: "Creative exploration, moodboards, and initial design directions for review." },
    { num: "03", title: "DESIGN", desc: "Full design development across all touchpoints with iterative feedback." },
    { num: "04", title: "DEVELOP", desc: "Technical implementation, testing, and quality assurance." },
    { num: "05", title: "LAUNCH", desc: "Final delivery, deployment, and post-launch optimization." },
  ];
  return {
    presentationId: pid, order: 4, transition: "slide-up",
    backgroundColor: t.background, backgroundImage: null, mobileElements: null, notes: "",
    elements: [
      txt(t, {
        x: -20, y: 200, w: 900, h: 100, content: "STAGES",
        fontFamily: t.fontDisplay, fontSize: 140, letterSpacing: 0.05,
        color: t.accent, opacity: 0.08, rotation: 90, zIndex: 0,
      }),
      txt(t, { x: 140, y: 100, w: 600, h: 50, content: "PROJECT STAGES", fontFamily: t.fontDisplay, fontSize: 52, letterSpacing: 0.02, zIndex: 3 }),
      sh({ x: 140, y: 165, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      sh({ x: 140, y: 260, w: 1640, h: 1, fill: t.accent, opacity: 0.15, zIndex: 1 }),
      ...stages.flatMap((s, i) => {
        const x = 140 + i * 330;
        return [
          txt(t, { x, y: 280, w: 290, h: 70, content: s.num, fontFamily: t.fontDisplay, fontSize: 64, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 360, w: 290, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 22, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x, y: 400, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x, y: 420, w: 290, h: 100, content: s.desc, fontSize: 13, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.arch2, 140, 600, 760, 400, tk, 1),
      img(IMG.product1, 940, 600, 420, 400, tk, 1),
      img(IMG.nature1, 1400, 600, 380, 400, tk, 1),
      pageNum(t, "05"),
    ],
  };
}

function ctaSlide(t: Theme, pid: string, tk: string): Omit<Slide, "id"> {
  return {
    presentationId: pid, order: 5, transition: "zoom",
    backgroundColor: t.background, backgroundImage: null, mobileElements: null, notes: "",
    elements: [
      img(IMG.abstract2, 0, 0, 340, 520, tk, 1),
      img(IMG.nature2, 360, 0, 340, 520, tk, 1),
      img(IMG.product2, 0, 540, 340, 540, tk, 1),
      img(IMG.arch1, 360, 540, 340, 540, tk, 1),
      txt(t, { x: 800, y: 100, w: 200, h: 30, content: "PROGRESS  →", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 3 }),
      txt(t, {
        x: 800, y: 200, w: 1000, h: 250, content: "LET'S\nCREATE\nTOGETHER",
        fontFamily: t.fontDisplay, fontSize: 120, lineHeight: 1.0, letterSpacing: -0.01, zIndex: 4,
      }),
      sh({ x: 800, y: 490, w: 80, h: 3, fill: t.accent, zIndex: 3 }),
      txt(t, {
        x: 800, y: 530, w: 600, h: 80,
        content: "Ready to start your next project? Let's discuss how we can bring your vision to life.",
        fontSize: 17, lineHeight: 1.8, opacity: 0.5, zIndex: 3,
      }),
      txt(t, { x: 800, y: 700, w: 400, h: 25, content: "CONTACT", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 3 }),
      txt(t, { x: 800, y: 735, w: 400, h: 30, content: "hello@yourstudio.com", fontSize: 20, color: t.accent, zIndex: 3 }),
      txt(t, { x: 800, y: 780, w: 400, h: 30, content: "yourstudio.com", fontSize: 20, color: t.accent, opacity: 0.6, zIndex: 3 }),
      sh({ x: 800, y: 880, w: 300, h: 1, fill: t.text, opacity: 0.1, zIndex: 2 }),
      txt(t, { x: 800, y: 900, w: 300, h: 20, content: "© 2026 YOUR STUDIO", fontSize: 10, letterSpacing: 0.3, opacity: 0.25, zIndex: 2 }),
      pageNum(t, "06"),
    ],
  };
}

export function generateTemplate(themeKey: string, presentationId: string): Omit<Slide, "id">[] {
  const t = THEMES[themeKey];
  if (!t) return [];

  return [
    coverSlide(t, presentationId, themeKey),
    aboutSlide(t, presentationId, themeKey),
    teamSlide(t, presentationId, themeKey),
    conceptSlide(t, presentationId, themeKey),
    timelineSlide(t, presentationId, themeKey),
    ctaSlide(t, presentationId, themeKey),
  ];
}
