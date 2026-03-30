import type { Slide } from "@/types/elements";
import type { Theme } from "./themes";
import type { TemplateDefinition } from "./template-types";
import { IMG, txt, sh, img, pageNum, slide } from "./template-helpers";

function lessonPlan(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      sh({ x: 0, y: 0, w: 8, h: 1080, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "LESSON PLAN  ·  UNIT 04", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 250, w: 900, h: 260, content: "DESIGN\nTHINKING", fontFamily: t.fontDisplay, fontSize: 160, lineHeight: 0.9, zIndex: 3 }),
      sh({ x: 120, y: 540, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 580, w: 700, h: 60, content: "An introduction to human-centered design\nand the creative problem-solving process.", fontSize: 17, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 120, y: 720, w: 200, h: 20, content: "DURATION", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 750, w: 300, h: 30, content: "90 minutes", fontSize: 18, zIndex: 3 }),
      txt(t, { x: 350, y: 720, w: 200, h: 20, content: "LEVEL", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 350, y: 750, w: 300, h: 30, content: "Intermediate", fontSize: 18, zIndex: 3 }),
      img(IMG.classroom, 1050, 80, 770, 920, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 300, h: 25, content: "LEARNING OBJECTIVES", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "WHAT YOU'LL LEARN", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { num: "01", title: "EMPATHIZE", desc: "Understand the user through observation, interviews, and immersive experiences." },
        { num: "02", title: "DEFINE", desc: "Synthesize research findings into a clear problem statement and design brief." },
        { num: "03", title: "IDEATE", desc: "Generate a wide range of creative solutions through brainstorming and sketching." },
        { num: "04", title: "PROTOTYPE", desc: "Build quick, low-fidelity representations of potential solutions." },
        { num: "05", title: "TEST", desc: "Gather feedback, iterate, and refine based on real user input." },
      ].flatMap((s, i) => {
        const y = 310 + i * 130;
        return [
          txt(t, { x: 120, y, w: 60, h: 30, content: s.num, fontFamily: t.fontDisplay, fontSize: 28, color: t.accent, zIndex: 3 }),
          txt(t, { x: 200, y, w: 300, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.1, zIndex: 3 }),
          txt(t, { x: 200, y: y + 35, w: 650, h: 50, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
          sh({ x: 120, y: y + 100, w: 750, h: 1, fill: t.text, opacity: 0.05, zIndex: 1 }),
        ];
      }),
      img(IMG.workshop, 1050, 100, 750, 900, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "ACTIVITY", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "HANDS-ON EXERCISE", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { time: "10 MIN", activity: "WARM-UP", desc: "Quick sketching exercise — draw your neighbor's problem in 60 seconds." },
        { time: "20 MIN", activity: "RESEARCH", desc: "Interview a partner about a daily frustration. Take notes, ask follow-ups." },
        { time: "15 MIN", activity: "DEFINE", desc: "Write a How Might We statement based on your interview findings." },
        { time: "25 MIN", activity: "BUILD", desc: "Create a paper prototype of your solution. Use provided materials." },
        { time: "20 MIN", activity: "PRESENT", desc: "Each team presents their prototype. Class provides structured feedback." },
      ].flatMap((s, i) => {
        const y = 290 + i * 130;
        return [
          txt(t, { x: 120, y, w: 100, h: 25, content: s.time, fontSize: 13, color: t.accent, opacity: 0.7, zIndex: 2 }),
          txt(t, { x: 280, y, w: 300, h: 30, content: s.activity, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.1, zIndex: 3 }),
          txt(t, { x: 280, y: y + 35, w: 700, h: 40, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
          sh({ x: 120, y: y + 95, w: 900, h: 1, fill: t.text, opacity: 0.04, zIndex: 1 }),
        ];
      }),
      img(IMG.palette, 1200, 290, 600, 730, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "KEY CONCEPTS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "CORE PRINCIPLES", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { title: "HUMAN\nCENTERED", desc: "Start with people. Every design decision should serve a real human need." },
        { title: "BIAS TO\nACTION", desc: "Build to think. Prototyping is a form of exploration, not just validation." },
        { title: "RADICAL\nCOLLABORATION", desc: "Diverse perspectives lead to better solutions. Seek out different viewpoints." },
      ].flatMap((s, i) => {
        const x = 120 + i * 580;
        return [
          sh({ x, y: 310, w: 520, h: 350, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 340, w: 460, h: 70, content: s.title, fontFamily: t.fontDisplay, fontSize: 36, lineHeight: 1.1, zIndex: 3 }),
          sh({ x: x + 30, y: 430, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: x + 30, y: 460, w: 460, h: 100, content: s.desc, fontSize: 15, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
        ];
      }),
      img(IMG.library, 120, 720, 1680, 300, tk, 1),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "RESOURCES", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "FURTHER READING", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { title: "Change by Design", author: "Tim Brown", type: "BOOK" },
        { title: "The Design of Everyday Things", author: "Don Norman", type: "BOOK" },
        { title: "Sprint", author: "Jake Knapp", type: "BOOK" },
        { title: "IDEO Design Thinking", author: "ideo.com/tools", type: "ONLINE" },
      ].flatMap((s, i) => {
        const y = 310 + i * 110;
        return [
          txt(t, { x: 120, y, w: 80, h: 25, content: s.type, fontSize: 11, letterSpacing: 0.2, color: t.accent, opacity: 0.7, zIndex: 2 }),
          txt(t, { x: 250, y, w: 500, h: 30, content: s.title, fontFamily: t.fontDisplay, fontSize: 24, zIndex: 3 }),
          txt(t, { x: 250, y: y + 35, w: 500, h: 25, content: s.author, fontSize: 14, opacity: 0.5, zIndex: 2 }),
          sh({ x: 120, y: y + 80, w: 700, h: 1, fill: t.text, opacity: 0.05, zIndex: 1 }),
        ];
      }),
      txt(t, { x: 120, y: 800, w: 700, h: 60, content: "Questions? Reach out to the instructor.\ndesign-thinking@university.edu", fontSize: 16, lineHeight: 1.7, opacity: 0.45, zIndex: 2 }),
      img(IMG.library, 1050, 100, 750, 850, tk, 1),
      pageNum(t, "05"),
    ]),
  ];
}

function researchPresentation(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: t.accent, opacity: 0.03, zIndex: 0 }),
      txt(t, { x: 120, y: 80, w: 500, h: 25, content: "RESEARCH PRESENTATION  ·  2026", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 1200, h: 260, content: "RESEARCH\nFINDINGS", fontFamily: t.fontDisplay, fontSize: 160, lineHeight: 0.9, zIndex: 3 }),
      sh({ x: 120, y: 490, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 530, w: 700, h: 60, content: "A comprehensive analysis of user behavior patterns\nin digital presentation platforms.", fontSize: 17, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 120, y: 680, w: 500, h: 25, content: "Dr. Jane Smith  ·  University of Design", fontSize: 14, opacity: 0.45, zIndex: 2 }),
      txt(t, { x: 120, y: 960, w: 500, h: 20, content: "PEER REVIEWED  ·  MARCH 2026", fontSize: 10, letterSpacing: 0.3, opacity: 0.25, zIndex: 1 }),
      img(IMG.library, 1100, 100, 720, 900, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "BACKGROUND", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 130, content: "RESEARCH\nQUESTION", fontFamily: t.fontDisplay, fontSize: 80, lineHeight: 1.05, zIndex: 3 }),
      sh({ x: 120, y: 320, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      sh({ x: 120, y: 380, w: 6, h: 80, fill: t.accent, opacity: 0.3, zIndex: 1 }),
      txt(t, { x: 160, y: 380, w: 800, h: 80, content: "\"How does editorial-quality design affect audience engagement and information retention in professional presentations?\"", fontFamily: t.fontDisplay, fontSize: 28, lineHeight: 1.4, opacity: 0.85, zIndex: 3 }),
      txt(t, { x: 120, y: 520, w: 300, h: 25, content: "HYPOTHESES", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      ...[
        "H1: Editorial layouts increase time-on-slide by at least 30%",
        "H2: Typography quality correlates with perceived credibility",
        "H3: Asymmetric layouts improve information recall",
      ].flatMap((s, i) => [
        txt(t, { x: 120, y: 570 + i * 50, w: 800, h: 30, content: s, fontSize: 15, opacity: 0.6, zIndex: 2 }),
      ]),
      txt(t, { x: 120, y: 750, w: 300, h: 25, content: "METHODOLOGY", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 790, w: 800, h: 80, content: "Mixed-methods study with 500 participants across 3 industries. A/B testing of editorial vs. standard templates, followed by qualitative interviews with a subset of 50 participants.", fontSize: 15, lineHeight: 1.8, opacity: 0.55, zIndex: 2 }),
      img(IMG.chart1, 1100, 100, 700, 900, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "slide-up", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "RESULTS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "KEY FINDINGS", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { num: "+47%", label: "TIME ON SLIDE", desc: "Editorial layouts significantly increased average viewing time per slide." },
        { num: "+38%", label: "INFORMATION RECALL", desc: "Participants retained more key points from editorial-designed presentations." },
        { num: "4.6/5", label: "CREDIBILITY SCORE", desc: "Perceived presenter credibility rated higher with quality typography." },
        { num: "92%", label: "PREFERENCE RATE", desc: "Overwhelming majority preferred editorial layouts over standard templates." },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          sh({ x, y: 290, w: 400, h: 300, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 320, w: 340, h: 80, content: s.num, fontFamily: t.fontDisplay, fontSize: 64, color: t.accent, zIndex: 3 }),
          txt(t, { x: x + 30, y: 400, w: 340, h: 25, content: s.label, fontSize: 11, letterSpacing: 0.25, opacity: 0.45, zIndex: 2 }),
          sh({ x: x + 30, y: 440, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: x + 30, y: 460, w: 340, h: 80, content: s.desc, fontSize: 13, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
        ];
      }),
      img(IMG.chart1, 120, 650, 1680, 370, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "ANALYSIS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "DISCUSSION", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 310, w: 800, h: 200, content: "The results strongly support all three hypotheses. Editorial-quality design creates a measurable impact on engagement, retention, and perceived credibility. The effect is most pronounced in high-stakes contexts such as investor presentations and client proposals.\n\nNotably, the quality of typography alone accounted for 60% of the credibility improvement, suggesting that font selection and spacing are the highest-leverage design decisions.", fontSize: 16, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      txt(t, { x: 120, y: 580, w: 300, h: 25, content: "LIMITATIONS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 620, w: 800, h: 120, content: "Study limited to English-language presentations in professional contexts. Cultural variations in design preference were not examined. Sample skewed toward technology and finance sectors. Longitudinal effects of repeated exposure not measured.", fontSize: 15, lineHeight: 1.8, opacity: 0.5, zIndex: 2 }),
      sh({ x: 1100, y: 100, w: 1, h: 700, fill: t.text, opacity: 0.06, zIndex: 1 }),
      txt(t, { x: 1200, y: 100, w: 200, h: 25, content: "IMPLICATIONS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      ...[
        "Invest in typography quality over imagery",
        "Asymmetric layouts outperform centered ones",
        "Whitespace improves comprehension by 23%",
        "Consistent visual rhythm aids recall",
      ].flatMap((s, i) => [
        txt(t, { x: 1200, y: 160 + i * 60, w: 600, h: 30, content: `${i + 1}.  ${s}`, fontSize: 15, opacity: 0.6, zIndex: 2 }),
      ]),
      pageNum(t, "04"),
    ]),
    slide(pid, 4, t.background, "zoom", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "CONCLUSION", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 1200, h: 200, content: "DESIGN\nMATTERS", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, zIndex: 3 }),
      sh({ x: 120, y: 430, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 480, w: 800, h: 100, content: "Editorial-quality design is not a luxury — it is a measurable competitive advantage. Organizations that invest in presentation quality see significant returns in audience engagement and business outcomes.", fontSize: 18, lineHeight: 1.8, opacity: 0.6, zIndex: 2 }),
      txt(t, { x: 120, y: 660, w: 300, h: 20, content: "CONTACT", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 690, w: 400, h: 30, content: "dr.smith@university.edu", fontSize: 20, color: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 740, w: 300, h: 20, content: "PAPER", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 770, w: 400, h: 30, content: "doi.org/10.xxxx/design-2026", fontSize: 16, opacity: 0.5, zIndex: 2 }),
      img(IMG.abstract1, 1100, 100, 700, 900, tk, 1),
      pageNum(t, "05"),
    ]),
  ];
}

function workshop(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "zoom", [
      img(IMG.workshop, 0, 0, 1920, 1080, tk, 1),
      sh({ x: 0, y: 0, w: 1920, h: 1080, fill: "#000000", opacity: 0.5, zIndex: 2 }),
      txt(t, { x: 120, y: 80, w: 400, h: 25, content: "WORKSHOP  ·  MARCH 2026", fontSize: 11, letterSpacing: 0.3, color: "#ffffff", opacity: 0.5, zIndex: 3 }),
      txt(t, { x: 120, y: 350, w: 1200, h: 200, content: "CREATIVE\nWORKSHOP", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, color: "#ffffff", zIndex: 3 }),
      sh({ x: 120, y: 570, w: 80, h: 4, fill: t.accent, zIndex: 3 }),
      txt(t, { x: 120, y: 620, w: 600, h: 40, content: "A hands-on session for collaborative problem solving.", fontSize: 18, color: "#ffffff", opacity: 0.6, zIndex: 3 }),
    ]),
    slide(pid, 1, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "AGENDA", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "TODAY'S PLAN", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { time: "09:00", topic: "WELCOME & ICEBREAKER", dur: "15 min" },
        { time: "09:15", topic: "CONTEXT & FRAMEWORK", dur: "30 min" },
        { time: "09:45", topic: "GROUP EXERCISE 1", dur: "45 min" },
        { time: "10:30", topic: "BREAK", dur: "15 min" },
        { time: "10:45", topic: "GROUP EXERCISE 2", dur: "45 min" },
        { time: "11:30", topic: "PRESENTATIONS & WRAP-UP", dur: "30 min" },
      ].flatMap((s, i) => {
        const y = 290 + i * 100;
        return [
          txt(t, { x: 120, y, w: 100, h: 25, content: s.time, fontSize: 14, color: t.accent, opacity: 0.7, zIndex: 2 }),
          txt(t, { x: 280, y, w: 500, h: 30, content: s.topic, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.1, zIndex: 3 }),
          txt(t, { x: 800, y, w: 100, h: 25, content: s.dur, fontSize: 12, opacity: 0.4, zIndex: 2 }),
          sh({ x: 120, y: y + 60, w: 800, h: 1, fill: t.text, opacity: 0.04, zIndex: 1 }),
        ];
      }),
      img(IMG.palette, 1100, 100, 700, 850, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "FRAMEWORK", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "THE METHOD", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { step: "EXPLORE", desc: "Diverge broadly. Generate as many ideas as possible without judgment." },
        { step: "CLUSTER", desc: "Group similar ideas. Find themes and patterns in the chaos." },
        { step: "DECIDE", desc: "Converge on the strongest concepts. Vote and prioritize." },
        { step: "PROTOTYPE", desc: "Build a quick representation. Make the abstract tangible." },
      ].flatMap((s, i) => {
        const x = 120 + i * 440;
        return [
          sh({ x, y: 320, w: 400, h: 250, fill: t.accent, opacity: 0.03, borderRadius: 4, zIndex: 1 }),
          txt(t, { x: x + 30, y: 350, w: 340, h: 30, content: s.step, fontFamily: t.fontDisplay, fontSize: 28, letterSpacing: 0.1, zIndex: 3 }),
          sh({ x: x + 30, y: 390, w: 30, h: 2, fill: t.accent, opacity: 0.4, zIndex: 2 }),
          txt(t, { x: x + 30, y: 415, w: 340, h: 100, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
        ];
      }),
      img(IMG.library, 120, 640, 1680, 380, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "zoom", [
      txt(t, { x: 260, y: 350, w: 1400, h: 160, content: "YOUR TURN", fontFamily: t.fontDisplay, fontSize: 120, textAlign: "center", zIndex: 3 }),
      sh({ x: 910, y: 530, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 460, y: 580, w: 1000, h: 50, content: "Open your materials and let's begin.", fontSize: 18, textAlign: "center", opacity: 0.45, zIndex: 2 }),
    ]),
  ];
}

function courseOverview(t: Theme, tk: string, pid: string): Omit<Slide, "id">[] {
  return [
    slide(pid, 0, t.background, "fade", [
      sh({ x: 0, y: 0, w: 8, h: 1080, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 80, w: 500, h: 25, content: "COURSE OVERVIEW  ·  SPRING 2026", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 200, w: 900, h: 260, content: "VISUAL\nDESIGN 101", fontFamily: t.fontDisplay, fontSize: 160, lineHeight: 0.9, zIndex: 3 }),
      sh({ x: 120, y: 490, w: 100, h: 4, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 120, y: 530, w: 700, h: 60, content: "Fundamentals of typography, color theory,\nand editorial layout for beginners.", fontSize: 17, lineHeight: 1.7, opacity: 0.55, zIndex: 2 }),
      txt(t, { x: 120, y: 700, w: 200, h: 20, content: "INSTRUCTOR", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 730, w: 400, h: 30, content: "Prof. Alex Morgan", fontSize: 20, zIndex: 3 }),
      txt(t, { x: 120, y: 780, w: 200, h: 20, content: "SCHEDULE", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 810, w: 400, h: 30, content: "Mon / Wed  ·  10:00-11:30", fontSize: 16, opacity: 0.6, zIndex: 2 }),
      img(IMG.classroom, 1050, 80, 770, 920, tk, 1),
      pageNum(t, "01"),
    ]),
    slide(pid, 1, t.background, "slide-left", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "SYLLABUS", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "WEEKLY TOPICS", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 1680, h: 1, fill: t.text, opacity: 0.06, zIndex: 1 }),
      ...[
        { wk: "W1-2", topic: "TYPOGRAPHY BASICS", desc: "Type anatomy, hierarchy, and pairing" },
        { wk: "W3-4", topic: "COLOR THEORY", desc: "Psychology, harmony, and accessibility" },
        { wk: "W5-6", topic: "LAYOUT & GRIDS", desc: "Grid systems, whitespace, and composition" },
        { wk: "W7-8", topic: "EDITORIAL DESIGN", desc: "Magazine layouts and visual storytelling" },
        { wk: "W9-10", topic: "DIGITAL DESIGN", desc: "Responsive design and presentation craft" },
        { wk: "W11-12", topic: "FINAL PROJECT", desc: "Complete editorial presentation with critique" },
      ].flatMap((s, i) => {
        const y = 290 + i * 100;
        return [
          txt(t, { x: 120, y, w: 100, h: 25, content: s.wk, fontSize: 13, color: t.accent, opacity: 0.7, zIndex: 2 }),
          txt(t, { x: 280, y, w: 400, h: 30, content: s.topic, fontFamily: t.fontDisplay, fontSize: 22, letterSpacing: 0.1, zIndex: 3 }),
          txt(t, { x: 750, y, w: 400, h: 25, content: s.desc, fontSize: 14, opacity: 0.5, zIndex: 2 }),
          sh({ x: 120, y: y + 55, w: 1100, h: 1, fill: t.text, opacity: 0.04, zIndex: 1 }),
        ];
      }),
      img(IMG.library, 1350, 290, 450, 600, tk, 1),
      pageNum(t, "02"),
    ]),
    slide(pid, 2, t.background, "fade", [
      txt(t, { x: 120, y: 100, w: 200, h: 25, content: "GRADING", fontSize: 11, letterSpacing: 0.3, opacity: 0.4, zIndex: 2 }),
      txt(t, { x: 120, y: 160, w: 800, h: 70, content: "ASSESSMENT", fontFamily: t.fontDisplay, fontSize: 64, zIndex: 3 }),
      sh({ x: 120, y: 250, w: 50, h: 3, fill: t.accent, zIndex: 2 }),
      ...[
        { item: "WEEKLY EXERCISES", pct: "30%", desc: "Short assignments applying each week's topic" },
        { item: "MIDTERM PROJECT", pct: "25%", desc: "Magazine spread design with typography focus" },
        { item: "FINAL PROJECT", pct: "35%", desc: "Complete editorial presentation from scratch" },
        { item: "PARTICIPATION", pct: "10%", desc: "Class discussions and peer critique sessions" },
      ].flatMap((s, i) => {
        const y = 320 + i * 150;
        return [
          txt(t, { x: 120, y, w: 80, h: 50, content: s.pct, fontFamily: t.fontDisplay, fontSize: 36, color: t.accent, zIndex: 3 }),
          txt(t, { x: 250, y, w: 500, h: 30, content: s.item, fontFamily: t.fontDisplay, fontSize: 24, letterSpacing: 0.1, zIndex: 3 }),
          txt(t, { x: 250, y: y + 35, w: 600, h: 30, content: s.desc, fontSize: 14, lineHeight: 1.7, opacity: 0.5, zIndex: 2 }),
          sh({ x: 120, y: y + 100, w: 800, h: 1, fill: t.text, opacity: 0.05, zIndex: 1 }),
        ];
      }),
      img(IMG.palette, 1100, 100, 700, 900, tk, 1),
      pageNum(t, "03"),
    ]),
    slide(pid, 3, t.background, "zoom", [
      txt(t, { x: 260, y: 300, w: 1400, h: 200, content: "LET'S\nDESIGN", fontFamily: t.fontDisplay, fontSize: 140, lineHeight: 0.95, textAlign: "center", zIndex: 3 }),
      sh({ x: 910, y: 520, w: 100, h: 3, fill: t.accent, zIndex: 2 }),
      txt(t, { x: 460, y: 570, w: 1000, h: 50, content: "Office hours: Thursday 2-4pm  ·  Room 312", fontSize: 16, textAlign: "center", opacity: 0.45, zIndex: 2 }),
      txt(t, { x: 460, y: 630, w: 1000, h: 30, content: "prof.morgan@university.edu", fontSize: 18, textAlign: "center", color: t.accent, zIndex: 3 }),
    ]),
  ];
}

export const EDUCATION_TEMPLATES: TemplateDefinition[] = [
  {
    id: "lesson-plan",
    name: "Lesson Plan",
    description: "Learning objectives, hands-on activities, core principles, and reading resources.",
    slideCount: 5,
    category: "education",
    generate: (theme, themeKey, pid) => lessonPlan(theme, themeKey, pid),
  },
  {
    id: "research-presentation",
    name: "Research Presentation",
    description: "Research question, methodology, key findings with data, discussion, and conclusion.",
    slideCount: 5,
    category: "education",
    generate: (theme, themeKey, pid) => researchPresentation(theme, themeKey, pid),
  },
  {
    id: "workshop",
    name: "Workshop",
    description: "Timed agenda, collaborative framework, group exercises, and facilitation slides.",
    slideCount: 4,
    category: "education",
    generate: (theme, themeKey, pid) => workshop(theme, themeKey, pid),
  },
  {
    id: "course-overview",
    name: "Course Overview",
    description: "Syllabus with weekly topics, grading breakdown, and instructor information.",
    slideCount: 4,
    category: "education",
    generate: (theme, themeKey, pid) => courseOverview(theme, themeKey, pid),
  },
];
