export type ElementType = "text" | "image" | "shape" | "arrow" | "divider" | "embed" | "line" | "table";

export type ElementAnimation = "none" | "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "zoom-out" | "rotate-in" | "bounce-in";

export interface ElementShadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  shadow?: ElementShadow;
  groupId?: string;
  linkUrl?: string;
  borderWidth?: number;
  borderColor?: string;
  animation?: ElementAnimation;
  animationDelay?: number;
  animationDuration?: number;
  animationEasing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline" | "line-through";
  textStroke?: { width: number; color: string };
  lineHeight: number;
  letterSpacing: number;
  color: string;
  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  objectFit: "cover" | "contain" | "fill";
  filter: string;
  borderRadius?: number;
  flipX?: boolean;
  flipY?: boolean;
  isPlaceholder?: boolean;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shape: "rect" | "circle" | "triangle" | "diamond" | "star" | "pentagon" | "hexagon";
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
}

export interface ArrowElement extends BaseElement {
  type: "arrow";
  direction: "right" | "left" | "up" | "down";
  color: string;
  strokeWidth: number;
  dashPattern?: "solid" | "dashed" | "dotted";
}

export interface DividerElement extends BaseElement {
  type: "divider";
  color: string;
  strokeWidth: number;
  dashPattern?: "solid" | "dashed" | "dotted";
}

export interface EmbedElement extends BaseElement {
  type: "embed";
  url: string;
  aspectRatio?: number;
}

export interface LineElement extends BaseElement {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: string;
  strokeWidth: number;
  strokeDash: "solid" | "dashed" | "dotted";
  arrowStart: boolean;
  arrowEnd: boolean;
}

export interface TableElement extends BaseElement {
  type: "table";
  rows: number;
  cols: number;
  cells: string[][];
  headerRow: boolean;
  borderColor: string;
  headerBgColor: string;
  cellPadding: number;
  fontSize: number;
}

export type SlideElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | ArrowElement
  | DividerElement
  | EmbedElement
  | LineElement
  | TableElement;

export type SlideTransition = "fade" | "slide-left" | "slide-up" | "slide-right" | "zoom" | "blur" | "none";

export interface Slide {
  id: string;
  presentationId: string;
  order: number;
  transition: SlideTransition;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements: SlideElement[] | null;
  notes: string;
  duration?: number;
}
