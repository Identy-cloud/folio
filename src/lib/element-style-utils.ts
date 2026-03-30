import type { ElementShadow, SlideElement, TextElement } from "@/types/elements";

export function textShadowCSS(shadow?: ElementShadow): string | undefined {
  if (!shadow) return undefined;
  return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}`;
}

export function filterBlurCSS(blur?: number): string | undefined {
  if (!blur || blur <= 0) return undefined;
  return `blur(${blur}px)`;
}

export function combineFilters(
  existingFilter: string | undefined,
  blur?: number
): string | undefined {
  const blurVal = filterBlurCSS(blur);
  if (!existingFilter && !blurVal) return undefined;
  if (!existingFilter) return blurVal;
  if (!blurVal) return existingFilter;
  return `${existingFilter} ${blurVal}`;
}

export function isTextElement(el: SlideElement): el is TextElement {
  return el.type === "text";
}
