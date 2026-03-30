"use client";

import { ALL_FONTS } from "@/lib/templates/themes";

interface Props {
  fontDisplay: string;
  fontBody: string;
  onChangeDisplay: (v: string) => void;
  onChangeBody: (v: string) => void;
}

export function ThemeBuilderFonts({ fontDisplay, fontBody, onChangeDisplay, onChangeBody }: Props) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
          Heading font
        </span>
        <select
          value={fontDisplay}
          onChange={(e) => onChangeDisplay(e.target.value)}
          className="mt-0.5 w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1.5 text-[11px] text-neutral-200 outline-none focus:border-neutral-500"
        >
          {ALL_FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
          Body font
        </span>
        <select
          value={fontBody}
          onChange={(e) => onChangeBody(e.target.value)}
          className="mt-0.5 w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1.5 text-[11px] text-neutral-200 outline-none focus:border-neutral-500"
        >
          {ALL_FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
