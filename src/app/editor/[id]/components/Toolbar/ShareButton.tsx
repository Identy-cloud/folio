"use client";

import { useState, useEffect, useRef } from "react";
import { ShareNetwork, Link as LinkIcon, Check, Globe, Lock } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";

interface PresentationMeta {
  slug: string;
  isPublic: boolean;
}

export function ShareButton() {
  const presentationId = useEditorStore((s) => s.presentationId);
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState<PresentationMeta | null>(null);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !presentationId) return;
    fetch(`/api/presentations/${presentationId}`)
      .then((r) => r.json())
      .then((d) => setMeta({ slug: d.slug, isPublic: d.isPublic }))
      .catch(() => {});
  }, [open, presentationId]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function togglePublic() {
    if (!meta) return;
    setToggling(true);
    const res = await fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !meta.isPublic }),
    });
    if (res.ok) {
      setMeta({ ...meta, isPublic: !meta.isPublic });
      toast.success(meta.isPublic ? "Ahora es privada" : "Ahora es pública");
    }
    setToggling(false);
  }

  function copyLink() {
    if (!meta) return;
    const url = `${window.location.origin}/p/${meta.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Enlace copiado");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div ref={popRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors md:px-3"
      >
        <ShareNetwork size={14} weight="duotone" />
        <span className="hidden md:inline">Compartir</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded border border-neutral-700 bg-[#1e1e1e] p-4 shadow-xl sm:w-80">
          {!meta ? (
            <p className="text-xs text-neutral-500">Cargando...</p>
          ) : (
            <div className="space-y-4">
              {/* Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {meta.isPublic ? (
                    <Globe size={16} className="text-green-500" />
                  ) : (
                    <Lock size={16} className="text-neutral-500" />
                  )}
                  <span className="text-sm text-neutral-200">
                    {meta.isPublic ? "Pública" : "Privada"}
                  </span>
                </div>
                <button
                  onClick={togglePublic}
                  disabled={toggling}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    meta.isPublic ? "bg-green-600" : "bg-neutral-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      meta.isPublic ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {meta.isPublic ? (
                <>
                  <p className="text-xs text-neutral-500">
                    Cualquiera con el enlace puede ver esta presentación.
                  </p>
                  {/* URL + Copy */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 truncate rounded bg-[#111111] px-3 py-2 text-xs text-neutral-400">
                      {window.location.origin}/p/{meta.slug}
                    </div>
                    <button
                      onClick={copyLink}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-white text-[#161616] hover:bg-neutral-200 transition-colors"
                    >
                      {copied ? <Check size={14} /> : <LinkIcon size={14} />}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-neutral-500">
                  Activa el enlace público para compartir con tu cliente.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
