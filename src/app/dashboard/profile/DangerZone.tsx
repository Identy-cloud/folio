"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash, Warning } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

export function DangerZone() {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);

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
        window.location.href = "/login";
      } else {
        const data: { error?: string } = await res.json().catch(() => ({}));
        toast.error(
          data.error === "Invalid password"
            ? t.auth.wrongPassword
            : (t.common.error ?? "Failed to delete account")
        );
      }
    } catch {
      toast.error(t.common.connectionError ?? "Connection error");
    }
    setDeleting(false);
    setPassword("");
  }

  return (
    <div className="border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2">
        <Warning size={14} className="text-red-500" />
        <p className="text-[10px] font-medium uppercase tracking-wider text-red-500">
          Zona de peligro
        </p>
      </div>
      <p className="mt-2 text-xs text-steel">
        Una vez que elimines tu cuenta, se borrarán todas tus presentaciones,
        datos y configuraciones de forma permanente.
      </p>
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="mt-3 flex items-center gap-2 text-xs text-steel hover:text-red-500 transition-colors"
        >
          <Trash size={14} />
          {t.auth.deleteAccount}
        </button>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-red-500">{t.auth.deleteConfirm}</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.auth.enterPassword}
            autoFocus
            className="w-full border-b border-silver/40 bg-transparent px-2 py-2 text-sm text-navy outline-none placeholder:text-steel/50 focus:border-red-500 transition-colors"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting || !password.trim()}
              className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? "..." : t.auth.deleteAction}
            </button>
            <button
              onClick={() => { setConfirming(false); setPassword(""); }}
              className="text-xs text-steel hover:text-slate transition-colors"
            >
              {t.auth.deleteCancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
