"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SignOut } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

export function SessionsSection() {
  const [busy, setBusy] = useState(false);

  async function handleSignOutAll() {
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) {
        toast.error(error.message);
        setBusy(false);
      } else {
        toast.success("Todas las sesiones cerradas");
        window.location.href = "/login";
      }
    } catch {
      toast.error("Connection error");
      setBusy(false);
    }
  }

  return (
    <div className="border border-neutral-800 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-200">Sesiones activas</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            Cierra sesion en todos los dispositivos y navegadores
          </p>
        </div>
        <button
          onClick={handleSignOutAll}
          disabled={busy}
          className="flex shrink-0 items-center gap-1.5 text-xs text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-30"
        >
          <SignOut size={14} />
          {busy ? "..." : "Cerrar todas"}
        </button>
      </div>
    </div>
  );
}
