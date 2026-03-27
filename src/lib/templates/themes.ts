export interface Theme {
  primary: string;
  background: string;
  text: string;
  accent: string;
  fontDisplay: string;
  fontBody: string;
  label: string;
}

export const THEMES: Record<string, Theme> = {
  "editorial-blue": {
    primary: "#1a1aff",
    background: "#f5f5f0",
    text: "#0a0a0a",
    accent: "#1a1aff",
    fontDisplay: "Bebas Neue",
    fontBody: "DM Sans",
    label: "Editorial Blue",
  },
  monochrome: {
    primary: "#0a0a0a",
    background: "#ffffff",
    text: "#0a0a0a",
    accent: "#0a0a0a",
    fontDisplay: "Playfair Display",
    fontBody: "Inter",
    label: "Monochrome",
  },
  "dark-editorial": {
    primary: "#e8e0d0",
    background: "#0f0f0f",
    text: "#e8e0d0",
    accent: "#ff3b00",
    fontDisplay: "Arial Narrow",
    fontBody: "DM Mono",
    label: "Dark Editorial",
  },
  "warm-magazine": {
    primary: "#2d1f14",
    background: "#f7f0e6",
    text: "#2d1f14",
    accent: "#c44b1b",
    fontDisplay: "Cormorant Garamond",
    fontBody: "Lato",
    label: "Warm Magazine",
  },
  "swiss-minimal": {
    primary: "#ff0000",
    background: "#ffffff",
    text: "#000000",
    accent: "#ff0000",
    fontDisplay: "Barlow Condensed",
    fontBody: "Barlow",
    label: "Swiss Minimal",
  },
};
