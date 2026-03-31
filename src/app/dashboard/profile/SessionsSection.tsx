"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Desktop, DeviceMobile, DeviceTablet, X, SignOut } from "@phosphor-icons/react";
import { Bone } from "./ProfileSkeleton";

interface Session {
  id: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  ip: string | null;
  lastActiveAt: string;
  createdAt: string;
}

const DEVICE_ICON: Record<string, typeof Desktop> = {
  Mobile: DeviceMobile,
  Tablet: DeviceTablet,
};

function relativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

export function SessionsSection() {
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => (r.ok ? r.json() : { sessions: [] }))
      .then((d) => setItems(d.sessions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function revoke(id: string) {
    setBusy(id);
    const res = await fetch("/api/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((s) => s.id !== id));
      toast.success("Sesion cerrada");
    } else {
      toast.error("Error");
    }
    setBusy(null);
  }

  async function revokeAll() {
    setBusy("all");
    const res = await fetch("/api/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    if (res.ok) {
      setItems([]);
      toast.success("Todas las sesiones cerradas");
    } else {
      toast.error("Error");
    }
    setBusy(null);
  }

  if (loading) return (
    <div className="border border-neutral-800 p-4 space-y-3">
      <Bone className="h-3 w-28" />
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Bone className="h-5 w-5" />
          <div className="flex-1 space-y-1">
            <Bone className="h-3 w-32" />
            <Bone className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="border border-neutral-800 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          Sesiones activas
        </p>
        {items.length > 1 && (
          <button
            onClick={revokeAll}
            disabled={busy === "all"}
            className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-30"
          >
            <SignOut size={12} />
            {busy === "all" ? "..." : "Cerrar todas"}
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-neutral-500">No hay sesiones registradas</p>
      ) : (
        <div className="space-y-2">
          {items.map((s) => {
            const Icon = DEVICE_ICON[s.device ?? ""] ?? Desktop;
            return (
              <div key={s.id} className="flex items-center gap-3 rounded p-2 hover:bg-neutral-800/50 transition-colors">
                <Icon size={18} className="shrink-0 text-neutral-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-neutral-200">
                    {s.browser ?? "Unknown"} · {s.os ?? "Unknown"}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {s.ip ?? "—"} · {relativeTime(s.lastActiveAt)}
                  </p>
                </div>
                <button
                  onClick={() => revoke(s.id)}
                  disabled={busy === s.id}
                  aria-label="Revocar sesion"
                  className="shrink-0 text-neutral-600 hover:text-red-400 transition-colors disabled:opacity-30"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
