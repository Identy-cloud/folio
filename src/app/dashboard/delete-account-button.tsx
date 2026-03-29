"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteAccountButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      router.push("/login");
      router.refresh();
    }
    setDeleting(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-red-400">Seguro?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[10px] text-red-400 underline underline-offset-2 hover:text-red-300 disabled:opacity-50"
        >
          {deleting ? "..." : "Eliminar"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[10px] text-neutral-500 hover:text-neutral-300"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-[10px] text-neutral-600 hover:text-red-400 transition-colors"
    >
      Eliminar cuenta
    </button>
  );
}
