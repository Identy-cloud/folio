import { Minus, CircleHalf, ArrowLineLeft, ArrowLineUp, MagnifyingGlassPlus } from "@phosphor-icons/react";
import type { SlideTransition } from "@/types/elements";

const ICON_MAP: Record<SlideTransition, typeof Minus> = {
  none: Minus,
  fade: CircleHalf,
  "slide-left": ArrowLineLeft,
  "slide-up": ArrowLineUp,
  zoom: MagnifyingGlassPlus,
};

export const TRANSITION_LIST: SlideTransition[] = ["none", "fade", "slide-left", "slide-up", "zoom"];

export function TransitionIcon({ type, size = 14 }: { type: SlideTransition; size?: number }) {
  const Icon = ICON_MAP[type] ?? CircleHalf;
  return <Icon size={size} weight="bold" />;
}
