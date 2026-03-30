"use client";

import type { Theme } from "@/lib/templates/themes";

interface Props {
  theme: Theme;
}

export function ThemeBuilderPreview({ theme }: Props) {
  return (
    <div
      className="aspect-video w-full rounded border border-neutral-700 overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      <div className="flex h-full flex-col items-center justify-center gap-1.5 p-3">
        <span
          className="text-[11px] font-bold leading-tight text-center"
          style={{ color: theme.text, fontFamily: theme.fontDisplay }}
        >
          Heading Preview
        </span>
        <span
          className="text-[8px] leading-tight text-center"
          style={{ color: theme.text, fontFamily: theme.fontBody, opacity: 0.7 }}
        >
          Body text goes here with your chosen font pairing.
        </span>
        <div className="mt-1 flex gap-1">
          <span
            className="h-3 w-3 rounded-full border border-black/10"
            style={{ backgroundColor: theme.primary }}
          />
          <span
            className="h-3 w-3 rounded-full border border-black/10"
            style={{ backgroundColor: theme.accent }}
          />
          <span
            className="h-3 w-3 rounded-full border border-black/10"
            style={{ backgroundColor: theme.text }}
          />
        </div>
      </div>
    </div>
  );
}
