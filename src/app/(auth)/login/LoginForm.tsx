"use client";

import Link from "next/link";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import type { Dictionary } from "@/lib/i18n/es";

interface Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isSignUp: boolean;
  setIsSignUp: (v: boolean) => void;
  error: string | null;
  setError: (v: string | null) => void;
  success: string | null;
  loading: boolean;
  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPasswordReset: () => void;
  onGoogleLogin: () => void;
  onGitHubLogin: () => void;
  t: Dictionary;
}

const inputCls =
  "w-full rounded-sm border border-silver/40 bg-[#FAFAFA] px-4 py-3 text-sm text-navy placeholder-steel/40 outline-none transition-all duration-200 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/30";

export function LoginForm({
  email, setEmail, password, setPassword,
  isSignUp, setIsSignUp, error, setError, success,
  loading, termsAccepted, setTermsAccepted,
  onSubmit, onPasswordReset, onGoogleLogin, onGitHubLogin, t,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center px-6 pt-20 pb-8 lg:w-1/2 lg:px-16 lg:pt-0">
      <div className="w-full max-w-sm animate-slide-in">
        <div className="mb-10">
          <h2 className="font-display text-4xl tracking-tight text-navy sm:text-5xl">
            {isSignUp ? t.auth.signup : t.auth.login}
          </h2>
          <div className="mt-2 h-px w-8 bg-accent" />
          <p className="mt-4 text-sm text-slate">
            {isSignUp ? t.auth.hasAccount : t.auth.noAccount}{" "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-medium text-accent transition-colors hover:text-accent-hover">
              {isSignUp ? t.auth.loginAction : t.auth.signupAction}
            </button>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={onGoogleLogin} className="flex flex-1 min-h-[48px] items-center justify-center gap-2.5 rounded-sm border border-silver/50 bg-white py-3 text-xs font-medium tracking-wide text-slate transition-all duration-200 hover:border-navy/30 hover:bg-[#FAFAFA] hover:text-navy active:scale-[0.98]">
            <GoogleLogo size={18} weight="bold" /> Google
          </button>
          <button onClick={onGitHubLogin} className="flex flex-1 min-h-[48px] items-center justify-center gap-2.5 rounded-sm border border-silver/50 bg-white py-3 text-xs font-medium tracking-wide text-slate transition-all duration-200 hover:border-navy/30 hover:bg-[#FAFAFA] hover:text-navy active:scale-[0.98]">
            <GithubLogo size={18} weight="bold" /> GitHub
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-silver/40" /></div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-[10px] tracking-[0.3em] text-steel uppercase">{t.auth.or}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-steel uppercase">{t.auth.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label={t.auth.email} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-steel uppercase">{t.auth.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} aria-label={t.auth.password} className={inputCls} />
          </div>

          {isSignUp && (
            <label className="flex items-start gap-3 cursor-pointer group">
              <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-silver/50 bg-[#FAFAFA] transition-all duration-200 group-hover:border-navy/30 has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="absolute inset-0 cursor-pointer opacity-0" />
                {termsAccepted && (
                  <svg width="12" height="12" viewBox="0 0 12 12" className="text-accent"><path d="M2 6l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </span>
              <span className="text-xs leading-relaxed text-slate">
                {t.auth.termsPrefix}{" "}
                <Link href="/terms" className="text-navy underline underline-offset-2 transition-colors hover:text-accent">{t.auth.termsLink}</Link>
                {" "}{t.auth.termsAnd}{" "}
                <Link href="/privacy" className="text-navy underline underline-offset-2 transition-colors hover:text-accent">{t.auth.privacyLink}</Link>
              </span>
            </label>
          )}

          {error && (
            <div className="animate-slide-in flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 px-4 py-3" role="alert">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              <p className="text-xs leading-relaxed text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="animate-slide-in flex items-start gap-2.5 rounded-sm border border-green-200 bg-green-50 px-4 py-3" role="status">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <p className="text-xs leading-relaxed text-green-600">{success}</p>
            </div>
          )}

          <button type="submit" disabled={loading || (isSignUp && !termsAccepted)}
            className="mt-2 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-sm bg-accent py-3 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-all duration-200 hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40">
            {loading && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-btn-spin" />}
            {loading ? "" : isSignUp ? t.auth.signup : t.auth.login}
          </button>

          {!isSignUp && (
            <button type="button" onClick={onPasswordReset} className="w-full py-2 text-xs text-steel transition-colors hover:text-accent">
              {t.auth.forgotPassword}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
