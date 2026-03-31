"use client";

import { useState, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom";
  shortcut?: string;
}

export function Tooltip({ content, children, side = "bottom", shortcut }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    timeoutRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const top = side === "top" ? rect.top - 8 : rect.bottom + 8;
      const left = rect.left + rect.width / 2;
      setPos({ top, left });
      setVisible(true);
    }, 400);
  }

  function hide() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className="inline-flex"
    >
      {children}
      {visible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              transform: side === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
              zIndex: 9999,
            }}
            className="pointer-events-none rounded bg-navy border border-steel px-2 py-1 text-[11px] text-silver shadow-lg whitespace-nowrap"
          >
            {content}
            {shortcut && (
              <kbd className="ml-1.5 rounded bg-white/5 px-1 py-0.5 text-[9px] font-mono text-silver/70">
                {shortcut}
              </kbd>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
