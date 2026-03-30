"use client";

import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlass, ArrowUp, ArrowDown,
  ArrowsClockwise, X, TextAa,
} from "@phosphor-icons/react";
import { useFindReplace } from "../hooks/useFindReplace";

interface Props {
  open: boolean;
  onClose: () => void;
  showReplace?: boolean;
}

export function FindReplace({ open, onClose, showReplace: initialReplace }: Props) {
  const {
    query, setQuery, replace, setReplace,
    caseSensitive, setCaseSensitive,
    matchIndex, total, goToMatch,
    handleReplace, handleReplaceAll,
  } = useFindReplace();

  const [replaceVisible, setReplaceVisible] = useState(initialReplace ?? false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialReplace !== undefined) setReplaceVisible(initialReplace);
  }, [initialReplace]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); goToMatch(matchIndex + 1); }
      if (e.key === "Enter" && e.shiftKey) { e.preventDefault(); goToMatch(matchIndex - 1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, goToMatch, matchIndex]);

  if (!open) return null;

  const label = total > 0 ? `${matchIndex + 1} of ${total} matches` : query ? "No matches" : "";

  return (
    <div className="fixed left-0 right-0 top-12 z-50 mx-auto w-full max-w-md px-3 md:left-auto md:right-4 md:mx-0 md:w-96 md:px-0">
      <div className="rounded-lg border border-neutral-700 bg-[#1e1e1e] p-3 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Find {replaceVisible ? "& Replace" : ""}
          </span>
          <div className="flex gap-1">
            <button onClick={() => setReplaceVisible((v) => !v)} className="rounded p-1 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300" title="Toggle replace">
              <ArrowsClockwise size={12} />
            </button>
            <button onClick={onClose} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-1">
            <div className="relative flex-1">
              <MagnifyingGlass size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find text..."
                className="w-full rounded border border-neutral-700 bg-[#161616] py-1.5 pl-7 pr-2 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500" />
            </div>
            <button onClick={() => setCaseSensitive((v) => !v)}
              className={`rounded border px-1.5 py-1.5 text-xs transition-colors ${caseSensitive ? "border-blue-500 bg-blue-500/20 text-blue-400" : "border-neutral-700 text-neutral-500 hover:bg-neutral-800"}`}
              title="Case sensitive">
              <TextAa size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-500">{label}</span>
            <div className="flex gap-1">
              <button onClick={() => goToMatch(matchIndex - 1)} disabled={total === 0} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 disabled:opacity-30">
                <ArrowUp size={14} />
              </button>
              <button onClick={() => goToMatch(matchIndex + 1)} disabled={total === 0} className="rounded p-1 text-neutral-400 hover:bg-neutral-700 disabled:opacity-30">
                <ArrowDown size={14} />
              </button>
            </div>
          </div>

          {replaceVisible && (
            <>
              <input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replace with..."
                className="w-full rounded border border-neutral-700 bg-[#161616] px-2 py-1.5 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500" />
              <div className="flex gap-1">
                <button onClick={handleReplace} disabled={total === 0}
                  className="flex-1 rounded bg-neutral-800 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 transition-colors">
                  Replace
                </button>
                <button onClick={handleReplaceAll} disabled={total === 0}
                  className="flex-1 rounded bg-neutral-800 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 transition-colors">
                  Replace All
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
