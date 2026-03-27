"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
        setError("Revisa tu email para confirmar tu cuenta");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center">
          <h1 className="font-display text-8xl tracking-tight text-white leading-none">
            FOLIO
          </h1>
          <p className="mt-1 text-[11px] tracking-[0.4em] text-neutral-500 uppercase">
            Editorial Slides
          </p>
          <div className="mx-auto mt-6 h-px w-12 bg-neutral-700" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-b border-neutral-700 bg-transparent px-1 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white transition-colors"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border-b border-neutral-700 bg-transparent px-1 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white transition-colors"
          />

          {error && (
            <p className="pt-2 text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-white py-3 text-xs font-semibold tracking-[0.25em] text-black uppercase hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            {loading
              ? "..."
              : isSignUp
                ? "Crear cuenta"
                : "Iniciar sesión"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0a0a0a] px-4 text-[10px] text-neutral-600 uppercase tracking-[0.3em]">
              o
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-neutral-700 py-3 text-xs tracking-[0.25em] text-neutral-400 uppercase hover:border-white hover:text-white transition-colors"
        >
          Continuar con Google
        </button>

        <p className="text-center text-[11px] text-neutral-600">
          {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-neutral-300 underline underline-offset-4 hover:text-white transition-colors"
          >
            {isSignUp ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}
