import type { Slide, TextElement, ShapeElement, ImageElement } from "@/types/elements";
import type { Theme } from "./themes";

export const IMG = {
  portrait1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80&auto=format&fit=crop",
  portrait2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
  portrait3: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop",
  arch1: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop",
  arch2: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
  abstract1: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&auto=format&fit=crop",
  abstract2: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
  product1: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
  product2: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80&auto=format&fit=crop",
  nature1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop",
  nature2: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop",
  office1: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80&auto=format&fit=crop",
  office2: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop",
  chart1: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
  classroom: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80&auto=format&fit=crop",
  library: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop",
  camera: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80&auto=format&fit=crop",
  palette: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80&auto=format&fit=crop",
  workshop: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop",
};

export function isDark(themeKey: string) {
  return themeKey === "dark-editorial" || themeKey === "monochrome";
}

export function txt(
  t: Theme,
  o: Partial<TextElement> & { x: number; y: number; w: number; h: number; content: string }
): TextElement {
  return {
    id: crypto.randomUUID(), type: "text", rotation: 0, opacity: 1, zIndex: 1, locked: false,
    fontFamily: t.fontBody, fontSize: 24, fontWeight: 400, lineHeight: 1.5,
    letterSpacing: 0, color: t.text, textAlign: "left", verticalAlign: "top",
    ...o,
  };
}

export function sh(
  o: Partial<ShapeElement> & { x: number; y: number; w: number; h: number }
): ShapeElement {
  return {
    id: crypto.randomUUID(), type: "shape", rotation: 0, opacity: 1, zIndex: 0, locked: false,
    shape: "rect", fill: "#cccccc", stroke: "transparent", strokeWidth: 0, borderRadius: 0,
    ...o,
  };
}

export function img(
  src: string, x: number, y: number, w: number, h: number, themeKey: string, z = 1
): ImageElement {
  return {
    id: crypto.randomUUID(), type: "image", x, y, w, h,
    rotation: 0, opacity: 1, zIndex: z, locked: false,
    src, objectFit: "cover",
    filter: isDark(themeKey) ? "grayscale(100%)" : "",
    isPlaceholder: true,
  };
}

export function pageNum(t: Theme, num: string): TextElement {
  return txt(t, {
    x: 1820, y: 1030, w: 60, h: 30, content: num,
    fontSize: 12, letterSpacing: 0.15, textAlign: "right", opacity: 0.35, zIndex: 1,
  });
}

export function slide(
  pid: string, order: number, bg: string, transition: Slide["transition"],
  elements: Slide["elements"]
): Omit<Slide, "id"> {
  return {
    presentationId: pid, order, transition,
    backgroundColor: bg, backgroundImage: null, mobileElements: null, notes: "",
    elements,
  };
}
