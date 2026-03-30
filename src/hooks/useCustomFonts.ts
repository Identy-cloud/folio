"use client";

import { useEffect, useState, useCallback } from "react";

export interface CustomFont {
  id: string;
  userId: string;
  name: string;
  family: string;
  url: string;
  format: string;
  createdAt: string;
}

const registeredFonts = new Set<string>();

function fontFormatHint(format: string): string {
  if (format === "ttf") return "truetype";
  if (format === "otf") return "opentype";
  return format;
}

async function registerFont(font: CustomFont): Promise<void> {
  if (registeredFonts.has(font.id)) return;
  const face = new FontFace(
    font.family,
    `url(${font.url})`,
    { display: "swap" },
  );
  try {
    const loaded = await face.load();
    document.fonts.add(loaded);
    registeredFonts.add(font.id);
  } catch {
    console.warn(`Failed to load font: ${font.name}`);
  }
}

export function useCustomFonts() {
  const [fonts, setFonts] = useState<CustomFont[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFonts = useCallback(async () => {
    try {
      const res = await fetch("/api/fonts");
      if (!res.ok) return;
      const data: { fonts: CustomFont[] } = await res.json();
      setFonts(data.fonts);
      await Promise.all(data.fonts.map(registerFont));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFonts();
  }, [fetchFonts]);

  return { fonts, loading, refetch: fetchFonts };
}

export function useRegisterFonts(fontList: CustomFont[]) {
  useEffect(() => {
    fontList.forEach(registerFont);
  }, [fontList]);
}
