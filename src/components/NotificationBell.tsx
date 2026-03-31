"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, ChatCircle, UsersThree, ShareNetwork, Check } from "@phosphor-icons/react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  presentationId: string | null;
  read: boolean;
  createdAt: string;
}

const typeIcon: Record<string, typeof ChatCircle> = {
  comment: ChatCircle,
  collaborator_added: UsersThree,
  collaborator_removed: UsersThree,
  presentation_shared: ShareNetwork,
};

function relativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Notification[]) => setItems(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const unreadCount = items.filter((n) => !n.read).length;

  function markAsRead(ids: string[] | "all") {
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).then(() => {
      setItems((prev) =>
        prev.map((n) =>
          ids === "all" || ids.includes(n.id) ? { ...n, read: true } : n
        )
      );
    }).catch(() => {});
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate hover:bg-[#FAFAFA] hover:text-navy transition-colors"
        aria-label="Notificaciones"
      >
        <Bell size={18} weight={unreadCount > 0 ? "fill" : "regular"} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="fixed inset-x-0 top-14 z-50 mx-auto max-w-sm sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-80">
          <div className="mx-2 rounded-lg border border-silver/40 bg-white shadow-xl sm:mx-0">
            <div className="flex items-center justify-between border-b border-silver/30 px-4 py-2.5">
              <span className="text-xs font-medium text-navy">Notificaciones</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead("all")}
                  className="flex items-center gap-1 text-[10px] text-slate hover:text-navy transition-colors"
                >
                  <Check size={12} /> Marcar todo leido
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-steel">Sin notificaciones</p>
              ) : (
                items.map((n) => {
                  const Icon = typeIcon[n.type] ?? Bell;
                  const inner = (
                    <div
                      className={`flex gap-3 px-4 py-3 transition-colors hover:bg-[#FAFAFA] ${!n.read ? "bg-[#FAFAFA]" : ""}`}
                    >
                      <Icon size={16} className="mt-0.5 shrink-0 text-slate" weight="regular" />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs truncate ${!n.read ? "text-navy font-medium" : "text-navy"}`}>{n.title}</p>
                        <p className="mt-0.5 text-[11px] text-steel line-clamp-2">{n.message}</p>
                        <p className="mt-1 text-[10px] text-steel/60">{relativeTime(n.createdAt)}</p>
                      </div>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                    </div>
                  );
                  if (n.presentationId) {
                    return (
                      <Link
                        key={n.id}
                        href={`/editor/${n.presentationId}`}
                        onClick={() => { if (!n.read) markAsRead([n.id]); setOpen(false); }}
                      >
                        {inner}
                      </Link>
                    );
                  }
                  return (
                    <div key={n.id} onClick={() => { if (!n.read) markAsRead([n.id]); }} className="cursor-default">
                      {inner}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
