"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Question {
  id: string;
  text: string;
  authorName: string;
  upvotes: number;
  answered: boolean;
  createdAt: string;
}

interface Props {
  presentationId: string;
}

export function QaPresenter({ presentationId }: Props) {
  const [items, setItems] = useState<Question[]>([]);
  const [newCount, setNewCount] = useState(0);
  const prevLen = useRef(0);

  const fetchQuestions = useCallback(() => {
    fetch(`/api/presentations/${presentationId}/questions`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Question[]) => {
        const unanswered = data.filter((q: Question) => !q.answered).length;
        if (unanswered > prevLen.current) {
          setNewCount((c) => c + (unanswered - prevLen.current));
        }
        prevLen.current = unanswered;
        setItems(data);
      })
      .catch(() => {});
  }, [presentationId]);

  useEffect(() => {
    fetchQuestions();
    const id = setInterval(fetchQuestions, 5000);
    return () => clearInterval(id);
  }, [fetchQuestions]);

  async function markAnswered(questionId: string) {
    setItems((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answered: true } : q))
    );
    await fetch(`/api/presentations/${presentationId}/questions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, action: "markAnswered" }),
    }).catch(() => {});
  }

  const unanswered = items.filter((q) => !q.answered);
  const answered = items.filter((q) => q.answered);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-silver/50">
          Q&A
        </p>
        {newCount > 0 && (
          <span
            className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-medium text-white cursor-pointer"
            onClick={() => setNewCount(0)}
          >
            {newCount} new
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {unanswered.length === 0 && answered.length === 0 && (
          <p className="py-6 text-center text-xs text-silver/40">
            No questions yet
          </p>
        )}

        {unanswered.map((q) => (
          <div
            key={q.id}
            className="flex items-start gap-2 rounded border border-steel bg-white/5 px-3 py-2"
          >
            <span className="mt-0.5 min-w-[20px] text-center text-xs font-medium text-orange-400">
              {q.upvotes}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-silver break-words">{q.text}</p>
              <span className="text-[10px] text-silver/50">
                {q.authorName}
              </span>
            </div>
            <button
              onClick={() => markAnswered(q.id)}
              className="shrink-0 rounded bg-steel px-2 py-1 text-[10px] text-silver hover:bg-green-700 hover:text-white transition-colors"
            >
              Done
            </button>
          </div>
        ))}

        {answered.length > 0 && (
          <p className="pt-2 text-[10px] uppercase tracking-wider text-silver/40">
            Answered
          </p>
        )}
        {answered.map((q) => (
          <div
            key={q.id}
            className="flex items-start gap-2 rounded border border-steel/30 px-3 py-2 opacity-50"
          >
            <span className="mt-0.5 min-w-[20px] text-center text-xs font-medium text-silver/50">
              {q.upvotes}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-silver/70 break-words line-through">
                {q.text}
              </p>
              <span className="text-[10px] text-silver/40">
                {q.authorName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
