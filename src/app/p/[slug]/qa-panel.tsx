"use client";

import { useState, useEffect, useCallback } from "react";

interface Question {
  id: string;
  text: string;
  authorName: string;
  upvotes: number;
  answered: boolean;
}

interface Props { presentationId: string }

export function QaPanel({ presentationId }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Question[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const api = `/api/presentations/${presentationId}/questions`;

  const fetchQ = useCallback(() => {
    fetch(api).then((r) => (r.ok ? r.json() : [])).then(setItems).catch(() => {});
  }, [api]);

  useEffect(() => {
    if (!open) return;
    fetchQ();
    const id = setInterval(fetchQ, 5000);
    return () => clearInterval(id);
  }, [open, fetchQ]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSending(true);
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim(), authorName: name.trim() }),
    });
    if (res.ok) {
      const q: Question = await res.json();
      setItems((prev) => [q, ...prev]);
      setText("");
    }
    setSending(false);
  }

  async function upvote(qid: string) {
    if (voted.has(qid)) return;
    setVoted((p) => new Set(p).add(qid));
    setItems((p) => p.map((q) => (q.id === qid ? { ...q, upvotes: q.upvotes + 1 } : q)));
    await fetch(api, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: qid, action: "upvote" }),
    }).catch(() => {});
  }

  const unanswered = items.filter((q) => !q.answered);
  const answered = items.filter((q) => q.answered);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-32 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-colors sm:bottom-28"
        aria-label="Q&A"
      >
        <span className="text-sm font-bold">Q</span>
        {unanswered.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-medium text-white">
            {unanswered.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-0 right-0 top-0 z-30 flex w-[calc(100%-2rem)] max-w-80 flex-col bg-[#1a1a1a] shadow-2xl sm:max-w-96">
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Q&A</span>
            <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-white text-sm">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {items.length === 0 && (
              <p className="py-8 text-center text-xs text-neutral-600">No questions yet</p>
            )}
            {unanswered.map((q) => (
              <QCard key={q.id} q={q} onUp={upvote} can={!voted.has(q.id)} />
            ))}
            {answered.length > 0 && (
              <p className="pt-2 text-[10px] uppercase tracking-wider text-neutral-600">Answered</p>
            )}
            {answered.map((q) => (
              <QCard key={q.id} q={q} onUp={upvote} can={!voted.has(q.id)} dim />
            ))}
          </div>
          <form onSubmit={submit} className="border-t border-neutral-800 p-3 space-y-2">
            <input
              value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required
              className="w-full rounded border border-neutral-700 bg-[#111] px-2 py-1.5 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
            />
            <div className="flex gap-2">
              <input
                value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask a question..." required
                className="flex-1 rounded border border-neutral-700 bg-[#111] px-2 py-1.5 text-xs text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
              />
              <button
                type="submit" disabled={sending || !name.trim() || !text.trim()}
                className="rounded bg-white px-3 py-1.5 text-xs font-medium text-[#161616] hover:bg-neutral-200 disabled:opacity-30 transition-colors"
              >
                Ask
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function QCard({ q, onUp, can, dim }: { q: Question; onUp: (id: string) => void; can: boolean; dim?: boolean }) {
  return (
    <div className={`flex gap-2 rounded border px-3 py-2 ${dim ? "border-neutral-800 opacity-50" : "border-neutral-700 bg-neutral-800/50"}`}>
      <button
        onClick={() => onUp(q.id)} disabled={!can}
        className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-orange-400 disabled:opacity-40 transition-colors min-w-[28px]"
      >
        <span className="text-[10px]">&#9650;</span>
        <span className="text-xs font-medium">{q.upvotes}</span>
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-neutral-200 break-words">{q.text}</p>
        <span className="text-[10px] text-neutral-500">{q.authorName}</span>
      </div>
    </div>
  );
}
