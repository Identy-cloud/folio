import type { ElementAnimation } from "@/types/elements";

const KEYFRAME_MAP: Record<Exclude<ElementAnimation, "none">, string> = {
  "fade-up": "el-fade-up",
  "fade-down": "el-fade-down",
  "fade-left": "el-fade-left",
  "fade-right": "el-fade-right",
  "zoom-in": "el-zoom-in",
};

const EASING_MAP: Record<string, string> = {
  ease: "cubic-bezier(0.22,1,0.36,1)",
  "ease-in": "cubic-bezier(0.55,0.055,0.675,0.19)",
  "ease-out": "cubic-bezier(0.215,0.61,0.355,1)",
  "ease-in-out": "cubic-bezier(0.645,0.045,0.355,1)",
  linear: "linear",
};

export function getElementAnimationStyle(
  animation: ElementAnimation | undefined,
  delay: number,
  duration?: number,
  easing?: string,
): React.CSSProperties {
  const type = animation ?? "fade-up";
  if (type === "none") return {};
  const keyframe = KEYFRAME_MAP[type];
  const dur = ((duration ?? 500) / 1000).toFixed(2);
  const ease = EASING_MAP[easing ?? "ease"] ?? EASING_MAP.ease;
  return {
    opacity: 0,
    animation: `${keyframe} ${dur}s ${ease} ${delay}ms forwards`,
  };
}
