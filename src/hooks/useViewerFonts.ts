"use client";

import { useEffect } from "react";
import type { CustomFont } from "./useCustomFonts";

const registeredViewerFonts = new Set<string>();

export function useViewerFonts(presentationId?: string) {
  useEffect(() => {
    if (!presentationId) return;

    let cancelled = false;

    async function loadFonts() {
      try {
        const res = await fetch(`/api/fonts/presentation?id=${presentationId}`);
        if (!res.ok || cancelled) return;
        const data: { fonts: CustomFont[] } = await res.json();

        for (const font of data.fonts) {
          if (registeredViewerFonts.has(font.id)) continue;
          try {
            const face = new FontFace(font.family, `url(${font.url})`, { display: "swap" });
            const loaded = await face.load();
            if (cancelled) return;
            document.fonts.add(loaded);
            registeredViewerFonts.add(font.id);
          } catch {
            /* font load failed, skip silently */
          }
        }
      } catch {
        /* fetch failed, skip silently */
      }
    }

    loadFonts();
    return () => { cancelled = true; };
  }, [presentationId]);
}
