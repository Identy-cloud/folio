import type { Slide } from "@/types/elements";
import type { Theme } from "./themes";
import type { TemplateDefinition } from "./template-types";
import { IMG, txt, sh, img, pageNum, slide } from "./template-helpers";

function salesDeck(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "zoom", [
      sh({ x: 1400, y: -200, w: 700, h: 700, fill: t.accent, opacity: 0.06, shape: "circle", zIndex: 0 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "SALES DECK  ·  2026", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 250, w: 1200, h: 260, content: "TRANSFORM\nYOUR WORKFLOW", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, zIndex: 3 }),
      sh({ x: 120, y: 540, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 580, w: 700, h: 60, content: "The editorial presentation platform that makes\nevery deck unforgettable.", fontSize: 18, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      img(IMG.product1, 1200, 200, 600, 700, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "THE CHALLENGE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 130, content: "YOUR TEAM\nDESERVES BETTER", fontFamily: t.fontDisplay, fontSize: 80, lineHeight: 1.05, zIndex: 3 }),
      sh({ x: 120, y: 320, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { pain: "Hours wasted on formatting", impact: "12 hrs/week per team" },
        { pain: "Inconsistent brand presentations", impact: "37% lower close rate" },
        { pain: "No real-time collaboration", impact: "3-day avg review cycle" },
      ].flatMap((s, i) => {
        const y = 380 + i * 140;
        return [
          txt(t, { x: 120, y, w: 600, h: 30, content: s.pain, fontFamily: t.fontDisplay, fontSize: 28, zIndex: 3 }),
          txt(t, { x: 120, y: y + 40, w: 600, h: 25, content: s.impact, fontSize: 14, color: t.accent, opacity: 0.7, zIndex: 2 }),
          sh({ x: 120, y: y + 90, w: 600, h: 1, fill: t.text, opacity: 0.05, zIndex: 1 }),
        ];
      }),
      img(IMG.office2, 1000, 100, 800, 900, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "FEATURES", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "HOW IT WORKS", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { num: "01", title: "SMART TEMPLATES", desc: "Editorial-quality layouts that adapt to your brand automatically." },
        { num: "02", title: "REAL-TIME COLLAB", desc: "Work together seamlessly with live cursors and instant sync." },
        { num: "03", title: "BRAND GUARDRAILS", desc: "Ensure every deck stays on-brand with automated style checks." },
        { num: "04", title: "ANALYTICS", desc: "Track who viewed, how long, and which slides resonated most." },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          txt(t, { x, y: 300, w: 400, h: 50, content: s.num, fontFamily: t.fontDisplay, fontSize: 48, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 360, w: 380, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 20, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x, y: 400, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x, y: 420, w: 380, h: 80, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.abstract1, 120, 570, 1680, 440, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "SOCIAL PROOF", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "TRUSTED BY LEADERS", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { quote: "\"Cut our deck creation time by 80%. Game changer.\"", name: "SARAH K.", role: "VP Marketing, Fortune 500" },
        { quote: "\"Our close rate jumped 25% after switching.\"", name: "MIKE T.", role: "Head of Sales, Series B Startup" },
      ].flatMap((s, i) => {
        const x = 120 + i * 860;
        return [
          sh({ x, y: 320, w: 780, h: 300, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          sh({ x: x + 30, y: 350, w: 4, h: 80, fill: t.accent, opacity: 0.3, zIndex: 2 }),
          txt(t, { x: x + 60, y: 350, w: 680, h: 80, content: s.quote, fontFamily: t.fontDisplay, fontSize: 28, lineHeight: 1.35, zIndex: 3 }),
          txt(t, { x: x + 60, y: 470, w: 300, h: 25, content: s.name, fontSize: 14, fontWeight: 600, zIndex: 3 }),
          txt(t, { x: x + 60, y: 500, w: 400, h: 25, content: s.role, fontSize: 13, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.office1, 120, 680, 1680, 340, tk, 1),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "PRICING", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "SIMPLE PRICING", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      ...[
        { plan: "STARTER", price: "$0", desc: "5 presentations\n100 MB storage\n5 themes" },
        { plan: "PRO", price: "$12/mo", desc: "Unlimited presentations\n10 GB storage\nAll themes + PDF export" },
        { plan: "TEAM", price: "$29/seat", desc: "Everything in Pro\nReal-time collaboration\nWorkspace + roles" },
      ].flatMap((s, i) => {
        const x = 120 + i * 580;
        return [
          sh({ x, y: 280, w: 520, h: 400, fill: t.accent, opacity: i === 1 ? 0.08 : 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 310, w: 460, h: 25, content: s.plan, fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
          txt(t, { x: x + 30, y: 350, w: 460, h: 70, content: s.price, fontFamily: t.fontDisplay, fontSize: 56, color: t.accent, zIndex: 3 }),
          sh({ x: x + 30, y: 430, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: x + 30, y: 460, w: 460, h: 120, content: s.desc, fontSize: 15, lineHeight: 1.8, opacity: 0.55, zIndex: 2 }),
        ];
      }),
      txt(t, { x: 120, y: 750, w: 1680, h: 40, content: "Start free. Upgrade when you need more.", fontSize: 16, textAlign: "center", opacity: 0.4, zIndex: 2 }),
      pageNum(t, "05"),
    ]),
    slide(pid, 5, t.background, "fade", [
      txt(t, { x: 120, y: 300, w: 1000, h: 160, content: "READY TO\nCLOSE MORE", fontFamily: t.fontDisplay, fontSize: 120, lineHeight: 1.0, zIndex: 3 }),
      sh({ x: 120, y: 490, w: 80, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 540, w: 600, h: 50, content: "Schedule a demo and see the difference editorial design makes.", fontSize: 17, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 650, w: 400, h: 30, content: "sales@platform.com", fontSize: 22, color: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 700, w: 400, h: 30, content: "platform.com/demo", fontSize: 18, opacity: 0.5, zIndex: 2 }),
      img(IMG.portrait1, 1300, 150, 500, 650, tk, 1),
      pageNum(t, "06"),
    ]),
  ];
}

function productLaunch(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "zoom", [
      img(IMG.product2, 0, 0, 1920, 1080, tk, 1),
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: "#000000", opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "PRODUCT LAUNCH  ·  2026", fontSize: 11, letterSpacing: 0.3, color: "#ffffff", opacity: 0.5, zIndex: 3 }),
      txt(t, { x: 120, y: 300, w: 1200, h: 260, content: "INTRODUCING\nPRODUCT X", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, color: "#ffffff", zIndex: 3 }),
      sh({ x: 120, y: 590, w: 100, h: 4, fill: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 640, w: 700, h: 40, content: "The next generation of creative tools.", fontSize: 20, lineHeight: 1.7, color: "#ffffff", opacity: 0.6, zIndex: 3 }),
    ]),
    slide(pid, 1, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "THE VISION", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 130, content: "WHY\nPRODUCT X", fontFamily: t.fontDisplay, fontSize: 80, lineHeight: 1.05, zIndex: 3 }),
      sh({ x: 120, y: 320, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 370, w: 750, h: 200, content: "For years, creative professionals have been forced to choose between power and simplicity. Product X eliminates that tradeoff. Built from the ground up with editorial design principles, it delivers professional-grade results without the learning curve.", fontSize: 17, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      ...[
        { num: "3x", label: "FASTER" },
        { num: "50+", label: "TEMPLATES" },
        { num: "0", label: "LEARNING CURVE" },
      ].flatMap((s, i) => {
        const x = 120 + i * 250;
        return [
          txt(t, { x, y: 640, w: 200, h: 70, content: s.num, fontFamily: t.fontDisplay, fontSize: 56, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 710, w: 200, h: 25, content: s.label, fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.product1, 1050, 100, 750, 850, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "KEY FEATURES", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "BUILT FOR YOU", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { title: "SMART CANVAS", desc: "Infinite workspace with editorial-aware snapping and alignment." },
        { title: "BRAND ENGINE", desc: "Auto-apply your brand palette, fonts, and imagery rules." },
        { title: "LIVE COLLAB", desc: "See changes in real-time with presence indicators and comments." },
        { title: "ONE-CLICK EXPORT", desc: "PDF, images, video, and shareable links in seconds." },
      ].flatMap((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 120 + col * 900;
        const y = 310 + row * 300;
        return [
          sh({ x, y, w: 800, h: 240, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: y + 30, w: 740, h: 40, content: s.title, fontFamily: t.fontDisplay, fontSize: 32, zIndex: 3 }),
          sh({ x: x + 30, y: y + 80, w: 40, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: x + 30, y: y + 100, w: 740, h: 60, content: s.desc, fontSize: 15, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
        ];
      }),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "ROADMAP", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "WHAT'S NEXT", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 260, w: 1680, h: 2, fill: t.accent, opacity: 0.15, zIndex: 1 }),
      ...[
        { phase: "NOW", title: "PUBLIC BETA", desc: "Open access for all users. Core features available." },
        { phase: "Q2", title: "AI ASSIST", desc: "AI-powered layout suggestions and content generation." },
        { phase: "Q3", title: "MOBILE APP", desc: "Native iOS and Android apps for on-the-go editing." },
        { phase: "Q4", title: "MARKETPLACE", desc: "Community templates, plugins, and integrations." },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          sh({ x: x + 200, y: 252, w: 14, h: 14, fill: t.accent, shape: "circle", zIndex: 3 }),
          txt(t, { x, y: 310, w: 400, h: 30, content: s.phase, fontSize: 13, color: t.accent, opacity: 0.7, zIndex: 2 }),
          txt(t, { x, y: 350, w: 400, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x, y: 390, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x, y: 410, w: 380, h: 80, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.abstract2, 120, 560, 1680, 460, tk, 1),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 260, y: 300, w: 1400, h: 200, content: "TRY IT\nTODAY", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, textAlign: "center", zIndex: 3 }),
      sh({ x: 910, y: 520, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 460, y: 570, w: 1000, h: 50, content: "Free to start. No credit card required.", fontSize: 18, textAlign: "center", opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 460, y: 650, w: 1000, h: 30, content: "productx.com/beta", fontSize: 22, textAlign: "center", color: t.accent, zIndex: 3 }),
    ]),
  ];
}

function startupPitch(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: t.accent, opacity: 0.03, zIndex: 0 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "SEED ROUND  ·  2026", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 250, w: 1000, h: 130, content: "YOUR STARTUP", fontFamily: t.fontDisplay, fontSize: 120, lineHeight: 1.0, zIndex: 3 }),
      txt(t, { x: 120, y: 400, w: 1000, h: 60, content: "ONE LINE THAT EXPLAINS EVERYTHING", fontFamily: t.fontDisplay, fontSize: 36, color: t.accent, letterSpacing: 0.05, zIndex: 3 }),
      sh({ x: 120, y: 490, w: 80, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 530, w: 700, h: 40, content: "Raising $3M seed to capture the $X billion market.", fontSize: 17, opacity: 0.55, zIndex: 2 }),
      img(IMG.abstract1, 1200, 100, 620, 900, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "PROBLEM", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 1000, h: 200, content: "THE PROBLEM\nIS REAL", fontFamily: t.fontDisplay, fontSize: 100, lineHeight: 1.0, zIndex: 3 }),
      sh({ x: 120, y: 430, w: 80, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 480, w: 800, h: 120, content: "Describe the pain point your customers face every day. Use data to show the scale of the problem. Make investors feel the urgency.", fontSize: 18, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      txt(t, { x: 120, y: 660, w: 300, h: 70, content: "$XX B", fontFamily: t.fontDisplay, fontSize: 56, color: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 730, w: 300, h: 25, content: "MARKET OPPORTUNITY", fontSize: 11, letterSpacing: 0.2, opacity: 0.45, zIndex: 2 }),
      txt(t, { x: 450, y: 660, w: 300, h: 70, content: "XX M", fontFamily: t.fontDisplay, fontSize: 56, color: t.accent, zIndex: 3 }),
      txt(t, { x: 450, y: 730, w: 300, h: 25, content: "PEOPLE AFFECTED", fontSize: 11, letterSpacing: 0.2, opacity: 0.45, zIndex: 2 }),
      img(IMG.nature2, 1100, 100, 700, 900, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "fade", [
      img(IMG.product2, 0, 0, 900, 1080, tk, 1),
      txt(t, { x: 1000, y: 100, w: 200, h: 25, content: "SOLUTION", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 1000, y: 200, w: 800, h: 130, content: "WE FIX\nTHIS", fontFamily: t.fontDisplay, fontSize: 80, lineHeight: 1.05, zIndex: 3 }),
      sh({ x: 1000, y: 360, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 1000, y: 410, w: 750, h: 160, content: "Explain your solution in simple terms. What do you do, and why is it 10x better than alternatives? Focus on the unique insight your team has.", fontSize: 17, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      txt(t, { x: 1000, y: 640, w: 350, h: 25, content: "✦  Feature or benefit one", fontSize: 14, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 1000, y: 680, w: 350, h: 25, content: "✦  Feature or benefit two", fontSize: 14, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 1000, y: 720, w: 350, h: 25, content: "✦  Feature or benefit three", fontSize: 14, opacity: 0.5, zIndex: 2 }),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "TRACTION", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "EARLY TRACTION", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { num: "XXX", label: "USERS", sub: "XX% MoM growth" },
        { num: "$XXK", label: "MRR", sub: "XX% MoM growth" },
        { num: "XX%", label: "RETENTION", sub: "D30 cohort" },
        { num: "X.X", label: "NPS SCORE", sub: "Top quartile" },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          sh({ x, y: 290, w: 400, h: 280, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 320, w: 340, h: 80, content: s.num, fontFamily: t.fontDisplay, fontSize: 64, color: t.accent, zIndex: 3 }),
          txt(t, { x: x + 30, y: 400, w: 340, h: 25, content: s.label, fontSize: 11, letterSpacing: 0.25, opacity: 0.45, zIndex: 2 }),
          txt(t, { x: x + 30, y: 435, w: 340, h: 25, content: s.sub, fontSize: 13, color: t.accent, opacity: 0.6, zIndex: 2 }),
        ];
      }),
      img(IMG.chart1, 120, 630, 1680, 390, tk, 1),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "THE ASK", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 1200, h: 200, content: "RAISING\n$3M SEED", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, zIndex: 3 }),
      sh({ x: 120, y: 430, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      ...[
        { use: "ENGINEERING", pct: "50%", desc: "Scale the platform" },
        { use: "GO-TO-MARKET", pct: "30%", desc: "Sales and marketing" },
        { use: "OPERATIONS", pct: "20%", desc: "Hiring and infrastructure" },
      ].flatMap((s, i) => {
        const x = 120 + i * 580;
        return [
          txt(t, { x, y: 490, w: 520, h: 50, content: s.pct, fontFamily: t.fontDisplay, fontSize: 48, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 550, w: 520, h: 25, content: s.use, fontSize: 11, letterSpacing: 0.2, opacity: 0.5, zIndex: 2 }),
          txt(t, { x, y: 585, w: 520, h: 25, content: s.desc, fontSize: 14, opacity: 0.45, zIndex: 2 }),
        ];
      }),
      txt(t, { x: 120, y: 700, w: 400, h: 30, content: "founder@startup.com", fontSize: 22, color: t.accent, zIndex: 3 }),
      img(IMG.portrait2, 1350, 200, 450, 600, tk, 1),
      pageNum(t, "05"),
    ]),
  ];
}

export const PITCH_TEMPLATES: TemplateDefinition[] = [
  {
    id: "sales-deck",
    name: "Sales Deck",
    description: "Product-focused sales deck with pain points, features, social proof, and pricing.",
    slideCount: 6,
    category: "pitch",
    generate: (theme, themeKey, pid) => salesDeck(theme, themeKey, pid),
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Full-bleed hero, feature showcase, product roadmap, and call-to-action.",
    slideCount: 5,
    category: "pitch",
    generate: (theme, themeKey, pid) => productLaunch(theme, themeKey, pid),
  },
  {
    id: "startup-pitch",
    name: "Startup Pitch",
    description: "Seed-round deck with problem, solution, traction metrics, and funding ask.",
    slideCount: 5,
    category: "pitch",
    generate: (theme, themeKey, pid) => startupPitch(theme, themeKey, pid),
  },
];
