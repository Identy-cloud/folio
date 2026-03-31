"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { Notebook } from "@phosphor-icons/react";
import { LocaleSelector } from "@/components/LocaleSelector";
import { LoginBranding } from "../login/LoginBranding";

function SuccessCheckmark() {
  return (
    <svg width="64" height="64" viewBox="0 0 52 52" className="mx-auto animate-checkmark-scale">
      <circle cx="26" cy="26" r="25" fill="none" stroke="#22c55e" strokeWidth="2" className="animate-checkmark-circle" />
      <path d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark-draw" />
    </svg>
  );
}

const inputCls =
  "w-full rounded-sm border border-silver/40 bg-[#FAFAFA] px-4 py-3 text-sm text-navy placeholder-steel/40 outline-none transition-all duration-200 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError(t.auth.passwordMinLength); return; }
    if (password !== confirm) { setError(t.auth.passwordsMismatch); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setLoading(false); return; }
    setDone(true);
    setTimeout(() => { router.push("/dashboard"); router.refresh(); }, 2000);
  }

  return (
    <div className="flex min-h-screen bg-white">
      <LoginBranding subtitle={t.auth.subtitle} />

      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="absolute right-6 top-5 hidden lg:block">
          <LocaleSelector />
        </div>
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <Notebook size={24} weight="duotone" className="text-navy" />
          <span className="font-display text-xl tracking-tight text-navy">FOLIO</span>
        </div>

        <div className="w-full max-w-sm animate-slide-in">
          <h2 className="font-display text-4xl tracking-tight text-navy sm:text-5xl">
            {t.auth.resetPassword}
          </h2>
          <div className="mt-2 h-px w-8 bg-accent" />

          {done ? (
            <div className="mt-12 text-center animate-slide-in">
              <SuccessCheckmark />
              <p className="mt-6 text-sm font-medium text-green-600">{t.auth.passwordUpdated}</p>
              <p className="mt-2 text-xs text-slate">{t.auth.redirecting}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-steel uppercase">{t.auth.newPassword}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoFocus aria-label={t.auth.newPassword} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-steel uppercase">{t.auth.confirmPassword}</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} aria-label={t.auth.confirmPassword} className={inputCls} />
              </div>

              {error && (
                <div className="animate-slide-in flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 px-4 py-3" role="alert">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  <p className="text-xs leading-relaxed text-red-600">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="mt-2 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-sm bg-accent py-3 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-all duration-200 hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40">
                {loading && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-btn-spin" />}
                {loading ? "" : t.auth.updatePassword}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
