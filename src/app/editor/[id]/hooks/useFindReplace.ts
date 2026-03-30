import { useState, useCallback, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";
import type { TextElement, SlideElement } from "@/types/elements";

interface Match {
  slideIndex: number;
  elementId: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function replaceInHtml(html: string, search: string, replacement: string, caseSensitive: boolean): string {
  const flags = caseSensitive ? "g" : "gi";
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(escaped, flags), replacement);
}

function findMatches(
  slides: ReturnType<typeof useEditorStore.getState>["slides"],
  query: string,
  caseSensitive: boolean,
): Match[] {
  if (!query) return [];
  const matches: Match[] = [];
  const q = caseSensitive ? query : query.toLowerCase();
  slides.forEach((slide, slideIndex) => {
    slide.elements.forEach((el) => {
      if (el.type !== "text") return;
      const plain = stripHtml((el as TextElement).content);
      const text = caseSensitive ? plain : plain.toLowerCase();
      if (text.includes(q)) matches.push({ slideIndex, elementId: el.id });
    });
  });
  return matches;
}

export function useFindReplace() {
  const [query, setQuery] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [matchIndex, setMatchIndex] = useState(0);

  const slides = useEditorStore((s) => s.slides);
  const matches = findMatches(slides, query, caseSensitive);
  const total = matches.length;

  useEffect(() => { setMatchIndex(0); }, [query, caseSensitive]);

  const goToMatch = useCallback((idx: number) => {
    if (total === 0) return;
    const safe = ((idx % total) + total) % total;
    setMatchIndex(safe);
    const m = matches[safe];
    const state = useEditorStore.getState();
    if (state.activeSlideIndex !== m.slideIndex) state.setActiveSlide(m.slideIndex);
    useEditorStore.setState({ selectedElementIds: [m.elementId] });
  }, [matches, total]);

  useEffect(() => {
    if (total > 0) goToMatch(matchIndex);
  }, [total, goToMatch, matchIndex]);

  const handleReplace = useCallback(() => {
    if (total === 0) return;
    const m = matches[matchIndex];
    const state = useEditorStore.getState();
    const updated = state.slides.map((s, i) => {
      if (i !== m.slideIndex) return s;
      return {
        ...s,
        elements: s.elements.map((e) =>
          e.id === m.elementId
            ? { ...e, content: replaceInHtml((e as TextElement).content, query, replace, caseSensitive) }
            : e,
        ),
      };
    });
    useEditorStore.setState({ slides: updated, dirty: true, saveStatus: "unsaved" });
    state.pushHistory();
    toast.success("Replaced in 1 element");
  }, [matches, matchIndex, query, replace, caseSensitive, total]);

  const handleReplaceAll = useCallback(() => {
    if (total === 0) return;
    let count = 0;
    const state = useEditorStore.getState();
    const ids = new Set(matches.map((m) => `${m.slideIndex}:${m.elementId}`));
    const updated = state.slides.map((slide, si) => ({
      ...slide,
      elements: slide.elements.map((el) => {
        if (!ids.has(`${si}:${el.id}`)) return el;
        count++;
        return { ...el, content: replaceInHtml((el as TextElement).content, query, replace, caseSensitive) } as SlideElement;
      }),
    }));
    useEditorStore.setState({ slides: updated, dirty: true, saveStatus: "unsaved" });
    state.pushHistory();
    toast.success(`Replaced in ${count} element${count !== 1 ? "s" : ""}`);
  }, [matches, query, replace, caseSensitive, total]);

  return {
    query, setQuery, replace, setReplace,
    caseSensitive, setCaseSensitive,
    matchIndex, total, goToMatch,
    handleReplace, handleReplaceAll,
  };
}
