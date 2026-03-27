export type ElementType = "text" | "image" | "shape" | "arrow" | "divider";

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
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
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
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shape: "rect" | "circle" | "triangle";
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
}

export type SlideElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | ArrowElement;

export interface Slide {
  id: string;
  presentationId: string;
  order: number;
  backgroundColor: string;
  backgroundImage: string | null;
  elements: SlideElement[];
  mobileElements: SlideElement[] | null;
}
