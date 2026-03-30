"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown, Plus, Buildings, User } from "@phosphor-icons/react";
import Image from "next/image";

interface Workspace {
  id: string;
  name: string;
  logoUrl: string | null;
  role: string;
}

interface WorkspaceSwitcherProps {
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function WorkspaceSwitcher({ activeId, onSelect }: WorkspaceSwitcherProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/workspaces")
      .then((r) => (r.ok ? r.json() : []))
      .then(setWorkspaces)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const active = workspaces.find((w) => w.id === activeId);

  async function handleCreate() {
    const name = prompt("Workspace name:");
    if (!name?.trim()) return;
    setCreating(true);
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      const ws: Workspace = await res.json();
      setWorkspaces((prev) => [...prev, { ...ws, role: "owner" }]);
      onSelect(ws.id);
    }
    setCreating(false);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
      >
        {active ? (
          <>
            <WorkspaceLogo name={active.name} logoUrl={active.logoUrl} />
            <span className="max-w-[120px] truncate">{active.name}</span>
          </>
        ) : (
          <>
            <User size={14} className="text-neutral-500" />
            <span>Personal</span>
          </>
        )}
        <CaretDown size={12} className="text-neutral-500" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded border border-neutral-700 bg-[#1e1e1e] py-1 shadow-lg">
          <button
            onClick={() => { onSelect(null); setOpen(false); }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
              !activeId ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            <User size={14} className="shrink-0 text-neutral-500" />
            Personal
          </button>

          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => { onSelect(ws.id); setOpen(false); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                activeId === ws.id ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              <WorkspaceLogo name={ws.name} logoUrl={ws.logoUrl} />
              <span className="min-w-0 flex-1 truncate">{ws.name}</span>
              <span className="shrink-0 text-[10px] text-neutral-600">{ws.role}</span>
            </button>
          ))}

          <div className="my-1 border-t border-neutral-700" />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors disabled:opacity-50"
          >
            <Plus size={14} />
            Create workspace
          </button>
        </div>
      )}
    </div>
  );
}

function WorkspaceLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <Image src={logoUrl} alt="" width={16} height={16} className="shrink-0 rounded" />
    );
  }
  return (
    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-neutral-700 text-[8px] font-bold text-neutral-300">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
