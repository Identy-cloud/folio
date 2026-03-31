"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { LoginBranding } from "./LoginBranding";
import { LoginForm } from "./LoginForm";

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

  async function handlePasswordReset(resetEmail: string) {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
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
    <div className="flex min-h-screen bg-white">
      <LoginBranding subtitle={t.auth.subtitle} />
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        error={error}
        setError={setError}
        success={success}
        loading={loading}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
        onSubmit={handleEmailAuth}
        onPasswordReset={handlePasswordReset}
        onGoogleLogin={handleGoogleLogin}
        onGitHubLogin={handleGitHubLogin}
        t={t}
      />
    </div>
  );
}
