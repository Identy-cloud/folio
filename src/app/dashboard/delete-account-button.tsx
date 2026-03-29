"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

export function DeleteAccountButton() {
  const { t } = useTranslation();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        const { toast } = await import("sonner");
        toast.error(t.common.error ?? "Failed to delete account");
      }
    } catch {
      const { toast } = await import("sonner");
      toast.error(t.common.connectionError ?? "Connection error");
    }
    setDeleting(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div role="alertdialog" aria-label={t.auth.deleteConfirm} className="flex items-center gap-2">
        <span className="text-[10px] text-red-400">{t.auth.deleteConfirm}</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[10px] text-red-400 underline underline-offset-2 hover:text-red-300 disabled:opacity-50"
        >
          {deleting ? "..." : t.auth.deleteAction}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[10px] text-neutral-500 hover:text-neutral-300"
        >
          {t.auth.deleteCancel}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-[10px] text-neutral-600 hover:text-red-400 transition-colors"
    >
      {t.auth.deleteAccount}
    </button>
  );
}
