import type { ElementAnimation } from "@/types/elements";

const KEYFRAME_MAP: Record<Exclude<ElementAnimation, "none">, string> = {
  "fade-up": "el-fade-up",
  "fade-down": "el-fade-down",
  "fade-left": "el-fade-left",
  "fade-right": "el-fade-right",
  "zoom-in": "el-zoom-in",
};

export function getElementAnimationStyle(
  animation: ElementAnimation | undefined,
  delay: number,
): React.CSSProperties {
  const type = animation ?? "fade-up";
  if (type === "none") return {};
  const keyframe = KEYFRAME_MAP[type];
  return {
    opacity: 0,
    animation: `${keyframe} 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms forwards`,
  };
}
