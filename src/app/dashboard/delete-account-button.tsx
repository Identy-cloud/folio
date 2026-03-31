"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

export function DeleteAccountButton() {
  const { t } = useTranslation();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");

  async function handleDelete() {
    if (!password.trim()) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        const data: { error?: string } = await res.json().catch(() => ({}));
        const { toast } = await import("sonner");
        if (data.error === "Invalid password") {
          toast.error(t.auth.wrongPassword);
        } else {
          toast.error(t.common.error ?? "Failed to delete account");
        }
      }
    } catch {
      const { toast } = await import("sonner");
      toast.error(t.common.connectionError ?? "Connection error");
    }
    setDeleting(false);
    setPassword("");
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div role="alertdialog" aria-label={t.auth.deleteConfirm} className="flex flex-col gap-2">
        <span className="text-[10px] text-red-400">{t.auth.deleteConfirm}</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.auth.enterPassword}
          autoFocus
          className="h-7 rounded border border-steel bg-navy px-2 text-[10px] text-silver placeholder:text-silver/40 focus:border-red-500 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleDelete();
          }}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting || !password.trim()}
            className="text-[10px] text-red-400 underline underline-offset-2 hover:text-red-300 disabled:opacity-50"
          >
            {deleting ? "..." : t.auth.deleteAction}
          </button>
          <button
            onClick={() => { setConfirming(false); setPassword(""); }}
            className="text-[10px] text-silver/50 hover:text-silver"
          >
            {t.auth.deleteCancel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-[10px] text-silver/40 hover:text-red-400 transition-colors"
    >
      {t.auth.deleteAccount}
    </button>
  );
}
