import type { Slide, TextElement, ShapeElement, ImageElement } from "@/types/elements";
import type { Theme } from "./themes";
import { generateTemplate } from "./generator";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  slideCount: number;
  generate: (theme: Theme, themeKey: string, presentationId: string) => Omit<Slide, "id">[];
}

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

function slide(
  pid: string, order: number, bg: string, transition: Slide["transition"],
  elements: Slide["elements"]
): Omit<Slide, "id"> {
  return {
    presentationId: pid, order, transition,
    backgroundColor: bg, backgroundImage: null, mobileElements: null, notes: "",
    elements,
  };
}

// ---------------------------------------------------------------------------
// PITCH DECK
// ---------------------------------------------------------------------------

function pitchDeck(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    // Slide 1 — Cover: big company name + tagline
    slide(pid, 0, t.background, "zoom", [
      sh({ x: 1400, y: -200, w: 700, h: 700, fill: t.accent, opacity: 0.06, zIndex: 0, shape: "circle" }),
      sh({ x: -100, y: 800, w: 400, h: 400, fill: t.accent, opacity: 0.04, zIndex: 0, shape: "circle" }),
      txt(t, {
        x: 120, y: 60, w: 400, h: 25, content: "INVESTOR DECK  ·  2026",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 220, w: 1200, h: 280, content: "ACME\nSTUDIOS",
        fontFamily: t.fontDisplay, fontSize: 200, fontWeight: 400,
        lineHeight: 0.95, letterSpacing: -0.01, zIndex: 3,
      }),
      sh({ x: 120, y: 530, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 120, y: 570, w: 700, h: 60,
        content: "Redefining how brands communicate through\neditorial-quality digital experiences.",
        fontSize: 20, lineHeight: 1.7, opacity: 0.55, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 950, w: 300, h: 20, content: "CONFIDENTIAL",
        fontSize: 10, letterSpacing: 0.35, opacity: 0.25, zIndex: 1,
      }),
      img(IMG.arch2, 1200, 160, 600, 780, tk, 1),
      pageNum(t, "01"),
    ]),

    // Slide 2 — Problem statement
    slide(pid, 1, t.background, "fade", [
      txt(t, {
        x: 120, y: 100, w: 200, h: 25, content: "THE PROBLEM",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      sh({ x: 120, y: 140, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 120, y: 200, w: 1000, h: 200, content: "BRANDS\nARE INVISIBLE",
        fontFamily: t.fontDisplay, fontSize: 120, lineHeight: 1.0,
        letterSpacing: 0.01, zIndex: 3,
      }),
      txt(t, {
        x: 120, y: 450, w: 700, h: 160,
        content: "In a world of infinite content, 73% of brand presentations fail to engage their audience past the second slide. Generic templates and uninspired layouts cost companies millions in lost opportunities every year.",
        fontSize: 18, lineHeight: 1.8, opacity: 0.6, zIndex: 2,
      }),
      sh({ x: 120, y: 680, w: 700, h: 1, fill: t.text, opacity: 0.08, zIndex: 1 }),
      txt(t, {
        x: 120, y: 710, w: 300, h: 80, content: "$4.2B",
        fontFamily: t.fontDisplay, fontSize: 64, color: t.accent, zIndex: 3,
      }),
      txt(t, {
        x: 120, y: 790, w: 300, h: 25, content: "LOST ANNUALLY TO POOR DECKS",
        fontSize: 11, letterSpacing: 0.2, opacity: 0.45, zIndex: 2,
      }),
      txt(t, {
        x: 500, y: 710, w: 300, h: 80, content: "73%",
        fontFamily: t.fontDisplay, fontSize: 64, color: t.accent, zIndex: 3,
      }),
      txt(t, {
        x: 500, y: 790, w: 300, h: 25, content: "DROP OFF AFTER SLIDE 2",
        fontSize: 11, letterSpacing: 0.2, opacity: 0.45, zIndex: 2,
      }),
      img(IMG.abstract1, 1100, 100, 700, 880, tk, 1),
      pageNum(t, "02"),
    ]),

    // Slide 3 — Solution: split layout
    slide(pid, 2, t.background, "slide-left", [
      img(IMG.product1, 0, 0, 900, 1080, tk, 1),
      txt(t, {
        x: 1000, y: 100, w: 200, h: 25, content: "OUR SOLUTION",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      sh({ x: 1000, y: 140, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 1000, y: 200, w: 800, h: 160, content: "EDITORIAL\nPRESENTATIONS",
        fontFamily: t.fontDisplay, fontSize: 80, lineHeight: 1.05, zIndex: 3,
      }),
      txt(t, {
        x: 1000, y: 410, w: 750, h: 180,
        content: "A platform that transforms every deck into a magazine-quality experience. AI-assisted layouts, curated typography, and real-time collaboration — designed for teams that refuse to be forgettable.",
        fontSize: 17, lineHeight: 1.8, opacity: 0.6, zIndex: 2,
      }),
      txt(t, { x: 1000, y: 660, w: 350, h: 30, content: "✦  Editorial-grade design engine", fontSize: 14, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 1000, y: 705, w: 350, h: 30, content: "✦  Real-time team collaboration", fontSize: 14, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 1000, y: 750, w: 350, h: 30, content: "✦  One-click brand consistency", fontSize: 14, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 1000, y: 795, w: 350, h: 30, content: "✦  Mobile-optimized sharing", fontSize: 14, opacity: 0.5, zIndex: 2 }),
      pageNum(t, "03"),
    ]),

    // Slide 4 — Market / Numbers
    slide(pid, 3, t.background, "slide-up", [
      txt(t, {
        x: 120, y: 100, w: 200, h: 25, content: "MARKET SIZE",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 160, w: 900, h: 80, content: "THE OPPORTUNITY",
        fontFamily: t.fontDisplay, fontSize: 72, letterSpacing: 0.02, zIndex: 3,
      }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.08, zIndex: 1 }),
      ...[
        { num: "$12B", label: "TOTAL ADDRESSABLE\nMARKET", desc: "Global presentation software market growing at 14% CAGR" },
        { num: "340M", label: "PRESENTATIONS\nCREATED DAILY", desc: "Across enterprise, startup, education, and creative sectors" },
        { num: "8.2x", label: "ENGAGEMENT\nMULTIPLIER", desc: "Editorial layouts outperform standard templates consistently" },
        { num: "92%", label: "RETENTION\nRATE", desc: "Users who complete onboarding become weekly active users" },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          txt(t, { x, y: 300, w: 380, h: 100, content: s.num, fontFamily: t.fontDisplay, fontSize: 80, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 400, w: 380, h: 50, content: s.label, fontSize: 11, letterSpacing: 0.25, opacity: 0.45, lineHeight: 1.5, zIndex: 2 }),
          sh({ x, y: 470, w: 40, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x, y: 490, w: 380, h: 80, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.nature1, 120, 640, 840, 380, tk, 1),
      img(IMG.arch1, 1000, 640, 800, 380, tk, 1),
      pageNum(t, "04"),
    ]),

    // Slide 5 — CTA / Contact
    slide(pid, 4, t.background, "zoom", [
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: t.accent, opacity: 0.04, zIndex: 0 }),
      txt(t, {
        x: 120, y: 100, w: 200, h: 25, content: "NEXT STEPS",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 220, w: 1200, h: 260, content: "LET'S BUILD\nTHE FUTURE",
        fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95,
        letterSpacing: -0.01, zIndex: 3,
      }),
      sh({ x: 120, y: 520, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 120, y: 570, w: 700, h: 60,
        content: "We're raising a $5M Series A to scale our editorial platform globally.\nSchedule a deep-dive with our founding team.",
        fontSize: 18, lineHeight: 1.8, opacity: 0.55, zIndex: 2,
      }),
      txt(t, { x: 120, y: 720, w: 300, h: 20, content: "CONTACT", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 755, w: 400, h: 30, content: "invest@acmestudios.com", fontSize: 22, color: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 800, w: 400, h: 30, content: "acmestudios.com/investors", fontSize: 18, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 870, w: 300, h: 20, content: "FOUNDED", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 900, w: 200, h: 30, content: "2024  ·  San Francisco", fontSize: 14, opacity: 0.5, zIndex: 2 }),
      sh({ x: 120, y: 960, w: 400, h: 1, fill: t.text, opacity: 0.08, zIndex: 1 }),
      txt(t, { x: 120, y: 975, w: 400, h: 20, content: "© 2026 ACME STUDIOS  ·  CONFIDENTIAL", fontSize: 10, letterSpacing: 0.3, opacity: 0.2, zIndex: 1 }),
      img(IMG.portrait1, 1300, 120, 500, 600, tk, 1),
      sh({ x: 1300, y: 750, w: 500, h: 3, fill: t.accent, opacity: 0.3, zIndex: 1 }),
      txt(t, { x: 1300, y: 775, w: 500, h: 30, content: "ALEX MORGAN  ·  CEO & FOUNDER", fontSize: 12, letterSpacing: 0.2, opacity: 0.5, zIndex: 2 }),
      pageNum(t, "05"),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// PORTFOLIO
// ---------------------------------------------------------------------------

function portfolio(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    // Slide 1 — Cover: name + year + large image
    slide(pid, 0, t.background, "fade", [
      img(IMG.nature2, 600, 0, 1320, 1080, tk, 1),
      sh({ x: 0, y: 0, w: 640, h: 1080, fill: t.background, zIndex: 2 }),
      txt(t, {
        x: 80, y: 80, w: 500, h: 25, content: "SELECTED WORKS  ·  2024 — 2026",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 3,
      }),
      txt(t, {
        x: 80, y: 300, w: 520, h: 320, content: "PORT\nFOLIO",
        fontFamily: t.fontDisplay, fontSize: 150, lineHeight: 0.95,
        letterSpacing: 0.02, zIndex: 3,
      }),
      sh({ x: 80, y: 640, w: 80, h: 4, fill: t.accent, zIndex: 3 }),
      txt(t, {
        x: 80, y: 680, w: 480, h: 60,
        content: "A curated collection of creative direction,\neditorial design, and visual identity projects.",
        fontSize: 16, lineHeight: 1.7, opacity: 0.55, zIndex: 3,
      }),
      txt(t, {
        x: 80, y: 960, w: 400, h: 25, content: "JORDAN CHEN",
        fontFamily: t.fontDisplay, fontSize: 20, letterSpacing: 0.15, opacity: 0.6, zIndex: 3,
      }),
      txt(t, {
        x: 80, y: 995, w: 400, h: 20, content: "Creative Director & Designer",
        fontSize: 12, letterSpacing: 0.1, opacity: 0.35, zIndex: 3,
      }),
      pageNum(t, "01"),
    ]),

    // Slide 2 — Full-bleed image with caption overlay
    slide(pid, 1, t.background, "slide-left", [
      img(IMG.arch1, 0, 0, 1920, 1080, tk, 1),
      sh({ x: 0, y: 760, w: 1920, h: 320, fill: "#000000", opacity: 0.55, zIndex: 2 }),
      txt(t, {
        x: 100, y: 820, w: 600, h: 60, content: "MERIDIAN HOTEL",
        fontFamily: t.fontDisplay, fontSize: 48, color: "#ffffff",
        letterSpacing: 0.05, zIndex: 3,
      }),
      sh({ x: 100, y: 890, w: 50, h: 3, fill: t.accent, zIndex: 3 }),
      txt(t, {
        x: 100, y: 910, w: 800, h: 50,
        content: "Brand identity and environmental graphics for a luxury boutique hotel in Barcelona. Awarded European Design Prize 2025.",
        fontSize: 15, lineHeight: 1.7, color: "#ffffff", opacity: 0.7, zIndex: 3,
      }),
      txt(t, {
        x: 100, y: 975, w: 400, h: 20, content: "BRANDING  ·  ENVIRONMENTAL  ·  2025",
        fontSize: 10, letterSpacing: 0.3, color: "#ffffff", opacity: 0.4, zIndex: 3,
      }),
      txt(t, {
        x: 1700, y: 820, w: 120, h: 60, content: "01",
        fontFamily: t.fontDisplay, fontSize: 48, color: "#ffffff",
        opacity: 0.3, textAlign: "right", zIndex: 3,
      }),
    ]),

    // Slide 3 — Two projects side by side
    slide(pid, 2, t.background, "fade", [
      txt(t, {
        x: 100, y: 60, w: 400, h: 25, content: "SELECTED PROJECTS",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      img(IMG.product1, 100, 120, 840, 560, tk, 1),
      txt(t, {
        x: 100, y: 710, w: 840, h: 40, content: "NOVA COSMETICS",
        fontFamily: t.fontDisplay, fontSize: 32, letterSpacing: 0.05, zIndex: 3,
      }),
      sh({ x: 100, y: 758, w: 40, h: 2, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 100, y: 775, w: 840, h: 50,
        content: "Product photography and packaging design for a sustainable beauty brand. Minimal approach, maximum impact.",
        fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2,
      }),
      txt(t, { x: 100, y: 840, w: 400, h: 20, content: "PACKAGING  ·  PHOTOGRAPHY  ·  2024", fontSize: 10, letterSpacing: 0.25, opacity: 0.35, zIndex: 2 }),
      img(IMG.abstract2, 980, 120, 840, 560, tk, 1),
      txt(t, {
        x: 980, y: 710, w: 840, h: 40, content: "LUMEN GALLERY",
        fontFamily: t.fontDisplay, fontSize: 32, letterSpacing: 0.05, zIndex: 3,
      }),
      sh({ x: 980, y: 758, w: 40, h: 2, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 980, y: 775, w: 840, h: 50,
        content: "Visual identity and exhibition catalog for a contemporary art gallery. Bold typography meets generous whitespace.",
        fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2,
      }),
      txt(t, { x: 980, y: 840, w: 400, h: 20, content: "IDENTITY  ·  EDITORIAL  ·  2025", fontSize: 10, letterSpacing: 0.25, opacity: 0.35, zIndex: 2 }),
      pageNum(t, "03"),
    ]),

    // Slide 4 — Skills / Services grid
    slide(pid, 3, t.background, "slide-up", [
      txt(t, {
        x: 100, y: 80, w: 500, h: 25, content: "CAPABILITIES",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 100, y: 130, w: 800, h: 70, content: "WHAT I DO",
        fontFamily: t.fontDisplay, fontSize: 64, letterSpacing: 0.02, zIndex: 3,
      }),
      sh({ x: 100, y: 215, w: 60, h: 3, fill: t.accent, zIndex: 2 }),
      // Grid of 4 service cards
      ...[
        { title: "BRAND\nIDENTITY", desc: "Logos, visual systems, brand guidelines, and strategic positioning that define who you are.", icon: "circle" as const },
        { title: "EDITORIAL\nDESIGN", desc: "Magazines, catalogs, books, and publications with meticulous attention to typographic detail.", icon: "diamond" as const },
        { title: "DIGITAL\nEXPERIENCE", desc: "Websites, presentations, and interactive media that bring editorial aesthetics to the screen.", icon: "hexagon" as const },
        { title: "ART\nDIRECTION", desc: "Photography direction, visual concepts, and creative campaigns from ideation to execution.", icon: "star" as const },
      ].flatMap((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 100 + col * 900;
        const y = 300 + row * 350;
        return [
          sh({ x, y, w: 50, h: 50, fill: t.accent, opacity: 0.12, zIndex: 1, shape: s.icon }),
          txt(t, {
            x: x + 80, y, w: 700, h: 70, content: s.title,
            fontFamily: t.fontDisplay, fontSize: 36, lineHeight: 1.1, zIndex: 3,
          }),
          txt(t, {
            x: x + 80, y: y + 85, w: 650, h: 60, content: s.desc,
            fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2,
          }),
          sh({ x: x + 80, y: y + 160, w: 30, h: 2, fill: t.accent, opacity: 0.3, zIndex: 2 }),
        ];
      }),
      pageNum(t, "04"),
    ]),

    // Slide 5 — Contact
    slide(pid, 4, t.background, "zoom", [
      txt(t, {
        x: 120, y: 300, w: 1000, h: 160, content: "LET'S WORK\nTOGETHER",
        fontFamily: t.fontDisplay, fontSize: 100, lineHeight: 1.0, zIndex: 3,
      }),
      sh({ x: 120, y: 490, w: 80, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 120, y: 540, w: 600, h: 50,
        content: "Available for freelance and contract projects starting Q2 2026.",
        fontSize: 17, lineHeight: 1.7, opacity: 0.5, zIndex: 2,
      }),
      txt(t, { x: 120, y: 650, w: 200, h: 20, content: "EMAIL", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 680, w: 400, h: 30, content: "jordan@chendesign.com", fontSize: 22, color: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 740, w: 200, h: 20, content: "WEBSITE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 770, w: 400, h: 30, content: "chendesign.com", fontSize: 22, opacity: 0.6, zIndex: 2 }),
      txt(t, { x: 120, y: 840, w: 200, h: 20, content: "SOCIAL", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 870, w: 400, h: 30, content: "@jordanchen.design", fontSize: 18, opacity: 0.45, zIndex: 2 }),
      sh({ x: 120, y: 950, w: 500, h: 1, fill: t.text, opacity: 0.08, zIndex: 1 }),
      txt(t, { x: 120, y: 970, w: 500, h: 20, content: "© 2026 JORDAN CHEN  ·  ALL RIGHTS RESERVED", fontSize: 10, letterSpacing: 0.3, opacity: 0.2, zIndex: 1 }),
      img(IMG.portrait3, 1300, 100, 520, 700, tk, 1),
      sh({ x: 1300, y: 830, w: 520, h: 3, fill: t.accent, opacity: 0.2, zIndex: 1 }),
      txt(t, { x: 1300, y: 860, w: 520, h: 25, content: "BASED IN LONDON  ·  WORKING GLOBALLY", fontSize: 11, letterSpacing: 0.2, opacity: 0.4, textAlign: "center", zIndex: 2 }),
      pageNum(t, "05"),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// REPORT
// ---------------------------------------------------------------------------

function report(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    // Slide 1 — Title page
    slide(pid, 0, t.background, "fade", [
      sh({ x: 0, y: 0, w: 8, h: 1080, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 120, y: 80, w: 400, h: 25, content: "FISCAL YEAR 2025",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 200, w: 1000, h: 300, content: "ANNUAL\nREPORT",
        fontFamily: t.fontDisplay, fontSize: 180, lineHeight: 0.9,
        letterSpacing: 0.01, zIndex: 3,
      }),
      txt(t, {
        x: 120, y: 530, w: 200, h: 80, content: "2025",
        fontFamily: t.fontDisplay, fontSize: 72, color: t.accent, zIndex: 3,
      }),
      sh({ x: 120, y: 630, w: 120, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 120, y: 670, w: 600, h: 60,
        content: "A year of growth, innovation, and meaningful impact\nacross all divisions and markets.",
        fontSize: 17, lineHeight: 1.7, opacity: 0.55, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 960, w: 500, h: 20, content: "ACME CORPORATION  ·  PUBLISHED MARCH 2026",
        fontSize: 10, letterSpacing: 0.3, opacity: 0.25, zIndex: 1,
      }),
      img(IMG.arch2, 1100, 80, 720, 920, tk, 1),
      pageNum(t, "01"),
    ]),

    // Slide 2 — Executive summary with quote
    slide(pid, 1, t.background, "slide-left", [
      txt(t, {
        x: 120, y: 100, w: 300, h: 25, content: "EXECUTIVE SUMMARY",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      sh({ x: 120, y: 140, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      sh({ x: 120, y: 220, w: 6, h: 140, fill: t.accent, opacity: 0.3, zIndex: 1 }),
      txt(t, {
        x: 160, y: 220, w: 900, h: 140,
        content: "\"This was the year we proved that sustainable growth and bold innovation are not mutually exclusive. Our team delivered extraordinary results.\"",
        fontFamily: t.fontDisplay, fontSize: 36, lineHeight: 1.35,
        opacity: 0.85, zIndex: 3,
      }),
      txt(t, {
        x: 160, y: 380, w: 400, h: 25, content: "— SARAH JOHNSON, CEO",
        fontSize: 12, letterSpacing: 0.2, color: t.accent, opacity: 0.6, zIndex: 2,
      }),
      sh({ x: 120, y: 450, w: 1000, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      txt(t, {
        x: 120, y: 500, w: 500, h: 25, content: "HIGHLIGHTS",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 550, w: 1000, h: 200,
        content: "Fiscal year 2025 marked a transformative period for the organization. Revenue grew by 42% year-over-year, driven by expansion into three new markets and the launch of our editorial platform. We onboarded 1,200 enterprise clients and achieved profitability two quarters ahead of schedule.\n\nOur commitment to design excellence and user experience continued to differentiate us in an increasingly competitive landscape. The team grew from 85 to 140 people across four offices.",
        fontSize: 16, lineHeight: 1.8, opacity: 0.6, zIndex: 2,
      }),
      img(IMG.portrait2, 1350, 100, 450, 580, tk, 1),
      txt(t, { x: 1350, y: 710, w: 450, h: 25, content: "SARAH JOHNSON", fontFamily: t.fontDisplay, fontSize: 18, letterSpacing: 0.1, zIndex: 3 }),
      txt(t, { x: 1350, y: 745, w: 450, h: 20, content: "Chief Executive Officer", fontSize: 12, opacity: 0.45, zIndex: 2 }),
      pageNum(t, "02"),
    ]),

    // Slide 3 — Key metrics: 4 stat boxes
    slide(pid, 2, t.background, "slide-up", [
      txt(t, {
        x: 120, y: 80, w: 300, h: 25, content: "KEY METRICS",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 130, w: 800, h: 70, content: "BY THE NUMBERS",
        fontFamily: t.fontDisplay, fontSize: 64, letterSpacing: 0.02, zIndex: 3,
      }),
      sh({ x: 120, y: 215, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { num: "$48M", label: "REVENUE", desc: "Up 42% from $33.8M in FY2024. Driven by enterprise adoption and platform expansion.", arrow: "↑ 42%" },
        { num: "1,200", label: "ENTERPRISE CLIENTS", desc: "Net new accounts across North America, Europe, and Asia-Pacific markets.", arrow: "↑ 68%" },
        { num: "140", label: "TEAM MEMBERS", desc: "Grew from 85 to 140 across design, engineering, sales, and operations.", arrow: "↑ 65%" },
        { num: "98.7%", label: "UPTIME SLA", desc: "Industry-leading reliability with zero critical incidents over twelve months.", arrow: "→ Stable" },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        const y = 270;
        return [
          sh({ x, y, w: 400, h: 340, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: y + 30, w: 340, h: 100, content: s.num, fontFamily: t.fontDisplay, fontSize: 72, color: t.accent, zIndex: 3 }),
          txt(t, { x: x + 30, y: y + 130, w: 340, h: 25, content: s.label, fontSize: 11, letterSpacing: 0.25, opacity: 0.45, zIndex: 2 }),
          txt(t, { x: x + 30, y: y + 165, w: 80, h: 25, content: s.arrow, fontSize: 13, color: t.accent, opacity: 0.7, zIndex: 2 }),
          sh({ x: x + 30, y: y + 205, w: 30, h: 2, fill: t.accent, opacity: 0.3, zIndex: 2 }),
          txt(t, { x: x + 30, y: y + 225, w: 340, h: 80, content: s.desc, fontSize: 13, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.nature1, 120, 670, 860, 350, tk, 1),
      img(IMG.product2, 1020, 670, 780, 350, tk, 1),
      pageNum(t, "03"),
    ]),

    // Slide 4 — Timeline / milestones
    slide(pid, 3, t.background, "fade", [
      txt(t, {
        x: 120, y: 80, w: 300, h: 25, content: "MILESTONES",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 120, y: 130, w: 800, h: 70, content: "YEAR IN REVIEW",
        fontFamily: t.fontDisplay, fontSize: 64, letterSpacing: 0.02, zIndex: 3,
      }),
      sh({ x: 120, y: 260, w: 1680, h: 2, fill: t.accent, opacity: 0.15, zIndex: 1 }),
      ...[
        { q: "Q1", title: "SERIES B CLOSE", desc: "Raised $22M led by Sequoia Capital. Valued at $180M pre-money." },
        { q: "Q2", title: "PLATFORM LAUNCH", desc: "Launched editorial presentation engine. 10K signups in first week." },
        { q: "Q3", title: "APAC EXPANSION", desc: "Opened Tokyo and Singapore offices. Hired 30 new team members." },
        { q: "Q4", title: "PROFITABILITY", desc: "Achieved positive EBITDA two quarters ahead of projected timeline." },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          sh({ x: x + 200, y: 250, w: 16, h: 16, fill: t.accent, shape: "circle", zIndex: 3 }),
          txt(t, { x, y: 310, w: 400, h: 50, content: s.q, fontFamily: t.fontDisplay, fontSize: 48, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 375, w: 400, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 22, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x, y: 415, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x, y: 435, w: 380, h: 80, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.abstract1, 120, 580, 1680, 420, tk, 1),
      pageNum(t, "04"),
    ]),

    // Slide 5 — Thank you / next steps
    slide(pid, 4, t.background, "zoom", [
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: t.accent, opacity: 0.03, zIndex: 0 }),
      sh({ x: 0, y: 0, w: 8, h: 1080, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 200, y: 200, w: 1200, h: 280, content: "THANK\nYOU",
        fontFamily: t.fontDisplay, fontSize: 180, lineHeight: 0.9, zIndex: 3,
      }),
      sh({ x: 200, y: 510, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 200, y: 560, w: 700, h: 25, content: "LOOKING AHEAD",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2,
      }),
      txt(t, {
        x: 200, y: 600, w: 700, h: 120,
        content: "In 2026, we will focus on deepening enterprise relationships, launching our AI-assisted design tools, and expanding into Latin American markets. We remain committed to building the future of visual communication.",
        fontSize: 17, lineHeight: 1.8, opacity: 0.6, zIndex: 2,
      }),
      txt(t, { x: 200, y: 780, w: 400, h: 20, content: "INVESTOR RELATIONS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 200, y: 810, w: 400, h: 30, content: "ir@acmecorp.com", fontSize: 20, color: t.accent, zIndex: 3 }),
      txt(t, { x: 200, y: 855, w: 400, h: 30, content: "acmecorp.com/investors", fontSize: 16, opacity: 0.5, zIndex: 2 }),
      sh({ x: 200, y: 940, w: 400, h: 1, fill: t.text, opacity: 0.08, zIndex: 1 }),
      txt(t, { x: 200, y: 960, w: 500, h: 20, content: "© 2026 ACME CORPORATION  ·  ALL RIGHTS RESERVED", fontSize: 10, letterSpacing: 0.3, opacity: 0.2, zIndex: 1 }),
      img(IMG.arch1, 1200, 200, 600, 400, tk, 1),
      img(IMG.abstract2, 1200, 630, 600, 350, tk, 1),
      pageNum(t, "05"),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// MINIMAL
// ---------------------------------------------------------------------------

function minimal(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    // Slide 1 — Just the title, centered, lots of whitespace
    slide(pid, 0, t.background, "fade", [
      txt(t, {
        x: 260, y: 380, w: 1400, h: 160, content: "THE QUIET\nPRESENTATION",
        fontFamily: t.fontDisplay, fontSize: 100, lineHeight: 1.05,
        textAlign: "center", letterSpacing: 0.02, zIndex: 3,
      }),
      sh({ x: 910, y: 560, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 560, y: 600, w: 800, h: 30, content: "2026",
        fontSize: 14, textAlign: "center", letterSpacing: 0.4, opacity: 0.3, zIndex: 1,
      }),
    ]),

    // Slide 2 — One big statement centered
    slide(pid, 1, t.background, "fade", [
      txt(t, {
        x: 200, y: 300, w: 1520, h: 200, content: "LESS IS MORE",
        fontFamily: t.fontDisplay, fontSize: 140, textAlign: "center",
        lineHeight: 1.0, letterSpacing: -0.01, zIndex: 3,
      }),
      sh({ x: 910, y: 520, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 460, y: 570, w: 1000, h: 60,
        content: "Every element exists for a reason.\nNothing more, nothing less.",
        fontSize: 18, lineHeight: 1.8, textAlign: "center", opacity: 0.45, zIndex: 2,
      }),
      pageNum(t, "02"),
    ]),

    // Slide 3 — Two column text layout
    slide(pid, 2, t.background, "slide-left", [
      txt(t, {
        x: 120, y: 100, w: 300, h: 25, content: "APPROACH",
        fontSize: 11, letterSpacing: 0.3, opacity: 0.35, zIndex: 2,
      }),
      sh({ x: 120, y: 140, w: 40, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 120, y: 200, w: 800, h: 80, content: "TWO PRINCIPLES",
        fontFamily: t.fontDisplay, fontSize: 64, letterSpacing: 0.02, zIndex: 3,
      }),
      sh({ x: 120, y: 340, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      txt(t, {
        x: 120, y: 400, w: 200, h: 25, content: "CLARITY",
        fontFamily: t.fontDisplay, fontSize: 20, letterSpacing: 0.15, zIndex: 3,
      }),
      txt(t, {
        x: 120, y: 450, w: 750, h: 220,
        content: "Strip away every unnecessary element until only the essential message remains. White space is not empty — it is the architecture that gives content room to breathe. When every word carries weight, the audience leans in rather than tuning out.",
        fontSize: 16, lineHeight: 1.9, opacity: 0.55, zIndex: 2,
      }),
      txt(t, {
        x: 1020, y: 400, w: 200, h: 25, content: "INTENTION",
        fontFamily: t.fontDisplay, fontSize: 20, letterSpacing: 0.15, zIndex: 3,
      }),
      txt(t, {
        x: 1020, y: 450, w: 750, h: 220,
        content: "Every typeface, every color, every spatial decision is made with purpose. Intentional design does not shout — it guides. The viewer moves through the narrative effortlessly because each design choice serves the story being told.",
        fontSize: 16, lineHeight: 1.9, opacity: 0.55, zIndex: 2,
      }),
      sh({ x: 120, y: 740, w: 750, h: 1, fill: t.text, opacity: 0.04, zIndex: 1 }),
      sh({ x: 1020, y: 740, w: 750, h: 1, fill: t.text, opacity: 0.04, zIndex: 1 }),
      pageNum(t, "03"),
    ]),

    // Slide 4 — Full-bleed image with text overlay
    slide(pid, 3, t.background, "zoom", [
      img(IMG.nature1, 0, 0, 1920, 1080, tk, 1),
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: "#000000", opacity: 0.4, zIndex: 2 }),
      txt(t, {
        x: 260, y: 360, w: 1400, h: 160, content: "SPACE\nTO THINK",
        fontFamily: t.fontDisplay, fontSize: 120, lineHeight: 1.0,
        textAlign: "center", color: "#ffffff", zIndex: 3,
      }),
      sh({ x: 910, y: 545, w: 100, h: 3, fill: t.accent, zIndex: 3 }),
      txt(t, {
        x: 460, y: 580, w: 1000, h: 50,
        content: "The best ideas need room to unfold.",
        fontSize: 20, lineHeight: 1.7, textAlign: "center", color: "#ffffff", opacity: 0.6, zIndex: 3,
      }),
      txt(t, {
        x: 860, y: 1030, w: 200, h: 20, content: "04",
        fontSize: 12, letterSpacing: 0.15, textAlign: "center", color: "#ffffff", opacity: 0.3, zIndex: 3,
      }),
    ]),

    // Slide 5 — Thank you centered
    slide(pid, 4, t.background, "fade", [
      txt(t, {
        x: 260, y: 350, w: 1400, h: 160, content: "THANK YOU",
        fontFamily: t.fontDisplay, fontSize: 120, textAlign: "center",
        lineHeight: 1.0, zIndex: 3,
      }),
      sh({ x: 910, y: 530, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, {
        x: 560, y: 580, w: 800, h: 30, content: "hello@studio.com",
        fontSize: 18, textAlign: "center", color: t.accent, opacity: 0.7, zIndex: 2,
      }),
      txt(t, {
        x: 560, y: 630, w: 800, h: 30, content: "studio.com",
        fontSize: 16, textAlign: "center", opacity: 0.35, zIndex: 2,
      }),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// TEMPLATE REGISTRY
// ---------------------------------------------------------------------------

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "creative-brief",
    name: "Creative Brief",
    description: "Editorial project proposal with team showcase, concept, and timeline stages.",
    slideCount: 6,
    generate: (_theme, themeKey, presentationId) =>
      generateTemplate(themeKey, presentationId),
  },
  {
    id: "pitch-deck",
    name: "Pitch Deck",
    description: "Investor-ready deck with problem, solution, market size, and call to action.",
    slideCount: 5,
    generate: (theme, themeKey, presentationId) =>
      pitchDeck(theme, themeKey, presentationId),
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Creative portfolio with full-bleed imagery, project showcases, and services grid.",
    slideCount: 5,
    generate: (theme, themeKey, presentationId) =>
      portfolio(theme, themeKey, presentationId),
  },
  {
    id: "report",
    name: "Annual Report",
    description: "Corporate report with executive summary, key metrics, milestones, and outlook.",
    slideCount: 5,
    generate: (theme, themeKey, presentationId) =>
      report(theme, themeKey, presentationId),
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean presentation with generous whitespace and centered typography.",
    slideCount: 5,
    generate: (theme, themeKey, presentationId) =>
      minimal(theme, themeKey, presentationId),
  },
];
