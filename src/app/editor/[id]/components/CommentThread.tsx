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
            ? "bg-neutral-800/50 text-neutral-600 line-through"
            : "bg-neutral-800 text-neutral-300"
        }`}
      >
        <span className="text-[10px] text-neutral-500">
          {showSlide ? `Slide ${comment.slideIndex + 1} · ` : ""}
          {comment.authorName}
        </span>
        <p>{comment.content}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => onReply(comment.id)}
            className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Reply
          </button>
          {hasReplies && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-0.5 text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              {expanded ? <CaretDown size={10} /> : <CaretRight size={10} />}
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>

      {hasReplies && expanded && (
        <div className="ml-3 mt-1 border-l border-neutral-700 pl-2 space-y-1">
          {comment.replies.map((r) => (
            <div
              key={r.id}
              className="rounded bg-neutral-800/70 px-2 py-1.5 text-xs text-neutral-400"
            >
              <span className="text-[10px] text-neutral-500">
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
            className="flex-1 rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 placeholder:text-neutral-600 outline-none focus:ring-1 focus:ring-neutral-600 min-w-0"
            disabled={submitting}
          />
          <button
            onClick={onSubmitReply}
            disabled={submitting || !replyContent.trim()}
            className="shrink-0 rounded bg-neutral-700 px-2 py-1 text-[10px] text-neutral-300 hover:bg-neutral-600 disabled:opacity-40 transition-colors"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
