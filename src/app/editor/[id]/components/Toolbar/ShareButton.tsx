"use client";

import { useState, useEffect, useRef } from "react";
import { ShareNetwork, Link as LinkIcon, Check, Globe, Lock } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/context";
import { useClickOutside } from "@/hooks/useClickOutside";

interface PresentationMeta {
  slug: string;
  isPublic: boolean;
  password: string | null;
}

export function ShareButton() {
  const { t } = useTranslation();
  const presentationId = useEditorStore((s) => s.presentationId);
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState<PresentationMeta | null>(null);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pw, setPw] = useState("");
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !presentationId) return;
    fetch(`/api/presentations/${presentationId}`)
      .then((r) => r.json())
      .then((d) => { setMeta({ slug: d.slug, isPublic: d.isPublic, password: d.password ?? null }); setPw(d.password ?? ""); })
      .catch(() => {});
  }, [open, presentationId]);

  useClickOutside(popRef, () => setOpen(false), open);

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
      toast.success(meta.isPublic ? t.dashboard.nowPrivate : t.dashboard.nowPublic);
    }
    setToggling(false);
  }

  function copyLink() {
    if (!meta) return;
    const url = `${window.location.origin}/p/${meta.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(t.editor.linkCopied);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div ref={popRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors md:px-3"
        aria-label={t.editor.share}
        aria-expanded={open}
      >
        <ShareNetwork size={14} weight="duotone" />
        <span className="hidden md:inline">{t.editor.share}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded border border-neutral-700 bg-[#1e1e1e] p-4 shadow-xl sm:w-80">
          {!meta ? (
            <p className="text-xs text-neutral-500">{t.common.loading}</p>
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
                    {meta.isPublic ? t.editor.publicLabel : t.editor.privateLabel}
                  </span>
                </div>
                <button
                  onClick={togglePublic}
                  disabled={toggling}
                  role="switch"
                  aria-checked={meta.isPublic}
                  aria-label={t.editor.shareLabel}
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
                    {t.editor.publicDesc}
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

                  {/* Password */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      placeholder={t.editor.passwordPlaceholder}
                      className="flex-1 rounded border border-neutral-700 bg-[#111111] px-2 py-1.5 text-xs text-neutral-300 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
                    />
                    <button
                      onClick={async () => {
                        const password = pw.trim() || null;
                        await fetch(`/api/presentations/${presentationId}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ password }),
                        });
                        setMeta({ ...meta, password });
                        toast.success(password ? t.editor.passwordSet : t.editor.passwordRemoved);
                      }}
                      className="shrink-0 rounded bg-neutral-800 px-2 py-1.5 text-[10px] text-neutral-300 hover:bg-neutral-700 transition-colors"
                    >
                      {pw.trim() ? "Set" : "Clear"}
                    </button>
                  </div>

                  {/* Embed */}
                  <button
                    onClick={() => {
                      const code = `<iframe src="${window.location.origin}/embed/${meta.slug}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;
                      navigator.clipboard.writeText(code);
                      toast.success(t.editor.embedCopied);
                    }}
                    className="w-full rounded border border-neutral-700 py-1.5 text-[10px] text-neutral-400 hover:bg-neutral-800 transition-colors"
                  >
                    {t.editor.embed} — Copy iframe
                  </button>
                </>
              ) : (
                <p className="text-xs text-neutral-500">
                  {t.editor.privateDesc}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
