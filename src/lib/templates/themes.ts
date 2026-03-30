export interface Theme {
  primary: string;
  background: string;
  text: string;
  accent: string;
  fontDisplay: string;
  fontBody: string;
  label: string;
}

export type CustomThemeMap = Record<string, Theme>;

export const THEMES: Record<string, Theme> = {
  "editorial-blue": {
    primary: "#1a1aff",
    background: "#f5f5f0",
    text: "#0a0a0a",
    accent: "#1a1aff",
    fontDisplay: "var(--font-bebas-neue)",
    fontBody: "var(--font-dm-sans)",
    label: "Editorial Blue",
  },
  monochrome: {
    primary: "#0a0a0a",
    background: "#ffffff",
    text: "#0a0a0a",
    accent: "#0a0a0a",
    fontDisplay: "var(--font-playfair-display)",
    fontBody: "var(--font-dm-sans)",
    label: "Monochrome",
  },
  "dark-editorial": {
    primary: "#e8e0d0",
    background: "#0f0f0f",
    text: "#e8e0d0",
    accent: "#ff3b00",
    fontDisplay: "var(--font-barlow-condensed)",
    fontBody: "var(--font-dm-mono)",
    label: "Dark Editorial",
  },
  "warm-magazine": {
    primary: "#2d1f14",
    background: "#f7f0e6",
    text: "#2d1f14",
    accent: "#c44b1b",
    fontDisplay: "var(--font-cormorant-garamond)",
    fontBody: "var(--font-lato)",
    label: "Warm Magazine",
  },
  "swiss-minimal": {
    primary: "#ff0000",
    background: "#ffffff",
    text: "#000000",
    accent: "#ff0000",
    fontDisplay: "var(--font-barlow-condensed)",
    fontBody: "var(--font-barlow)",
    label: "Swiss Minimal",
  },
};

export const FONT_OPTIONS: Record<string, { display: string[]; body: string[] }> = {
  "editorial-blue": {
    display: ["var(--font-bebas-neue)"],
    body: ["var(--font-dm-sans)"],
  },
  monochrome: {
    display: ["var(--font-playfair-display)"],
    body: ["var(--font-dm-sans)"],
  },
  "dark-editorial": {
    display: ["var(--font-barlow-condensed)"],
    body: ["var(--font-dm-mono)"],
  },
  "warm-magazine": {
    display: ["var(--font-cormorant-garamond)"],
    body: ["var(--font-lato)"],
  },
  "swiss-minimal": {
    display: ["var(--font-barlow-condensed)"],
    body: ["var(--font-barlow)"],
  },
};

export const ALL_FONTS = [
  { value: "var(--font-bebas-neue)", label: "Bebas Neue" },
  { value: "var(--font-dm-sans)", label: "DM Sans" },
  { value: "var(--font-playfair-display)", label: "Playfair Display" },
  { value: "var(--font-dm-mono)", label: "DM Mono" },
  { value: "var(--font-cormorant-garamond)", label: "Cormorant Garamond" },
  { value: "var(--font-lato)", label: "Lato" },
  { value: "var(--font-barlow-condensed)", label: "Barlow Condensed" },
  { value: "var(--font-barlow)", label: "Barlow" },
];
