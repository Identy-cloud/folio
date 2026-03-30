"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Notebook, GithubLogo, GoogleLogo } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const supabase = createClient();

    try {
      const { error: authError } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (isSignUp) {
        setSuccess(t.auth.checkEmail);
        return;
      }

      const raw = localStorage.getItem("folio-redirect") ?? "/dashboard";
      localStorage.removeItem("folio-redirect");
      const redirect = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
      router.push(redirect);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!email) { setError(t.auth.enterEmail); return; }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setLoading(false);
    if (resetError) { setError(resetError.message); return; }
    setSuccess(t.auth.resetSent);
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleGitHubLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161616] px-4">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center">
          <h1 className="flex items-center justify-center gap-3 font-display text-6xl tracking-tight text-white leading-none sm:text-8xl">
            <Notebook size={64} weight="duotone" className="sm:h-20 sm:w-20" />
            FOLIO
          </h1>
          <p className="mt-1 text-[11px] tracking-[0.4em] text-neutral-500 uppercase">
            {t.auth.subtitle}
          </p>
          <div className="mx-auto mt-6 h-px w-12 bg-neutral-700" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full min-h-[44px] items-center justify-center gap-3 bg-white py-3 text-xs font-semibold tracking-[0.15em] text-black hover:bg-neutral-200 transition-colors"
          >
            <GoogleLogo size={18} weight="bold" />
            {t.auth.google}
          </button>
          <button
            onClick={handleGitHubLogin}
            className="flex w-full min-h-[44px] items-center justify-center gap-3 bg-neutral-800 py-3 text-xs font-semibold tracking-[0.15em] text-white hover:bg-neutral-700 transition-colors"
          >
            <GithubLogo size={18} weight="bold" />
            {t.auth.github}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#161616] px-4 text-[10px] text-neutral-600 uppercase tracking-[0.3em]">
              {t.auth.or}
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <input
            type="email"
            placeholder={t.auth.email}
            aria-label={t.auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-b border-neutral-700 bg-transparent px-2 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-white transition-colors"
          />
          <input
            type="password"
            placeholder={t.auth.password}
            aria-label={t.auth.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border-b border-neutral-700 bg-transparent px-2 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-white transition-colors"
          />

          {isSignUp && (
            <label className="flex items-start gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-white"
              />
              <span className="text-[11px] leading-relaxed text-neutral-500">
                {t.auth.termsPrefix}{" "}
                <Link href="/terms" className="text-neutral-300 underline underline-offset-2 hover:text-white transition-colors">{t.auth.termsLink}</Link>
                {" "}{t.auth.termsAnd}{" "}
                <Link href="/privacy" className="text-neutral-300 underline underline-offset-2 hover:text-white transition-colors">{t.auth.privacyLink}</Link>
              </span>
            </label>
          )}

          {error && (
            <p className="pt-2 text-xs text-red-400" role="alert">{error}</p>
          )}
          {success && (
            <p className="pt-2 text-xs text-green-400" role="status">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading || (isSignUp && !termsAccepted)}
            className="mt-4 w-full bg-white py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            {loading
              ? "..."
              : isSignUp
                ? t.auth.signup
                : t.auth.login}
          </button>
          {!isSignUp && (
            <button
              type="button"
              onClick={handlePasswordReset}
              className="mt-2 w-full text-[10px] text-neutral-600 hover:text-neutral-300 transition-colors"
            >
              {t.auth.forgotPassword}
            </button>
          )}
        </form>

        <p className="text-center text-[11px] text-neutral-600">
          {isSignUp ? t.auth.hasAccount : t.auth.noAccount}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-neutral-300 underline underline-offset-4 hover:text-white transition-colors"
          >
            {isSignUp ? t.auth.loginAction : t.auth.signupAction}
          </button>
        </p>

      </div>
    </div>
  );
}
