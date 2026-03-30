"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { X, PaperPlaneTilt } from "@phosphor-icons/react";
import type { ChatMessage } from "../hooks/useChat";

interface Props {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function AvatarInitial({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >{name.charAt(0).toUpperCase()}</div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex items-start gap-2 px-3 py-1.5">
      <AvatarInitial name={msg.userName} color={msg.userColor} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className="truncate text-xs font-medium"
            style={{ color: msg.userColor }}
          >
            {msg.userName}
          </span>
          <span className="shrink-0 text-[10px] text-neutral-500">
            {relativeTime(msg.timestamp)}
          </span>
        </div>
        <p className="whitespace-pre-wrap break-words text-sm text-neutral-200">
          {msg.text}
        </p>
      </div>
    </div>
  );
}

export function ChatPanel({ open, onClose, messages, onSend }: Props) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") onClose();
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={onClose} />
      <div
        role="dialog"
        aria-label="Chat"
        className="fixed z-50 flex flex-col rounded-xl border border-neutral-700 bg-[#1a1a1a] shadow-2xl
          bottom-0 left-0 right-0 max-h-[70vh] rounded-b-none
          md:bottom-14 md:right-4 md:left-auto md:w-80 md:max-h-[480px] md:rounded-b-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-700 px-3 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Chat</span>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overscroll-contain py-2">
          {messages.length === 0 && (
            <p className="px-3 py-8 text-center text-xs text-neutral-500">
              No messages yet. Say hello!
            </p>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-neutral-700 p-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              maxLength={500}
              className="flex-1 rounded-lg bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-neutral-600"
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <PaperPlaneTilt size={16} weight="fill" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
