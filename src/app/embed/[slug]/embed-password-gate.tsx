"use client";

import { useState } from "react";

interface Props {
  presentationId: string;
  onUnlock: () => void;
}

export function EmbedPasswordGate({ presentationId, onUnlock }: Props) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/presentations/${presentationId}/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const data: { valid: boolean } = await res.json();
    if (data.valid) {
      onUnlock();
    } else {
      setError(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3 text-center">
        <p className="text-sm font-medium text-white/80">Password required</p>
        <p className="text-xs text-silver/50">This presentation is password protected</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Enter password"
          autoFocus
          className="w-full border-b border-steel bg-transparent px-2 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-white transition-colors"
        />
        {error && <p className="text-xs text-red-400">Incorrect password</p>}
        <button
          type="submit"
          disabled={loading || !pw.trim()}
          className="w-full rounded bg-accent py-2.5 text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-accent-hover disabled:opacity-40 transition-colors"
        >
          {loading ? "..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
