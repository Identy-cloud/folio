"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161616] px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display text-5xl tracking-tight text-white sm:text-7xl">
            FOLIO
          </h1>
          <p className="mt-2 text-[11px] tracking-[0.4em] text-neutral-500 uppercase">
            Reset password
          </p>
          <div className="mx-auto mt-6 h-px w-12 bg-neutral-700" />
        </div>

        {done ? (
          <div className="text-center">
            <p className="text-sm text-green-400">Password updated successfully.</p>
            <p className="mt-2 text-xs text-neutral-500">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoFocus
              aria-label="Nueva contraseña"
              className="w-full border-b border-neutral-700 bg-transparent px-2 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-white transition-colors"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              aria-label="Confirmar contraseña"
              className="w-full border-b border-neutral-700 bg-transparent px-2 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-white transition-colors"
            />

            {error && (
              <p className="pt-2 text-xs text-red-400" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-white py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              {loading ? "..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
