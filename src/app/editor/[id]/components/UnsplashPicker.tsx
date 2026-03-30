"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { nanoid } from "nanoid";
import { X, MagnifyingGlass } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import type { ImageElement } from "@/types/elements";

interface UnsplashPhoto {
  id: string;
  urls: { small: string; regular: string; full: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
  width: number;
  height: number;
}

interface Props {
  onClose: () => void;
}

export function UnsplashPicker({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const zBase = (activeSlide?.elements.length ?? 0) + 1;

  const search = useCallback(async (q: string, p: number, append: boolean) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/unsplash?q=${encodeURIComponent(q)}&page=${p}&per_page=20`);
      if (!res.ok) return;
      const data = await res.json();
      setPhotos((prev) => (append ? [...prev, ...data.results] : data.results));
      setTotalPages(data.total_pages);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim()) { setPhotos([]); setPage(1); setTotalPages(0); return; }
    timerRef.current = setTimeout(() => { setPage(1); search(query, 1, false); }, 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, search]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function insertPhoto(photo: UnsplashPhoto) {
    const aspect = photo.width / photo.height;
    const w = 600;
    const h = Math.round(w / aspect);
    const el: ImageElement = {
      id: nanoid(), type: "image", x: 200, y: 200, w, h,
      rotation: 0, opacity: 1, zIndex: zBase, locked: false,
      src: photo.urls.regular, objectFit: "cover", filter: "none",
      aspectRatioLocked: true,
    };
    addElement(el);
    onClose();
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    search(query, next, true);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded border border-neutral-700 bg-[#1e1e1e] shadow-2xl md:max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-2">
          <span className="text-xs font-medium text-neutral-300 uppercase tracking-wider">Stock Images</span>
          <button onClick={onClose} aria-label="Close" className="p-1 text-neutral-500 hover:text-neutral-300"><X size={16} /></button>
        </div>
        <div className="relative px-4 pt-3">
          <MagnifyingGlass size={14} className="absolute left-7 top-1/2 mt-1.5 -translate-y-1/2 text-neutral-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search free photos..."
            className="w-full rounded border border-neutral-700 bg-[#111] py-2 pl-8 pr-3 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <button key={photo.id} onClick={() => insertPhoto(photo)} className="group relative overflow-hidden rounded hover:ring-2 hover:ring-blue-500">
                <img src={photo.urls.small} alt={photo.alt_description ?? ""} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-1 text-[9px] text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100 truncate">
                  <a href={`${photo.user.links.html}?utm_source=folio&utm_medium=referral`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="underline">
                    {photo.user.name}
                  </a>
                  {" on Unsplash"}
                </span>
              </button>
            ))}
          </div>
          {photos.length === 0 && !loading && query && (
            <p className="py-8 text-center text-xs text-neutral-600">No results</p>
          )}
          {loading && <p className="py-6 text-center text-xs text-neutral-500">Searching...</p>}
          {page < totalPages && !loading && photos.length > 0 && (
            <button onClick={loadMore} className="mt-3 w-full rounded border border-neutral-700 py-2 text-xs text-neutral-400 hover:bg-neutral-800">
              Load more
            </button>
          )}
        </div>
        <div className="border-t border-neutral-800 px-4 py-1.5">
          <p className="text-[9px] text-neutral-600">Photos by <a href="https://unsplash.com/?utm_source=folio&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a></p>
        </div>
      </div>
    </div>
  );
}
