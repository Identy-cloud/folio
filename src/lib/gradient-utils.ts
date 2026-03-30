import type { GradientDef } from "@/types/elements";

export function gradientToCSS(gradient: GradientDef): string {
  const stops = gradient.stops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");

  if (gradient.type === "radial") {
    return `radial-gradient(circle, ${stops})`;
  }
  return `linear-gradient(${gradient.angle ?? 135}deg, ${stops})`;
}

export function slideBackground(
  bg: string,
  gradient?: GradientDef | null,
  bgImage?: string | null,
): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (gradient && gradient.stops.length >= 2) {
    style.background = gradientToCSS(gradient);
  } else {
    style.background = bg;
  }
  if (bgImage?.startsWith("https://")) {
    style.backgroundImage = `url("${bgImage}")`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
  }
  return style;
}

export const GRADIENT_PRESETS: GradientDef[] = [
  { type: "linear", angle: 135, stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }] },
  { type: "linear", angle: 135, stops: [{ color: "#f093fb", position: 0 }, { color: "#f5576c", position: 100 }] },
  { type: "linear", angle: 135, stops: [{ color: "#4facfe", position: 0 }, { color: "#00f2fe", position: 100 }] },
  { type: "linear", angle: 135, stops: [{ color: "#43e97b", position: 0 }, { color: "#38f9d7", position: 100 }] },
  { type: "linear", angle: 135, stops: [{ color: "#fa709a", position: 0 }, { color: "#fee140", position: 100 }] },
  { type: "linear", angle: 135, stops: [{ color: "#a18cd1", position: 0 }, { color: "#fbc2eb", position: 100 }] },
  { type: "linear", angle: 180, stops: [{ color: "#0a0a0a", position: 0 }, { color: "#1a1aff", position: 100 }] },
  { type: "linear", angle: 135, stops: [{ color: "#ff3b00", position: 0 }, { color: "#eab308", position: 100 }] },
  { type: "radial", stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }] },
  { type: "linear", angle: 90, stops: [{ color: "#0f0c29", position: 0 }, { color: "#302b63", position: 50 }, { color: "#24243e", position: 100 }] },
];
