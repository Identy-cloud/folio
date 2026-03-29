"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ChatCircle, X } from "@phosphor-icons/react";

interface Comment {
  id: string;
  slideIndex: number;
  authorName: string;
  content: string;
  resolved: boolean;
  createdAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function EditorComments({ open, onClose }: Props) {
  const presentationId = useEditorStore((s) => s.presentationId);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !presentationId) return;
    setLoading(true);
    fetch(`/api/comments?presentationId=${presentationId}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [open, presentationId]);

  if (!open) return null;

  const slideComments = comments.filter((c) => c.slideIndex === activeSlideIndex);
  const otherComments = comments.filter((c) => c.slideIndex !== activeSlideIndex);

  return (
    <div className="fixed top-14 right-60 z-50 w-72 max-h-[60vh] flex flex-col rounded border border-neutral-700 bg-[#1e1e1e] shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <ChatCircle size={14} className="text-neutral-400" />
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Comments ({comments.length})
          </span>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300"><X size={14} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading && <p className="text-xs text-neutral-600 py-4 text-center">Loading...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-xs text-neutral-600 py-4 text-center">No comments yet.<br />Comments from viewers appear here.</p>
        )}
        {slideComments.length > 0 && (
          <div>
            <p className="text-[9px] text-neutral-500 uppercase tracking-wider mb-1">Slide {activeSlideIndex + 1}</p>
            {slideComments.map((c) => (
              <div key={c.id} className={`rounded px-2 py-1.5 text-xs mb-1 ${c.resolved ? "bg-neutral-800/50 text-neutral-600 line-through" : "bg-neutral-800 text-neutral-300"}`}>
                <span className="text-[9px] text-neutral-500">{c.authorName}</span>
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        )}
        {otherComments.length > 0 && (
          <div>
            <p className="text-[9px] text-neutral-500 uppercase tracking-wider mb-1">Other slides</p>
            {otherComments.map((c) => (
              <div key={c.id} className="rounded bg-neutral-800/50 px-2 py-1.5 text-xs text-neutral-500 mb-1">
                <span className="text-[9px] text-neutral-600">Slide {c.slideIndex + 1} · {c.authorName}</span>
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
