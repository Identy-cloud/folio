import type { Slide } from "@/types/elements";
import type { Theme } from "./themes";
import type { TemplateDefinition } from "./template-types";
import { IMG, txt, sh, img, pageNum, slide } from "./template-helpers";

function quarterlyReport(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      sh({ x: 0, y: 0, w: 8, h: 1080, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "Q1 2026  ·  QUARTERLY REVIEW", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 900, h: 260, content: "QUARTERLY\nREPORT", fontFamily: t.fontDisplay, fontSize: 160, lineHeight: 0.9, zIndex: 3 }),
      sh({ x: 120, y: 490, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 530, w: 600, h: 60, content: "Performance summary, key metrics, and strategic\noutlook for the quarter ahead.", fontSize: 17, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 120, y: 960, w: 500, h: 20, content: "ACME INC.  ·  CONFIDENTIAL", fontSize: 10, letterSpacing: 0.3, opacity: 0.25, zIndex: 1 }),
      img(IMG.office1, 1100, 80, 720, 920, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "HIGHLIGHTS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "Q1 AT A GLANCE", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { num: "$12.4M", label: "REVENUE", note: "↑ 18% QoQ" },
        { num: "2,340", label: "NEW CUSTOMERS", note: "↑ 24% QoQ" },
        { num: "94%", label: "RETENTION RATE", note: "→ Stable" },
        { num: "$1.2M", label: "NET INCOME", note: "↑ 31% QoQ" },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          sh({ x, y: 290, w: 400, h: 280, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 320, w: 340, h: 80, content: s.num, fontFamily: t.fontDisplay, fontSize: 64, color: t.accent, zIndex: 3 }),
          txt(t, { x: x + 30, y: 400, w: 340, h: 25, content: s.label, fontSize: 11, letterSpacing: 0.25, opacity: 0.45, zIndex: 2 }),
          txt(t, { x: x + 30, y: 435, w: 200, h: 25, content: s.note, fontSize: 13, color: t.accent, opacity: 0.7, zIndex: 2 }),
        ];
      }),
      img(IMG.chart1, 120, 630, 860, 380, tk, 1),
      img(IMG.office2, 1020, 630, 780, 380, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "OBJECTIVES", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "GOALS & PROGRESS", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { goal: "PRODUCT LAUNCH", status: "COMPLETE", pct: "100%", desc: "Shipped v2.0 with editorial engine and real-time collaboration features." },
        { goal: "MARKET EXPANSION", status: "ON TRACK", pct: "75%", desc: "Entered APAC market. Singapore office open, Tokyo launch in Q2." },
        { goal: "TEAM GROWTH", status: "ON TRACK", pct: "80%", desc: "Hired 18 of targeted 22 positions across engineering and sales." },
        { goal: "REVENUE TARGET", status: "AHEAD", pct: "110%", desc: "Exceeded quarterly revenue target by 10% through enterprise upsells." },
      ].flatMap((s, i) => {
        const y = 310 + i * 170;
        return [
          txt(t, { x: 120, y, w: 300, h: 30, content: s.goal, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.1, zIndex: 3 }),
          txt(t, { x: 500, y, w: 100, h: 25, content: s.status, fontSize: 11, letterSpacing: 0.2, color: t.accent, opacity: 0.8, zIndex: 2 }),
          txt(t, { x: 700, y, w: 60, h: 25, content: s.pct, fontFamily: t.fontDisplay, fontSize: 22, color: t.accent, zIndex: 3 }),
          txt(t, { x: 120, y: y + 35, w: 700, h: 50, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
          sh({ x: 120, y: y + 100, w: 700, h: 1, fill: t.text, opacity: 0.05, zIndex: 1 }),
        ];
      }),
      img(IMG.abstract1, 1000, 100, 800, 900, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 300, h: 25, content: "NEXT QUARTER", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "Q2 OUTLOOK", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 300, w: 750, h: 180, content: "Focused on scaling our enterprise pipeline, launching AI-powered layout suggestions, and achieving $15M quarterly revenue. Key priorities include deepening APAC partnerships and completing the Series B fundraise.", fontSize: 17, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      ...[
        { title: "SERIES B", desc: "Target $30M round to fuel international growth" },
        { title: "AI FEATURES", desc: "Auto-layout and content suggestions for enterprise" },
        { title: "TOKYO LAUNCH", desc: "Full market entry with localized product" },
      ].flatMap((s, i) => {
        const x = 120 + i * 560;
        return [
          sh({ x, y: 560, w: 480, h: 200, fill: t.accent, opacity: 0.04, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 590, w: 420, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x: x + 30, y: 630, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: x + 30, y: 650, w: 420, h: 60, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.nature1, 120, 820, 1680, 200, tk, 1),
      pageNum(t, "04"),
    ]),
  ];
}

function companyProfile(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "zoom", [
      img(IMG.arch2, 0, 0, 1920, 1080, tk, 1),
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: "#000000", opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "COMPANY PROFILE  ·  2026", fontSize: 11, letterSpacing: 0.3, color: "#ffffff", opacity: 0.5, zIndex: 3 }),
      txt(t, { x: 120, y: 300, w: 1200, h: 260, content: "ACME\nCORPORATION", fontFamily: t.fontDisplay, fontSize: 160, lineHeight: 0.95, color: "#ffffff", zIndex: 3 }),
      sh({ x: 120, y: 590, w: 100, h: 4, fill: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 640, w: 700, h: 60, content: "Building the future of visual communication\nsince 2020.", fontSize: 20, lineHeight: 1.7, color: "#ffffff", opacity: 0.6, zIndex: 3 }),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "WHO WE ARE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      sh({ x: 120, y: 140, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 700, h: 70, content: "OUR STORY", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      txt(t, { x: 120, y: 310, w: 700, h: 200, content: "Founded in 2020, Acme Corporation has grown from a small design studio to a global leader in editorial presentation technology. We serve over 2,000 companies across 40 countries, helping them communicate with clarity and impact.", fontSize: 17, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      ...[
        { num: "2,000+", label: "CLIENTS" },
        { num: "40", label: "COUNTRIES" },
        { num: "140", label: "TEAM MEMBERS" },
      ].flatMap((s, i) => {
        const x = 120 + i * 250;
        return [
          txt(t, { x, y: 580, w: 200, h: 70, content: s.num, fontFamily: t.fontDisplay, fontSize: 56, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 650, w: 200, h: 25, content: s.label, fontSize: 11, letterSpacing: 0.3, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.office2, 1000, 100, 800, 900, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "WHAT WE DO", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "OUR SERVICES", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { title: "EDITORIAL DESIGN", desc: "Magazine-quality presentations, reports, and pitch decks that captivate audiences." },
        { title: "BRAND IDENTITY", desc: "Complete visual systems including logos, typography, color, and guidelines." },
        { title: "DIGITAL PLATFORM", desc: "SaaS presentation builder with real-time collaboration and AI assistance." },
        { title: "CONSULTING", desc: "Strategic advisory on visual communication and brand storytelling." },
      ].flatMap((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 120 + col * 900;
        const y = 310 + row * 320;
        return [
          sh({ x, y, w: 800, h: 260, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: y + 30, w: 740, h: 40, content: s.title, fontFamily: t.fontDisplay, fontSize: 32, letterSpacing: 0.05, zIndex: 3 }),
          sh({ x: x + 30, y: y + 80, w: 40, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: x + 30, y: y + 100, w: 740, h: 80, content: s.desc, fontSize: 15, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
        ];
      }),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "LEADERSHIP", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "OUR TEAM", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { name: "ALEX MORGAN", role: "CEO & Founder", photo: IMG.portrait1 },
        { name: "SAM RIVERA", role: "CTO", photo: IMG.portrait2 },
        { name: "JORDAN CHEN", role: "Creative Director", photo: IMG.portrait3 },
      ].flatMap((s, i) => {
        const x = 120 + i * 580;
        return [
          img(s.photo, x, 310, 500, 480, tk, 1),
          txt(t, { x, y: 820, w: 500, h: 35, content: s.name, fontFamily: t.fontDisplay, fontSize: 28, letterSpacing: 0.05, zIndex: 3 }),
          txt(t, { x, y: 860, w: 500, h: 25, content: s.role, fontSize: 13, color: t.accent, opacity: 0.7, zIndex: 2 }),
        ];
      }),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 120, y: 300, w: 1000, h: 160, content: "LET'S\nCONNECT", fontFamily: t.fontDisplay, fontSize: 120, lineHeight: 1.0, zIndex: 3 }),
      sh({ x: 120, y: 490, w: 80, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 540, w: 600, h: 50, content: "Discover how we can help your organization communicate better.", fontSize: 17, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 650, w: 200, h: 20, content: "EMAIL", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 680, w: 400, h: 30, content: "hello@acmecorp.com", fontSize: 22, color: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 740, w: 200, h: 20, content: "WEBSITE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 770, w: 400, h: 30, content: "acmecorp.com", fontSize: 22, opacity: 0.6, zIndex: 2 }),
      img(IMG.arch1, 1100, 100, 720, 880, tk, 1),
      pageNum(t, "05"),
    ]),
  ];
}

function businessPlan(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      sh({ x: 1500, y: -200, w: 600, h: 600, fill: t.accent, opacity: 0.06, shape: "circle", zIndex: 0 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "BUSINESS PLAN  ·  2026", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 250, w: 1000, h: 260, content: "BUSINESS\nPLAN", fontFamily: t.fontDisplay, fontSize: 180, lineHeight: 0.9, zIndex: 3 }),
      sh({ x: 120, y: 540, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 580, w: 700, h: 60, content: "Strategic roadmap for sustainable growth\nand market leadership.", fontSize: 18, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 120, y: 960, w: 500, h: 20, content: "YOUR COMPANY NAME", fontSize: 10, letterSpacing: 0.3, opacity: 0.25, zIndex: 1 }),
      img(IMG.office1, 1150, 100, 670, 900, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "VISION", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      sh({ x: 120, y: 140, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 800, h: 130, content: "MISSION &\nVISION", fontFamily: t.fontDisplay, fontSize: 80, lineHeight: 1.05, zIndex: 3 }),
      sh({ x: 120, y: 380, w: 6, h: 100, fill: t.accent, opacity: 0.3, zIndex: 1 }),
      txt(t, { x: 160, y: 380, w: 700, h: 100, content: "\"To become the global standard for visual communication, empowering every organization to tell their story with editorial excellence.\"", fontFamily: t.fontDisplay, fontSize: 28, lineHeight: 1.4, opacity: 0.85, zIndex: 3 }),
      txt(t, { x: 120, y: 540, w: 300, h: 20, content: "CORE VALUES", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      ...[
        { title: "EXCELLENCE", desc: "Every pixel matters" },
        { title: "INNOVATION", desc: "Push boundaries daily" },
        { title: "COLLABORATION", desc: "Better together" },
      ].flatMap((s, i) => {
        const x = 120 + i * 300;
        return [
          txt(t, { x, y: 590, w: 260, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 22, letterSpacing: 0.1, zIndex: 3 }),
          txt(t, { x, y: 625, w: 260, h: 25, content: s.desc, fontSize: 13, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.nature2, 1050, 100, 750, 900, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "STRATEGY", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "REVENUE MODEL", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { stream: "SaaS PLATFORM", pct: "60%", desc: "Monthly and annual subscriptions for Pro and Team plans." },
        { stream: "ENTERPRISE", pct: "25%", desc: "Custom deployments with dedicated support and SLA." },
        { stream: "CONSULTING", pct: "15%", desc: "Strategic advisory and custom template design services." },
      ].flatMap((s, i) => {
        const x = 120 + i * 580;
        return [
          sh({ x, y: 290, w: 520, h: 300, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 320, w: 460, h: 80, content: s.pct, fontFamily: t.fontDisplay, fontSize: 72, color: t.accent, zIndex: 3 }),
          txt(t, { x: x + 30, y: 400, w: 460, h: 30, content: s.stream, fontFamily: t.fontDisplay, fontSize: 22, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x: x + 30, y: 440, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: x + 30, y: 460, w: 460, h: 80, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.chart1, 120, 650, 1680, 370, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "PROJECTIONS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "FINANCIAL FORECAST", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { year: "2026", rev: "$48M", growth: "42%" },
        { year: "2027", rev: "$85M", growth: "77%" },
        { year: "2028", rev: "$140M", growth: "65%" },
        { year: "2029", rev: "$210M", growth: "50%" },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          txt(t, { x, y: 310, w: 400, h: 50, content: s.year, fontFamily: t.fontDisplay, fontSize: 48, color: t.accent, zIndex: 3 }),
          txt(t, { x, y: 370, w: 400, h: 60, content: s.rev, fontFamily: t.fontDisplay, fontSize: 56, zIndex: 3 }),
          txt(t, { x, y: 440, w: 200, h: 25, content: `↑ ${s.growth} YoY`, fontSize: 13, color: t.accent, opacity: 0.7, zIndex: 2 }),
          sh({ x, y: 480, w: 400, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
        ];
      }),
      txt(t, { x: 120, y: 550, w: 1680, h: 120, content: "Projections based on current growth trajectory, planned market expansion into APAC and LATAM, and the launch of enterprise-tier features. Assumes 90% gross margin on SaaS revenue with operating leverage improving each year.", fontSize: 16, lineHeight: 1.8, opacity: 0.5, zIndex: 2 }),
      img(IMG.abstract2, 120, 720, 1680, 300, tk, 1),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 120, y: 300, w: 1000, h: 160, content: "READY TO\nGROW", fontFamily: t.fontDisplay, fontSize: 120, lineHeight: 1.0, zIndex: 3 }),
      sh({ x: 120, y: 490, w: 80, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 540, w: 600, h: 50, content: "Let us walk you through the detailed business plan.", fontSize: 17, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 650, w: 200, h: 20, content: "EMAIL", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 680, w: 400, h: 30, content: "plan@company.com", fontSize: 22, color: t.accent, zIndex: 3 }),
      img(IMG.product1, 1100, 100, 720, 880, tk, 1),
      pageNum(t, "05"),
    ]),
  ];
}

function investorUpdate(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: t.accent, opacity: 0.03, zIndex: 0 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "INVESTOR UPDATE  ·  MARCH 2026", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 250, w: 1200, h: 260, content: "INVESTOR\nUPDATE", fontFamily: t.fontDisplay, fontSize: 170, lineHeight: 0.9, zIndex: 3 }),
      sh({ x: 120, y: 540, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 580, w: 700, h: 40, content: "Monthly progress report for our valued investors.", fontSize: 18, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 120, y: 960, w: 500, h: 20, content: "CONFIDENTIAL  ·  DO NOT DISTRIBUTE", fontSize: 10, letterSpacing: 0.3, opacity: 0.25, zIndex: 1 }),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "DASHBOARD", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "KEY METRICS", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { num: "$4.2M", label: "MRR", delta: "↑ 12%" },
        { num: "18K", label: "ACTIVE USERS", delta: "↑ 8%" },
        { num: "$235", label: "ARPU", delta: "↑ 5%" },
        { num: "2.1%", label: "CHURN", delta: "↓ 0.3%" },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          sh({ x, y: 290, w: 400, h: 240, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 320, w: 340, h: 70, content: s.num, fontFamily: t.fontDisplay, fontSize: 56, color: t.accent, zIndex: 3 }),
          txt(t, { x: x + 30, y: 390, w: 340, h: 25, content: s.label, fontSize: 11, letterSpacing: 0.25, opacity: 0.45, zIndex: 2 }),
          txt(t, { x: x + 30, y: 425, w: 200, h: 25, content: s.delta, fontSize: 14, color: t.accent, opacity: 0.7, zIndex: 2 }),
        ];
      }),
      img(IMG.chart1, 120, 590, 1680, 430, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "WINS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "THIS MONTH", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { title: "Enterprise deal closed", desc: "Signed 3-year contract with Fortune 500 company. $1.2M ACV." },
        { title: "Product milestone", desc: "Shipped real-time collaboration. 40% increase in team plan signups." },
        { title: "Team expansion", desc: "Hired VP of Sales and 3 senior engineers. Team now at 45." },
        { title: "Press coverage", desc: "Featured in TechCrunch and Product Hunt #1 of the day." },
      ].flatMap((s, i) => {
        const y = 310 + i * 160;
        return [
          txt(t, { x: 120, y, w: 60, h: 30, content: `0${i + 1}`, fontFamily: t.fontDisplay, fontSize: 28, color: t.accent, zIndex: 3 }),
          txt(t, { x: 200, y, w: 600, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.05, zIndex: 3 }),
          txt(t, { x: 200, y: y + 35, w: 600, h: 50, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
          sh({ x: 120, y: y + 110, w: 700, h: 1, fill: t.text, opacity: 0.05, zIndex: 1 }),
        ];
      }),
      img(IMG.office1, 1050, 100, 750, 900, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "zoom", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "ASK", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 1000, h: 160, content: "HOW YOU\nCAN HELP", fontFamily: t.fontDisplay, fontSize: 100, lineHeight: 1.0, zIndex: 3 }),
      sh({ x: 120, y: 400, w: 80, h: 4, fill: t.accent, zIndex: 2 }),
      ...[
        { title: "INTRODUCTIONS", desc: "Enterprise buyers in financial services and healthcare sectors." },
        { title: "HIRING", desc: "Referrals for senior product designers and ML engineers." },
        { title: "STRATEGIC", desc: "Connections to potential APAC distribution partners." },
      ].flatMap((s, i) => {
        const y = 460 + i * 140;
        return [
          txt(t, { x: 120, y, w: 300, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 22, letterSpacing: 0.1, color: t.accent, zIndex: 3 }),
          txt(t, { x: 450, y, w: 600, h: 50, content: s.desc, fontSize: 15, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
          sh({ x: 120, y: y + 70, w: 1000, h: 1, fill: t.text, opacity: 0.05, zIndex: 1 }),
        ];
      }),
      txt(t, { x: 120, y: 900, w: 400, h: 30, content: "alex@acmestudios.com", fontSize: 18, color: t.accent, zIndex: 3 }),
      img(IMG.portrait1, 1350, 200, 450, 600, tk, 1),
      pageNum(t, "04"),
    ]),
  ];
}

export const BUSINESS_TEMPLATES: TemplateDefinition[] = [
  {
    id: "quarterly-report",
    name: "Quarterly Report",
    description: "Quarter-over-quarter performance with metrics, goals tracking, and next-quarter outlook.",
    slideCount: 4,
    category: "business",
    generate: (theme, themeKey, pid) => quarterlyReport(theme, themeKey, pid),
  },
  {
    id: "company-profile",
    name: "Company Profile",
    description: "Full-bleed cover, company story, services overview, leadership team, and contact.",
    slideCount: 5,
    category: "business",
    generate: (theme, themeKey, pid) => companyProfile(theme, themeKey, pid),
  },
  {
    id: "business-plan",
    name: "Business Plan",
    description: "Mission and vision, revenue model, financial projections, and growth strategy.",
    slideCount: 5,
    category: "business",
    generate: (theme, themeKey, pid) => businessPlan(theme, themeKey, pid),
  },
  {
    id: "investor-update",
    name: "Investor Update",
    description: "Monthly metrics dashboard, key wins, and investor ask — concise and data-driven.",
    slideCount: 4,
    category: "business",
    generate: (theme, themeKey, pid) => investorUpdate(theme, themeKey, pid),
  },
];
