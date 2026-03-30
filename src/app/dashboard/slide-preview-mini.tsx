"use client";

import type { Slide } from "@/types/elements";

interface Props {
  slide: Omit<Slide, "id"> | undefined;
}

export function SlidePreviewMini({ slide }: Props) {
  if (!slide) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 origin-top-left scale-[calc(1/16)]"
      style={{ width: 1920, height: 1080 }}
    >
      {slide.elements.map((el) => {
        if (el.type === "shape") {
          return (
            <div
              key={el.id}
              className="absolute"
              style={{
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.h,
                backgroundColor: el.fill,
                borderRadius:
                  el.shape === "circle" ? "50%" : el.borderRadius,
                opacity: el.opacity,
                transform: el.rotation
                  ? `rotate(${el.rotation}deg)`
                  : undefined,
              }}
            />
          );
        }
        if (el.type === "text") {
          return (
            <div
              key={el.id}
              className="absolute overflow-hidden"
              style={{
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.h,
                fontFamily: el.fontFamily,
                fontSize: el.fontSize,
                fontWeight: el.fontWeight,
                lineHeight: el.lineHeight,
                letterSpacing: `${el.letterSpacing}em`,
                color: el.color,
                opacity: el.opacity,
                textAlign: el.textAlign as "left" | "center" | "right",
                whiteSpace: "pre-line",
                transform: el.rotation
                  ? `rotate(${el.rotation}deg)`
                  : undefined,
              }}
            >
              {el.content}
            </div>
          );
        }
        if (el.type === "image") {
          return (
            <div
              key={el.id}
              className="absolute overflow-hidden bg-neutral-800"
              style={{
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.h,
                opacity: el.opacity,
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
