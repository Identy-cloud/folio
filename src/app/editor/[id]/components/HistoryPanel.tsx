"use client";

import { useEditorStore } from "@/store/editorStore";
import { ClockCounterClockwise } from "@phosphor-icons/react";

function cloneSlides(slides: import("@/types/elements").Slide[]) {
  return JSON.parse(JSON.stringify(slides));
}

export function HistoryPanel({ onClose }: { onClose: () => void }) {
  const history = useEditorStore((s) => s.history);
  const historyIndex = useEditorStore((s) => s.historyIndex);

  function jumpTo(index: number) {
    if (index === historyIndex) return;
    useEditorStore.setState({
      slides: cloneSlides(history[index]),
      historyIndex: index,
      selectedElementIds: [],
      dirty: true,
      saveStatus: "unsaved" as const,
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-steel/30 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <ClockCounterClockwise size={14} className="text-silver/70" />
          <span className="text-xs font-medium text-silver/70 uppercase tracking-wider">History</span>
        </div>
        <button onClick={onClose} className="text-xs text-silver/50 hover:text-silver">
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {history.map((_, i) => {
          const isCurrent = i === historyIndex;
          const isFuture = i > historyIndex;
          return (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] transition-colors ${
                isCurrent
                  ? "bg-white/10 text-white"
                  : isFuture
                  ? "text-silver/40 hover:bg-white/5 hover:text-silver/70"
                  : "text-silver/70 hover:bg-white/5 hover:text-silver"
              }`}
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full shrink-0 ${
                isCurrent ? "bg-white" : isFuture ? "bg-steel" : "bg-steel/80"
              }`} />
              {i === 0 ? "Initial state" : `Change ${i}`}
            </button>
          );
        })}
        {history.length === 0 && (
          <p className="py-4 text-center text-xs text-silver/40">No history yet</p>
        )}
      </div>
    </div>
  );
}
