"use client";

import { useState } from "react";
import { ArrowBendDownRight, CaretDown, CaretRight } from "@phosphor-icons/react";

interface CommentData {
  id: string;
  slideIndex: number;
  authorName: string;
  content: string;
  resolved: boolean;
  parentId: string | null;
  createdAt: string;
}

interface CommentWithReplies extends CommentData {
  replies: CommentData[];
}

interface Props {
  comment: CommentWithReplies;
  showSlide?: boolean;
  onReply: (parentId: string) => void;
  replyingTo: string | null;
  replyContent: string;
  onReplyContentChange: (val: string) => void;
  onSubmitReply: () => void;
  submitting: boolean;
}

export function CommentThread({
  comment,
  showSlide,
  onReply,
  replyingTo,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  submitting,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const hasReplies = comment.replies.length > 0;
  const isReplying = replyingTo === comment.id;

  return (
    <div className="mb-2">
      <div
        className={`rounded px-2 py-1.5 text-xs ${
          comment.resolved
            ? "bg-white/5 text-silver/40 line-through"
            : "bg-white/5 text-silver"
        }`}
      >
        <span className="text-[10px] text-silver/50">
          {showSlide ? `Slide ${comment.slideIndex + 1} · ` : ""}
          {comment.authorName}
        </span>
        <p>{comment.content}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => onReply(comment.id)}
            className="text-[10px] text-silver/50 hover:text-silver transition-colors"
          >
            Reply
          </button>
          {hasReplies && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-0.5 text-[10px] text-silver/50 hover:text-silver transition-colors"
            >
              {expanded ? <CaretDown size={10} /> : <CaretRight size={10} />}
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>

      {hasReplies && expanded && (
        <div className="ml-3 mt-1 border-l border-steel pl-2 space-y-1">
          {comment.replies.map((r) => (
            <div
              key={r.id}
              className="rounded bg-white/5/70 px-2 py-1.5 text-xs text-silver/70"
            >
              <span className="text-[10px] text-silver/50">
                <ArrowBendDownRight size={8} className="inline mr-0.5" />
                {r.authorName}
              </span>
              <p>{r.content}</p>
            </div>
          ))}
        </div>
      )}

      {isReplying && (
        <div className="ml-3 mt-1 flex gap-1">
          <input
            autoFocus
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmitReply();
              }
              if (e.key === "Escape") onReply("");
            }}
            placeholder="Write a reply..."
            className="flex-1 rounded bg-white/5 px-2 py-1 text-xs text-silver placeholder:text-silver/40 outline-none focus:ring-1 focus:ring-neutral-600 min-w-0"
            disabled={submitting}
          />
          <button
            onClick={onSubmitReply}
            disabled={submitting || !replyContent.trim()}
            className="shrink-0 rounded bg-steel px-2 py-1 text-[10px] text-silver hover:bg-steel/80 disabled:opacity-40 transition-colors"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
