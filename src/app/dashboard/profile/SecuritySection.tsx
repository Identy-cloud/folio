"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

export function SecuritySection() {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  async function handleChange() {
    if (!newPassword.trim() || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChanging(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast.error(t.common.connectionError);
    } finally {
      setChanging(false);
    }
  }

  return (
    <div className="border border-neutral-800 p-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
        Cambiar contraseña
      </p>
      <div className="mt-3 space-y-2">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nueva contraseña (min. 8 caracteres)"
          className="w-full border-b border-neutral-700 bg-transparent px-2 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-white transition-colors"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar contraseña"
          className="w-full border-b border-neutral-700 bg-transparent px-2 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-white transition-colors"
        />
        <div className="flex justify-end pt-1">
          <button
            onClick={handleChange}
            disabled={changing || !newPassword.trim() || !confirmPassword.trim()}
            className="shrink-0 bg-white px-4 py-2 text-xs font-medium tracking-widest text-[#161616] uppercase hover:bg-neutral-200 transition-colors disabled:opacity-30"
          >
            {changing ? "..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}
