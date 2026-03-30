"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ChatCircle, X } from "@phosphor-icons/react";
import { CommentThread } from "./CommentThread";

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
  open: boolean;
  onClose: () => void;
}

export function EditorComments({ open, onClose }: Props) {
  const presentationId = useEditorStore((s) => s.presentationId);
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(() => {
    if (!presentationId) return;
    setLoading(true);
    fetch(`/api/comments?presentationId=${presentationId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [presentationId]);

  useEffect(() => {
    if (!open) return;
    fetchComments();
  }, [open, fetchComments]);

  const handleReply = (parentId: string) => {
    setReplyingTo((prev) => (prev === parentId ? null : parentId));
    setReplyContent("");
  };

  const submitReply = async () => {
    if (!replyingTo || !replyContent.trim() || !presentationId) return;
    const parent = comments.find((c) => c.id === replyingTo);
    if (!parent) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presentationId,
          slideIndex: parent.slideIndex,
          authorName: "You",
          content: replyContent.trim(),
          parentId: replyingTo,
        }),
      });
      if (res.ok) {
        setReplyingTo(null);
        setReplyContent("");
        fetchComments();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const slideComments = comments.filter((c) => c.slideIndex === activeSlideIndex);
  const otherComments = comments.filter((c) => c.slideIndex !== activeSlideIndex);

  return (
    <div className="fixed top-14 right-4 md:right-60 z-50 w-[calc(100vw-2rem)] md:w-72 max-h-[60vh] flex flex-col rounded border border-neutral-700 bg-[#1e1e1e] shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <ChatCircle size={14} className="text-neutral-400" />
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Comments ({comments.length})
          </span>
        </div>
        <button onClick={onClose} className="rounded p-1.5 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300 transition-colors">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading && <p className="text-xs text-neutral-600 py-4 text-center">Loading...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-xs text-neutral-600 py-4 text-center">
            No comments yet.<br />Comments from viewers appear here.
          </p>
        )}
        {slideComments.length > 0 && (
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
              Slide {activeSlideIndex + 1}
            </p>
            {slideComments.map((c) => (
              <CommentThread key={c.id} comment={c} onReply={handleReply} replyingTo={replyingTo} replyContent={replyContent} onReplyContentChange={setReplyContent} onSubmitReply={submitReply} submitting={submitting} />
            ))}
          </div>
        )}
        {otherComments.length > 0 && (
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Other slides</p>
            {otherComments.map((c) => (
              <CommentThread key={c.id} comment={c} showSlide onReply={handleReply} replyingTo={replyingTo} replyContent={replyContent} onReplyContentChange={setReplyContent} onSubmitReply={submitReply} submitting={submitting} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
