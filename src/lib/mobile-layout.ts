import type { SlideElement, TextElement } from "@/types/elements";

const MOBILE_W = 430;
const PAD = 24;
const CONTENT_W = MOBILE_W - PAD * 2;
const GAP = 20;

export function generateMobileElements(elements: SlideElement[]): SlideElement[] {
  const titles: SlideElement[] = [];
  const images: SlideElement[] = [];
  const body: SlideElement[] = [];
  const decorative: SlideElement[] = [];

  for (const el of elements) {
    if (el.type === "text" && el.fontSize >= 48) titles.push(el);
    else if (el.type === "image") images.push(el);
    else if (el.type === "text" && el.opacity > 0.2) body.push(el);
    else if (el.type === "shape" && el.h > 10 && el.w > 10) decorative.push(el);
    // Skip small decorative shapes and arrows
  }

  // Sort titles by font size descending
  titles.sort((a, b) => {
    const fa = a.type === "text" ? a.fontSize : 0;
    const fb = b.type === "text" ? b.fontSize : 0;
    return fb - fa;
  });

  const ordered = [...titles, ...images, ...body, ...decorative];
  const result: SlideElement[] = [];
  let y = PAD;

  for (const el of ordered) {
    if (el.type === "text") {
      const text = el as TextElement;
      const isTitle = text.fontSize >= 48;
      const mobileFontSize = isTitle
        ? Math.min(Math.round(text.fontSize * 0.45), 56)
        : Math.max(Math.round(text.fontSize * 0.75), 14);
      const lineCount = Math.ceil(text.content.length / (CONTENT_W / (mobileFontSize * 0.6)));
      const h = Math.max(Math.round(lineCount * mobileFontSize * (text.lineHeight || 1.4)), mobileFontSize + 10);

      result.push({
        ...text,
        x: PAD,
        y,
        w: CONTENT_W,
        h,
        fontSize: mobileFontSize,
        rotation: 0,
      });
      y += h + GAP;
    } else if (el.type === "image") {
      const aspectRatio = el.h / el.w;
      const h = Math.round(CONTENT_W * aspectRatio);
      result.push({
        ...el,
        x: PAD,
        y,
        w: CONTENT_W,
        h,
        rotation: 0,
      });
      y += h + GAP;
    } else if (el.type === "shape") {
      // Scale shape proportionally
      const scale = CONTENT_W / el.w;
      const h = Math.round(el.h * Math.min(scale, 1));
      const w = Math.round(el.w * Math.min(scale, 1));
      result.push({
        ...el,
        x: PAD + (CONTENT_W - w) / 2,
        y,
        w,
        h,
        rotation: 0,
      });
      y += h + GAP;
    }
  }

  return result;
}
