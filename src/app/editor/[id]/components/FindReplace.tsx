"use client";

import { useState } from "react";
import { MagnifyingGlass, ArrowsClockwise, X } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";
import type { TextElement } from "@/types/elements";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function FindReplace({ open, onClose }: Props) {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");

  if (!open) return null;

  function handleReplace() {
    if (!find) return;
    const { slides } = useEditorStore.getState();
    let count = 0;

    const updated = slides.map((slide) => {
      const newElements = slide.elements.map((el) => {
        if (el.type !== "text") return el;
        const text = el as TextElement;
        if (!text.content.includes(find)) return el;
        count++;
        return { ...text, content: text.content.replaceAll(find, replace) };
      });
      return { ...slide, elements: newElements };
    });

    if (count > 0) {
      useEditorStore.setState({ slides: updated, dirty: true, saveStatus: "unsaved" });
      useEditorStore.getState().pushHistory();
      toast.success(`Replaced ${count} occurrence${count > 1 ? "s" : ""}`);
    } else {
      toast("No matches found", { duration: 1500 });
    }
  }

  function handleFind() {
    if (!find) return;
    const { slides } = useEditorStore.getState();
    let count = 0;
    slides.forEach((slide) => {
      slide.elements.forEach((el) => {
        if (el.type === "text" && (el as TextElement).content.includes(find)) count++;
      });
    });
    toast(`${count} match${count !== 1 ? "es" : ""} found`, { duration: 1500 });
  }

  return (
    <div className="fixed top-14 right-4 z-50 w-72 rounded border border-neutral-700 bg-[#1e1e1e] p-3 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Find & Replace</span>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300">
          <X size={14} />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex gap-1">
          <input
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Find text..."
            className="flex-1 rounded border border-neutral-700 bg-[#161616] px-2 py-1.5 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
            onKeyDown={(e) => e.key === "Enter" && handleFind()}
            autoFocus
          />
          <button
            onClick={handleFind}
            className="rounded border border-neutral-700 px-2 py-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <MagnifyingGlass size={14} />
          </button>
        </div>
        <input
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
          placeholder="Replace with..."
          className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1.5 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
          onKeyDown={(e) => e.key === "Enter" && handleReplace()}
        />
        <button
          onClick={handleReplace}
          disabled={!find}
          className="flex w-full items-center justify-center gap-1.5 rounded bg-neutral-800 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 transition-colors"
        >
          <ArrowsClockwise size={12} /> Replace all
        </button>
      </div>
    </div>
  );
}
