"use client";

import { useState } from "react";

interface Props {
  presentationId: string;
  onClose: () => void;
}

const REASONS = [
  { value: "copyright", label: "Copyright infringement" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Other" },
] as const;

type Reason = (typeof REASONS)[number]["value"];

export function ReportModal({ presentationId, onClose }: Props) {
  const [reason, setReason] = useState<Reason>("inappropriate");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (description.length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        presentationId,
        reason,
        description,
        reporterEmail: email || undefined,
      }),
    });

    setSubmitting(false);

    if (res.status === 429) {
      setError("Too many reports. Please try again later.");
      return;
    }
    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-t-xl bg-neutral-900 p-6 text-center md:rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h3 className="text-sm font-semibold text-white">Report submitted</h3>
          <p className="mt-1 text-xs text-neutral-400">
            Thank you. We will review this content shortly.
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full rounded bg-white/10 py-2.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-t-xl bg-neutral-900 p-6 md:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-white">Report content</h3>
        <p className="text-xs text-neutral-400">
          If this presentation violates our guidelines, please let us know.
        </p>

        <label className="block">
          <span className="text-xs text-neutral-400">Reason</span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as Reason)}
            className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-500"
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-neutral-400">Description (required)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Describe the issue in detail..."
            className="mt-1 w-full resize-none rounded border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-500"
          />
        </label>

        <label className="block">
          <span className="text-xs text-neutral-400">Your email (optional)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-500"
          />
        </label>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded bg-white/10 py-2.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || description.length < 10}
            className="flex-1 rounded bg-red-600 py-2.5 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit report"}
          </button>
        </div>
      </form>
    </div>
  );
}
