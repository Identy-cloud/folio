"use client";

import { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import { X, MagnifyingGlass, BookmarkSimple, Trash, Plus } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import type { SlideElement, GradientDef } from "@/types/elements";

interface SavedSlide {
  id: string;
  name: string;
  category: string | null;
  elements: SlideElement[];
  backgroundColor: string;
  backgroundImage: string | null;
  backgroundGradient: GradientDef | null;
  thumbnailUrl: string | null;
}

interface Props { open: boolean; onClose: () => void }

function autoName(elements: SlideElement[]): string {
  const t = elements.find((e) => e.type === "text");
  if (t && "content" in t) {
    const raw = t.content.replace(/<[^>]*>/g, "").trim();
    if (raw) return raw.slice(0, 40);
  }
  return `Slide ${new Date().toLocaleDateString()}`;
}

export function SlideLibrary({ open, onClose }: Props) {
  const [slides, setSlides] = useState<SavedSlide[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const storeSlides = useEditorStore((s) => s.slides);
  const activeIdx = useEditorStore((s) => s.activeSlideIndex);
  const presId = useEditorStore((s) => s.presentationId);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/slides/library").catch(() => null);
    if (res?.ok) { const d = await res.json(); setSlides(d.slides ?? []); }
    setLoading(false);
  }, []);

  useEffect(() => { if (open) load(); }, [open, load]);
  if (!open) return null;

  const q = query.toLowerCase();
  const filtered = slides.filter((s) => s.name.toLowerCase().includes(q) || (s.category?.toLowerCase().includes(q) ?? false));
  const categories = [...new Set(slides.map((s) => s.category).filter(Boolean))] as string[];

  async function saveCurrent() {
    if (!activeSlide) return;
    const cat = prompt("Category (optional):", "") ?? "";
    const res = await fetch("/api/slides/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: autoName(activeSlide.elements), category: cat || undefined,
        elements: activeSlide.elements, backgroundColor: activeSlide.backgroundColor,
        backgroundImage: activeSlide.backgroundImage, backgroundGradient: activeSlide.backgroundGradient ?? null,
      }),
    });
    if (res.ok) load();
  }

  function insert(saved: SavedSlide) {
    const els = (saved.elements as SlideElement[]).map((el) => ({ ...el, id: nanoid() }));
    const ns = {
      id: nanoid(), presentationId: presId, order: activeIdx + 1, transition: "fade" as const,
      backgroundColor: saved.backgroundColor, backgroundImage: saved.backgroundImage,
      backgroundGradient: saved.backgroundGradient ?? undefined, elements: els, mobileElements: null, notes: "",
    };
    const all = [...storeSlides];
    all.splice(activeIdx + 1, 0, ns);
    useEditorStore.setState({
      slides: all.map((s, i) => ({ ...s, order: i })),
      activeSlideIndex: activeIdx + 1, selectedElementIds: [], dirty: true, saveStatus: "unsaved",
    });
    useEditorStore.getState().pushHistory();
    onClose();
  }

  async function remove(id: string) {
    await fetch(`/api/slides/library?id=${id}`, { method: "DELETE" });
    setSlides((p) => p.filter((s) => s.id !== id));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] md:pt-[15vh]" onClick={onClose}>
      <div className="mx-4 flex w-full max-w-lg flex-col rounded border border-neutral-700 bg-[#1e1e1e] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
          <h2 className="flex items-center gap-2 text-sm font-medium text-white">
            <BookmarkSimple size={16} /> Slide Library
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={saveCurrent} className="flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1 text-xs text-white hover:bg-blue-500 transition-colors">
              <Plus size={12} /> Save current
            </button>
            <button onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-white"><X size={16} /></button>
          </div>
        </div>
        <div className="border-b border-neutral-700 px-4 py-2">
          <div className="flex items-center gap-2 rounded bg-neutral-800 px-2">
            <MagnifyingGlass size={14} className="text-neutral-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or category..." className="w-full bg-transparent py-1.5 text-xs text-white outline-none placeholder:text-neutral-500" />
          </div>
          {categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {categories.map((c) => (
                <button key={c} onClick={() => setQuery(c)} className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors">{c}</button>
              ))}
            </div>
          )}
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-3">
          {loading && <p className="py-4 text-center text-xs text-neutral-500">Loading...</p>}
          {!loading && filtered.length === 0 && <p className="py-4 text-center text-xs text-neutral-500">No saved slides yet</p>}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filtered.map((saved) => (
              <div key={saved.id} className="group relative cursor-pointer rounded border border-neutral-700 bg-neutral-800/50 hover:border-neutral-500 transition-colors" onClick={() => insert(saved)}>
                <div className="aspect-video w-full overflow-hidden rounded-t" style={{ backgroundColor: saved.backgroundColor }}>
                  <div className="flex h-full items-center justify-center p-2">
                    <span className="text-[8px] text-neutral-400 line-clamp-2">{saved.elements.length} elements</span>
                  </div>
                </div>
                <div className="px-2 py-1.5">
                  <p className="truncate text-[10px] font-medium text-neutral-300">{saved.name}</p>
                  {saved.category && <p className="truncate text-[9px] text-neutral-500">{saved.category}</p>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); remove(saved.id); }} className="absolute top-1 right-1 hidden h-5 w-5 items-center justify-center rounded bg-red-500/80 text-white group-hover:flex hover:bg-red-500 transition-colors">
                  <Trash size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
