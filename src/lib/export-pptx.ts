import PptxGenJS from "pptxgenjs";
import type {
  Slide,
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
  ArrowElement,
  DividerElement,
} from "@/types/elements";

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const SLIDE_W = 10;
const SLIDE_H = 5.625;

function pxToInchX(px: number): number {
  return (px / CANVAS_W) * SLIDE_W;
}

function pxToInchY(px: number): number {
  return (px / CANVAS_H) * SLIDE_H;
}

function pxToInchW(px: number): number {
  return (px / CANVAS_W) * SLIDE_W;
}

function pxToInchH(px: number): number {
  return (px / CANVAS_H) * SLIDE_H;
}

function pxToPt(px: number): number {
  return px * 0.75;
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "").slice(0, 6);
  if (clean.length === 3) {
    return clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return clean.padEnd(6, "0");
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function getDashType(
  pattern?: "solid" | "dashed" | "dotted"
): "solid" | "dash" | "sysDot" {
  if (pattern === "dashed") return "dash";
  if (pattern === "dotted") return "sysDot";
  return "solid";
}

function addTextElement(
  pptSlide: PptxGenJS.Slide,
  el: TextElement
): void {
  const plainText = stripHtml(el.content);
  if (!plainText.trim()) return;

  const isBold = el.fontWeight >= 700;
  const isItalic = el.fontStyle === "italic";
  const isUnderline = el.textDecoration === "underline";
  const isStrike = el.textDecoration === "line-through";

  const shadowOpts = el.textShadow
    ? {
        type: "outer" as const,
        blur: el.textShadow.blur * 0.75,
        offset: Math.max(Math.abs(el.textShadow.offsetX), Math.abs(el.textShadow.offsetY)) * 0.75,
        color: hexToRgb(el.textShadow.color.startsWith("rgba") ? "#000000" : el.textShadow.color),
        opacity: 0.4,
      }
    : undefined;

  pptSlide.addText(plainText, {
    x: pxToInchX(el.x),
    y: pxToInchY(el.y),
    w: pxToInchW(el.w),
    h: pxToInchH(el.h),
    fontSize: pxToPt(el.fontSize),
    fontFace: el.fontFamily,
    color: hexToRgb(el.color),
    bold: isBold,
    italic: isItalic,
    underline: isUnderline ? { style: "sng" } : undefined,
    strike: isStrike ? "sngStrike" : undefined,
    align: el.textAlign,
    valign: el.verticalAlign,
    lineSpacingMultiple: el.lineHeight,
    charSpacing: el.letterSpacing * el.fontSize,
    rotate: el.rotation,
    transparency: Math.round((1 - el.opacity) * 100),
    shadow: shadowOpts,
    wrap: true,
  });
}

function addImageElement(
  pptSlide: PptxGenJS.Slide,
  el: ImageElement
): void {
  if (!el.src || el.isPlaceholder) return;

  const isDataUrl = el.src.startsWith("data:");
  const isHttpUrl =
    el.src.startsWith("http://") || el.src.startsWith("https://");

  if (!isDataUrl && !isHttpUrl) return;

  pptSlide.addImage({
    path: isHttpUrl ? el.src : undefined,
    data: isDataUrl ? el.src : undefined,
    x: pxToInchX(el.x),
    y: pxToInchY(el.y),
    w: pxToInchW(el.w),
    h: pxToInchH(el.h),
    rotate: el.rotation,
    transparency: Math.round((1 - el.opacity) * 100),
    rounding: el.borderRadius ? true : false,
  });
}

function getShapeType(
  shape: ShapeElement["shape"]
): keyof typeof PptxGenJS.ShapeType {
  switch (shape) {
    case "rect":
      return "rect";
    case "circle":
      return "ellipse";
    case "triangle":
      return "triangle";
    case "diamond":
      return "diamond";
    case "star":
      return "star5";
    case "pentagon":
      return "pentagon";
    case "hexagon":
      return "hexagon";
    default:
      return "rect";
  }
}

function addShapeElement(
  pptSlide: PptxGenJS.Slide,
  el: ShapeElement,
  pptx: PptxGenJS
): void {
  const shapeKey = getShapeType(el.shape);
  const shapeType =
    pptx.ShapeType[shapeKey as keyof typeof pptx.ShapeType];

  if (!shapeType) return;

  pptSlide.addShape(shapeType, {
    x: pxToInchX(el.x),
    y: pxToInchY(el.y),
    w: pxToInchW(el.w),
    h: pxToInchH(el.h),
    fill: el.fill
      ? { color: hexToRgb(el.fill), transparency: Math.round((1 - el.opacity) * 100) }
      : undefined,
    line: el.stroke
      ? {
          color: hexToRgb(el.stroke),
          width: el.strokeWidth || 1,
        }
      : undefined,
    rotate: el.rotation,
    rectRadius: el.borderRadius
      ? pxToInchW(el.borderRadius)
      : undefined,
  });
}

function addArrowElement(
  pptSlide: PptxGenJS.Slide,
  el: ArrowElement,
  pptx: PptxGenJS
): void {
  const x = pxToInchX(el.x);
  const y = pxToInchY(el.y);
  const w = pxToInchW(el.w);
  const h = pxToInchH(el.h);

  let x1 = x;
  let y1 = y + h / 2;
  let x2 = x + w;
  let y2 = y + h / 2;

  if (el.direction === "left") {
    x1 = x + w;
    x2 = x;
  } else if (el.direction === "up") {
    x1 = x + w / 2;
    y1 = y + h;
    x2 = x + w / 2;
    y2 = y;
  } else if (el.direction === "down") {
    x1 = x + w / 2;
    y1 = y;
    x2 = x + w / 2;
    y2 = y + h;
  }

  pptSlide.addShape(pptx.ShapeType.line, {
    x: x1,
    y: y1,
    w: Math.abs(x2 - x1) || 0.01,
    h: Math.abs(y2 - y1) || 0.01,
    line: {
      color: hexToRgb(el.color),
      width: el.strokeWidth || 2,
      dashType: getDashType(el.dashPattern),
      endArrowType: "arrow",
    },
    rotate: el.rotation,
  });
}

function addDividerElement(
  pptSlide: PptxGenJS.Slide,
  el: DividerElement,
  pptx: PptxGenJS
): void {
  pptSlide.addShape(pptx.ShapeType.line, {
    x: pxToInchX(el.x),
    y: pxToInchY(el.y + el.h / 2),
    w: pxToInchW(el.w),
    h: 0,
    line: {
      color: hexToRgb(el.color),
      width: el.strokeWidth || 1,
      dashType: getDashType(el.dashPattern),
    },
    rotate: el.rotation,
  });
}

function addElement(
  pptSlide: PptxGenJS.Slide,
  el: SlideElement,
  pptx: PptxGenJS
): void {
  switch (el.type) {
    case "text":
      addTextElement(pptSlide, el);
      break;
    case "image":
      addImageElement(pptSlide, el);
      break;
    case "shape":
      addShapeElement(pptSlide, el, pptx);
      break;
    case "arrow":
      addArrowElement(pptSlide, el, pptx);
      break;
    case "divider":
      addDividerElement(pptSlide, el, pptx);
      break;
    case "embed":
      break;
  }
}

export async function generatePptxBuffer(
  title: string,
  slideData: Slide[]
): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.title = title;
  pptx.layout = "LAYOUT_WIDE";

  for (const slide of slideData) {
    const pptSlide = pptx.addSlide();

    if (slide.backgroundColor && slide.backgroundColor !== "transparent") {
      pptSlide.background = { fill: hexToRgb(slide.backgroundColor) };
    }

    if (slide.backgroundImage) {
      const isHttp =
        slide.backgroundImage.startsWith("http://") ||
        slide.backgroundImage.startsWith("https://");
      if (isHttp) {
        pptSlide.background = { path: slide.backgroundImage };
      }
    }

    const sortedElements = [...slide.elements]
      .filter((el) => el.visible !== false)
      .sort((a, b) => a.zIndex - b.zIndex);

    for (const el of sortedElements) {
      try {
        addElement(pptSlide, el, pptx);
      } catch {
        // Skip elements that fail to convert
      }
    }

    if (slide.notes) {
      pptSlide.addNotes(stripHtml(slide.notes));
    }
  }

  const output = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  return output;
}
