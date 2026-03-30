"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import DOMPurify from "dompurify";
import type { TextElement } from "@/types/elements";

interface TextRendererProps {
  element: TextElement;
  editing: boolean;
  onExitEdit: (html: string) => void;
}

export function TextRenderer({ element, editing, onExitEdit }: TextRendererProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const alignMap = { top: "flex-start", middle: "center", bottom: "flex-end" } as const;
  const sanitized = useMemo(
    () => DOMPurify.sanitize(element.content),
    [element.content]
  );

  const commitAndExit = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? element.content;
    onExitEdit(html);
  }, [element.content, onExitEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        commitAndExit();
      }
    },
    [commitAndExit]
  );

  const handleBlur = useCallback(() => {
    commitAndExit();
  }, [commitAndExit]);

  useEffect(() => {
    if (editing && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel && editorRef.current.childNodes.length > 0) {
        sel.selectAllChildren(editorRef.current);
        sel.collapseToEnd();
      }
    }
  }, [editing]);

  const sharedStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: alignMap[element.verticalAlign],
    fontFamily: element.fontFamily,
    fontSize: element.fontSize,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle ?? "normal",
    textDecoration: element.textDecoration ?? "none",
    WebkitTextStroke: element.textStroke
      ? `${element.textStroke.width}px ${element.textStroke.color}`
      : undefined,
    lineHeight: element.lineHeight,
    letterSpacing: `${element.letterSpacing}em`,
    color: element.color,
    textAlign: element.textAlign,
    cursor: editing ? "text" : "inherit",
    outline: editing ? "2px solid #3b82f6" : "none",
    outlineOffset: 1,
    overflow: "hidden",
    wordBreak: "break-word",
  };

  if (editing) {
    return (
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={sharedStyle}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return (
    <div style={sharedStyle}>
      <span
        style={{ width: "100%", textAlign: element.textAlign }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}
