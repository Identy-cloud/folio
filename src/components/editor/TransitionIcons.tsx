import { Minus, CircleHalf, ArrowLineLeft, ArrowLineUp, ArrowLineRight, MagnifyingGlassPlus, Drop } from "@phosphor-icons/react";
import type { SlideTransition } from "@/types/elements";

const ICON_MAP: Record<SlideTransition, typeof Minus> = {
  none: Minus,
  fade: CircleHalf,
  "slide-left": ArrowLineLeft,
  "slide-right": ArrowLineRight,
  "slide-up": ArrowLineUp,
  zoom: MagnifyingGlassPlus,
  blur: Drop,
};

export const TRANSITION_LIST: SlideTransition[] = ["none", "fade", "slide-left", "slide-right", "slide-up", "zoom", "blur"];

export function TransitionIcon({ type, size = 14 }: { type: SlideTransition; size?: number }) {
  const Icon = ICON_MAP[type] ?? CircleHalf;
  return <Icon size={size} weight="bold" />;
}
