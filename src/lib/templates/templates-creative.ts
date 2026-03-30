import type { Slide } from "@/types/elements";
import type { Theme } from "./themes";
import type { TemplateDefinition } from "./template-types";
import { IMG, txt, sh, img, pageNum, slide } from "./template-helpers";

function photoEssay(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "zoom", [
      img(IMG.nature2, 0, 0, 1920, 1080, tk, 1),
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: "#000000", opacity: 0.45, zIndex: 2 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "A PHOTO ESSAY  ·  2026", fontSize: 11, letterSpacing: 0.3, color: "#ffffff", opacity: 0.5, zIndex: 3 }),
      txt(t, { x: 120, y: 350, w: 1200, h: 200, content: "THROUGH\nTHE LENS", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, color: "#ffffff", zIndex: 3 }),
      sh({ x: 120, y: 570, w: 80, h: 4, fill: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 620, w: 600, h: 40, content: "Stories told through images, light, and composition.", fontSize: 18, lineHeight: 1.7, color: "#ffffff", opacity: 0.6, zIndex: 3 }),
    ]),
    slide(pid, 1, t.background, "fade", [
      img(IMG.arch1, 0, 0, 1920, 1080, tk, 1),
      sh({ x: 0, y: 780, w: 1920, h: 300, fill: "#000000", opacity: 0.6, zIndex: 2 }),
      txt(t, { x: 120, y: 830, w: 800, h: 50, content: "URBAN GEOMETRY", fontFamily: t.fontDisplay, fontSize: 42, color: "#ffffff", letterSpacing: 0.05, zIndex: 3 }),
      sh({ x: 120, y: 890, w: 50, h: 3, fill: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 910, w: 800, h: 50, content: "Finding patterns in the chaos of city architecture. Lines, angles, and negative space create a visual rhythm that echoes the pulse of urban life.", fontSize: 15, lineHeight: 1.7, color: "#ffffff", opacity: 0.7, zIndex: 3 }),
      txt(t, { x: 120, y: 980, w: 400, h: 20, content: "BARCELONA  ·  2025", fontSize: 10, letterSpacing: 0.3, color: "#ffffff", opacity: 0.4, zIndex: 3 }),
    ]),
    slide(pid, 2, t.background, "slide-left", [
      img(IMG.nature1, 100, 100, 840, 880, tk, 1),
      img(IMG.abstract1, 980, 100, 840, 420, tk, 1),
      img(IMG.portrait1, 980, 560, 400, 420, tk, 1),
      img(IMG.product1, 1420, 560, 400, 420, tk, 1),
      txt(t, { x: 100, y: 60, w: 200, h: 20, content: "03 / COLLECTION", fontSize: 10, letterSpacing: 0.3, opacity: 0.35, zIndex: 2 }),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "fade", [
      img(IMG.abstract2, 0, 0, 960, 1080, tk, 1),
      txt(t, { x: 1040, y: 100, w: 200, h: 25, content: "REFLECTION", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      sh({ x: 1040, y: 140, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 1040, y: 200, w: 760, h: 130, content: "SEEING\nDIFFERENTLY", fontFamily: t.fontDisplay, fontSize: 72, lineHeight: 1.05, zIndex: 3 }),
      txt(t, { x: 1040, y: 380, w: 700, h: 200, content: "Photography is not about what you see — it is about how you see it. Every frame is a choice: what to include, what to leave out, and where to place the viewer's eye.\n\nThese images are an invitation to pause, to look closer, to find beauty in the overlooked corners of our world.", fontSize: 16, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 260, y: 350, w: 1400, h: 160, content: "FIN", fontFamily: t.fontDisplay, fontSize: 160, textAlign: "center", zIndex: 3 }),
      sh({ x: 910, y: 530, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 460, y: 580, w: 1000, h: 50, content: "All photographs by Your Name  ·  yourname.com", fontSize: 16, textAlign: "center", opacity: 0.4, zIndex: 2 }),
    ]),
  ];
}

function brandGuidelines(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      sh({ x: 0, y: 0, w: 8, h: 1080, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "BRAND GUIDELINES  ·  V1.0", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 250, w: 1000, h: 260, content: "BRAND\nGUIDELINES", fontFamily: t.fontDisplay, fontSize: 160, lineHeight: 0.9, zIndex: 3 }),
      sh({ x: 120, y: 540, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 580, w: 600, h: 60, content: "The definitive guide to our visual identity,\ntone of voice, and design principles.", fontSize: 17, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 120, y: 960, w: 500, h: 20, content: "YOUR BRAND  ·  MARCH 2026", fontSize: 10, letterSpacing: 0.3, opacity: 0.25, zIndex: 1 }),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "LOGO", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "LOGO USAGE", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      sh({ x: 120, y: 310, w: 400, h: 300, fill: t.accent, opacity: 0.06, borderRadius: 4, zIndex: 1 }),
      txt(t, { x: 200, y: 420, w: 240, h: 40, content: "LOGO", fontFamily: t.fontDisplay, fontSize: 36, textAlign: "center", opacity: 0.3, zIndex: 2 }),
      sh({ x: 600, y: 310, w: 400, h: 300, fill: t.text, opacity: 0.9, borderRadius: 4, zIndex: 1 }),
      txt(t, { x: 680, y: 420, w: 240, h: 40, content: "LOGO", fontFamily: t.fontDisplay, fontSize: 36, textAlign: "center", color: t.background, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 660, w: 300, h: 25, content: "CLEAR SPACE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 700, w: 900, h: 80, content: "Maintain a minimum clear space around the logo equal to the height of the letter mark. Never place the logo on busy backgrounds or alter its proportions.", fontSize: 15, lineHeight: 1.8, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 1150, y: 100, w: 200, h: 25, content: "DON'TS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      ...[
        "Do not stretch or distort",
        "Do not change colors",
        "Do not add effects",
        "Do not rotate the logo",
      ].flatMap((s, i) => [
        txt(t, { x: 1150, y: 160 + i * 50, w: 650, h: 30, content: `✕  ${s}`, fontSize: 14, opacity: 0.5, zIndex: 2 }),
      ]),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "COLORS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "COLOR PALETTE", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      sh({ x: 120, y: 310, w: 400, h: 400, fill: t.accent, borderRadius: 4, zIndex: 1 }),
      txt(t, { x: 140, y: 670, w: 360, h: 25, content: "PRIMARY", fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
      sh({ x: 560, y: 310, w: 400, h: 400, fill: t.text, borderRadius: 4, zIndex: 1 }),
      txt(t, { x: 580, y: 670, w: 360, h: 25, content: "TEXT", fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
      sh({ x: 1000, y: 310, w: 400, h: 400, fill: t.background, borderRadius: 4, zIndex: 1, stroke: t.text, strokeWidth: 1 }),
      txt(t, { x: 1020, y: 670, w: 360, h: 25, content: "BACKGROUND", fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
      sh({ x: 1440, y: 310, w: 360, h: 400, fill: t.primary, opacity: 0.3, borderRadius: 4, zIndex: 1 }),
      txt(t, { x: 1460, y: 670, w: 320, h: 25, content: "SECONDARY", fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 750, w: 1680, h: 60, content: "Use the primary color sparingly — for accents, CTAs, and key visual elements. Text color should be used for all body copy. Background color is the default canvas.", fontSize: 15, lineHeight: 1.8, opacity: 0.5, zIndex: 2 }),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "TYPOGRAPHY", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "TYPE SYSTEM", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 320, w: 500, h: 25, content: "DISPLAY TYPEFACE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 360, w: 800, h: 120, content: "Aa Bb Cc\n1234567890", fontFamily: t.fontDisplay, fontSize: 80, lineHeight: 1.1, zIndex: 3 }),
      txt(t, { x: 120, y: 530, w: 500, h: 25, content: "BODY TYPEFACE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 570, w: 800, h: 80, content: "Aa Bb Cc Dd Ee Ff Gg\nThe quick brown fox jumps over the lazy dog.", fontSize: 28, lineHeight: 1.5, opacity: 0.7, zIndex: 2 }),
      txt(t, { x: 120, y: 720, w: 800, h: 120, content: "Headlines use the display typeface at large sizes with tight tracking. Body copy uses the body typeface at 14-18px with generous line height (1.6-1.8) for readability.", fontSize: 15, lineHeight: 1.8, opacity: 0.5, zIndex: 2 }),
      sh({ x: 1100, y: 300, w: 1, h: 600, fill: t.text, opacity: 0.06, zIndex: 1 }),
      txt(t, { x: 1200, y: 320, w: 600, h: 25, content: "SCALE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      ...[
        { size: "H1", px: "64px", sample: "Heading One" },
        { size: "H2", px: "48px", sample: "Heading Two" },
        { size: "H3", px: "32px", sample: "Heading Three" },
        { size: "BODY", px: "16px", sample: "Body paragraph text" },
        { size: "CAPTION", px: "12px", sample: "Caption and labels" },
      ].flatMap((s, i) => {
        const y = 370 + i * 90;
        return [
          txt(t, { x: 1200, y, w: 80, h: 25, content: s.size, fontSize: 11, letterSpacing: 0.2, color: t.accent, opacity: 0.7, zIndex: 2 }),
          txt(t, { x: 1300, y, w: 80, h: 25, content: s.px, fontSize: 11, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: 1400, y, w: 400, h: 30, content: s.sample, fontFamily: t.fontDisplay, fontSize: 20, zIndex: 3 }),
        ];
      }),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "IMAGERY", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "PHOTO STYLE", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      img(IMG.portrait1, 120, 310, 560, 380, tk, 1),
      img(IMG.arch2, 720, 310, 560, 380, tk, 1),
      img(IMG.nature1, 1320, 310, 480, 380, tk, 1),
      txt(t, { x: 120, y: 730, w: 200, h: 20, content: "DO", fontSize: 11, letterSpacing: 0.3, color: t.accent, opacity: 0.7, zIndex: 2 }),
      txt(t, { x: 120, y: 760, w: 800, h: 80, content: "Use natural lighting, authentic moments, and editorial composition. Images should feel curated, not stock. Prefer desaturated tones that complement the brand palette.", fontSize: 15, lineHeight: 1.8, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 120, y: 880, w: 200, h: 20, content: "DON'T", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 910, w: 800, h: 40, content: "Avoid clipart, overly saturated photos, and generic stock imagery with forced smiles.", fontSize: 15, lineHeight: 1.8, opacity: 0.55, zIndex: 2 }),
      pageNum(t, "05"),
    ]),
    slide(pid, 5, t.background, "zoom", [
      txt(t, { x: 260, y: 350, w: 1400, h: 120, content: "STAY ON BRAND", fontFamily: t.fontDisplay, fontSize: 100, textAlign: "center", zIndex: 3 }),
      sh({ x: 910, y: 490, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 460, y: 540, w: 1000, h: 60, content: "Questions about brand usage?\nbrand@company.com", fontSize: 16, textAlign: "center", opacity: 0.45, lineHeight: 1.7, zIndex: 2 }),
    ]),
  ];
}

function moodBoard(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "MOOD BOARD  ·  PROJECT ALPHA", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 300, w: 800, h: 200, content: "MOOD\nBOARD", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, zIndex: 3 }),
      sh({ x: 120, y: 520, w: 80, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 570, w: 600, h: 60, content: "Visual direction and aesthetic references\nfor the creative concept.", fontSize: 17, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      img(IMG.abstract1, 1000, 60, 480, 480, tk, 1),
      img(IMG.palette, 1520, 60, 340, 480, tk, 1),
      img(IMG.nature2, 1000, 580, 860, 440, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 100, y: 60, w: 200, h: 20, content: "02 / TEXTURES", fontSize: 10, letterSpacing: 0.3, opacity: 0.35, zIndex: 3 }),
      img(IMG.abstract2, 100, 100, 600, 460, tk, 1),
      img(IMG.product2, 740, 100, 580, 460, tk, 1),
      img(IMG.arch1, 1360, 100, 460, 460, tk, 1),
      img(IMG.nature1, 100, 600, 860, 420, tk, 1),
      img(IMG.portrait3, 1000, 600, 400, 420, tk, 1),
      img(IMG.camera, 1440, 600, 380, 420, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "PALETTE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "COLOR DIRECTION", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      sh({ x: 120, y: 320, w: 320, h: 320, fill: t.accent, borderRadius: 4, zIndex: 1 }),
      sh({ x: 480, y: 320, w: 320, h: 320, fill: t.text, borderRadius: 4, zIndex: 1 }),
      sh({ x: 840, y: 320, w: 320, h: 320, fill: t.primary, opacity: 0.4, borderRadius: 4, zIndex: 1 }),
      sh({ x: 1200, y: 320, w: 320, h: 320, fill: t.background, borderRadius: 4, stroke: t.text, strokeWidth: 1, zIndex: 1 }),
      sh({ x: 1560, y: 320, w: 240, h: 320, fill: t.accent, opacity: 0.2, borderRadius: 4, zIndex: 1 }),
      txt(t, { x: 120, y: 680, w: 1680, h: 80, content: "Warm, muted tones with a single bold accent. The palette should feel sophisticated and editorial — never loud or garish. Allow generous whitespace to let the colors breathe.", fontSize: 16, lineHeight: 1.8, opacity: 0.55, zIndex: 2 }),
      img(IMG.palette, 120, 800, 860, 220, tk, 1),
      img(IMG.abstract1, 1020, 800, 780, 220, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "zoom", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "TYPOGRAPHY", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "TYPE REFERENCES", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 320, w: 1680, h: 200, content: "EDITORIAL\nAESTHETIC", fontFamily: t.fontDisplay, fontSize: 160, lineHeight: 0.9, opacity: 0.15, zIndex: 1 }),
      txt(t, { x: 120, y: 560, w: 800, h: 120, content: "Display type should be bold and expressive.\nBody type should be clean and readable.\nContrast between the two creates visual tension.", fontSize: 17, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      img(IMG.camera, 1100, 300, 700, 700, tk, 1),
      pageNum(t, "04"),
    ]),
  ];
}

function creativeBrief2(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "zoom", [
      sh({ x: 1400, y: -100, w: 700, h: 700, fill: t.accent, opacity: 0.06, shape: "circle", zIndex: 0 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "CREATIVE BRIEF  ·  PROJECT NOVA", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 250, w: 1000, h: 260, content: "CREATIVE\nBRIEF", fontFamily: t.fontDisplay, fontSize: 170, lineHeight: 0.9, zIndex: 3 }),
      sh({ x: 120, y: 540, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 580, w: 700, h: 60, content: "A comprehensive overview of the project scope,\nobjectives, and creative direction.", fontSize: 17, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      img(IMG.abstract2, 1200, 160, 600, 780, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "OVERVIEW", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "PROJECT SCOPE", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { label: "CLIENT", value: "Acme Corporation" },
        { label: "PROJECT", value: "Brand Refresh & Digital Platform" },
        { label: "TIMELINE", value: "12 weeks — March to June 2026" },
        { label: "BUDGET", value: "$85,000" },
      ].flatMap((s, i) => {
        const y = 310 + i * 100;
        return [
          txt(t, { x: 120, y, w: 200, h: 25, content: s.label, fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: 350, y, w: 500, h: 30, content: s.value, fontSize: 18, zIndex: 3 }),
          sh({ x: 120, y: y + 55, w: 750, h: 1, fill: t.text, opacity: 0.05, zIndex: 1 }),
        ];
      }),
      txt(t, { x: 120, y: 740, w: 750, h: 120, content: "The client seeks a complete visual overhaul to position themselves as the premium option in their market. Deliverables include brand guidelines, website redesign, and presentation templates.", fontSize: 16, lineHeight: 1.8, opacity: 0.55, zIndex: 2 }),
      img(IMG.product1, 1050, 100, 750, 900, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "OBJECTIVES", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "GOALS & KPIs", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { num: "01", title: "BRAND AWARENESS", desc: "Increase brand recognition by 40% within 6 months of launch." },
        { num: "02", title: "USER ENGAGEMENT", desc: "Achieve 25% improvement in website session duration and page views." },
        { num: "03", title: "CONVERSION RATE", desc: "Lift demo request conversion from 2.1% to 3.5% through better design." },
        { num: "04", title: "CONSISTENCY", desc: "100% brand compliance across all touchpoints within 90 days." },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          txt(t, { x, y: 300, w: 400, h: 50, content: s.num, fontFamily: t.fontDisplay, fontSize: 48, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 360, w: 380, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 20, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x, y: 400, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x, y: 420, w: 380, h: 80, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.workshop, 120, 570, 1680, 440, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "TIMELINE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "PROJECT PHASES", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 260, w: 1680, h: 2, fill: t.accent, opacity: 0.15, zIndex: 1 }),
      ...[
        { phase: "DISCOVERY", weeks: "WK 1-2", desc: "Stakeholder interviews, brand audit, competitive analysis" },
        { phase: "CONCEPT", weeks: "WK 3-5", desc: "Moodboards, design exploration, initial concepts for review" },
        { phase: "DESIGN", weeks: "WK 6-9", desc: "Full design development, asset creation, guidelines doc" },
        { phase: "DELIVERY", weeks: "WK 10-12", desc: "Final files, handoff, team training, launch support" },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          sh({ x: x + 200, y: 252, w: 14, h: 14, fill: t.accent, shape: "circle", zIndex: 3 }),
          txt(t, { x, y: 310, w: 400, h: 30, content: s.weeks, fontSize: 13, color: t.accent, opacity: 0.7, zIndex: 2 }),
          txt(t, { x, y: 350, w: 400, h: 30, content: s.phase, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x, y: 390, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x, y: 410, w: 380, h: 80, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.palette, 120, 560, 860, 460, tk, 1),
      img(IMG.abstract1, 1020, 560, 780, 460, tk, 1),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 120, y: 300, w: 1000, h: 160, content: "LET'S\nBEGIN", fontFamily: t.fontDisplay, fontSize: 120, lineHeight: 1.0, zIndex: 3 }),
      sh({ x: 120, y: 490, w: 80, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 540, w: 600, h: 50, content: "Ready to kick off? Reach out to schedule the discovery session.", fontSize: 17, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 650, w: 400, h: 30, content: "creative@studio.com", fontSize: 22, color: t.accent, zIndex: 3 }),
      img(IMG.portrait2, 1300, 150, 500, 650, tk, 1),
      pageNum(t, "05"),
    ]),
  ];
}

export const CREATIVE_TEMPLATES: TemplateDefinition[] = [
  {
    id: "photo-essay",
    name: "Photo Essay",
    description: "Cinematic full-bleed photography with overlay captions and gallery grids.",
    slideCount: 5,
    category: "creative",
    generate: (theme, themeKey, pid) => photoEssay(theme, themeKey, pid),
  },
  {
    id: "brand-guidelines",
    name: "Brand Guidelines",
    description: "Logo usage, color palette, typography system, and imagery direction.",
    slideCount: 6,
    category: "creative",
    generate: (theme, themeKey, pid) => brandGuidelines(theme, themeKey, pid),
  },
  {
    id: "mood-board",
    name: "Mood Board",
    description: "Visual inspiration collages with color direction and type references.",
    slideCount: 4,
    category: "creative",
    generate: (theme, themeKey, pid) => moodBoard(theme, themeKey, pid),
  },
  {
    id: "creative-brief-2",
    name: "Creative Brief Pro",
    description: "Project scope, objectives with KPIs, timeline phases, and team kickoff.",
    slideCount: 5,
    category: "creative",
    generate: (theme, themeKey, pid) => creativeBrief2(theme, themeKey, pid),
  },
];
