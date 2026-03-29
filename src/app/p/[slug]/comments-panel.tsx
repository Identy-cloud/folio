"use client";

import { useState, useEffect } from "react";
import { ChatCircle, X, PaperPlaneTilt } from "@phosphor-icons/react";

interface Comment {
  id: string;
  slideIndex: number;
  authorName: string;
  content: string;
  createdAt: string;
}

interface Props {
  presentationId: string;
  currentSlide: number;
  totalSlides: number;
}

export function CommentsPanel({ presentationId, currentSlide, totalSlides }: Props) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/comments?presentationId=${presentationId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setComments)
      .catch(() => {});
  }, [open, presentationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSending(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        presentationId,
        slideIndex: currentSlide,
        authorName: name.trim(),
        content: content.trim(),
      }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [comment, ...prev]);
      setContent("");
    }
    setSending(false);
  }

  const slideComments = comments.filter((c) => c.slideIndex === currentSlide);
  const otherComments = comments.filter((c) => c.slideIndex !== currentSlide);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-colors sm:bottom-16"
        aria-label="Comments"
      >
        <ChatCircle size={20} />
        {comments.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-medium text-white">
            {comments.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-0 right-0 top-0 z-30 flex w-[calc(100%-2rem)] max-w-80 flex-col bg-[#1a1a1a] shadow-2xl sm:max-w-96">
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Feedback — Slide {currentSlide + 1}
            </span>
            <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {slideComments.length === 0 && otherComments.length === 0 && (
              <p className="text-center text-xs text-neutral-600 py-8">No comments yet</p>
            )}

            {slideComments.length > 0 && (
              <div className="space-y-2">
                {slideComments.map((c) => (
                  <CommentBubble key={c.id} comment={c} current />
                ))}
              </div>
            )}

            {otherComments.length > 0 && (
              <>
                <p className="pt-2 text-[10px] uppercase tracking-wider text-neutral-600">
                  Other slides
                </p>
                <div className="space-y-2 opacity-60">
                  {otherComments.map((c) => (
                    <CommentBubble key={c.id} comment={c} />
                  ))}
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-neutral-800 p-3 space-y-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded border border-neutral-700 bg-[#111] px-2 py-1.5 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
            />
            <div className="flex gap-2">
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Leave feedback..."
                required
                className="flex-1 rounded border border-neutral-700 bg-[#111] px-2 py-1.5 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
              />
              <button
                type="submit"
                disabled={sending || !name.trim() || !content.trim()}
                className="flex h-8 w-8 items-center justify-center rounded bg-white text-[#161616] hover:bg-neutral-200 disabled:opacity-30 transition-colors"
              >
                <PaperPlaneTilt size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function CommentBubble({ comment, current }: { comment: Comment; current?: boolean }) {
  return (
    <div className={`rounded border px-3 py-2 ${current ? "border-neutral-700 bg-neutral-800/50" : "border-neutral-800"}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-neutral-300">{comment.authorName}</span>
        <span className="text-[9px] text-neutral-600">
          Slide {comment.slideIndex + 1}
        </span>
      </div>
      <p className="mt-1 text-xs text-neutral-400">{comment.content}</p>
    </div>
  );
}
