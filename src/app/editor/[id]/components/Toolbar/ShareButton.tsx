"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { ShareNetwork, Link as LinkIcon, Check, Globe, Lock, Clock, Key } from "@phosphor-icons/react";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/context";
import { useClickOutside } from "@/hooks/useClickOutside";
import { EmbedPanel } from "./EmbedPanel";

interface PresentationMeta {
  slug: string;
  isPublic: boolean;
  password: string | null;
  shareExpiresAt: string | null;
  shareToken: string | null;
}

type ExpirationOption = "none" | "1h" | "24h" | "7d" | "30d" | "custom";

function getExpirationDate(option: ExpirationOption): string | null {
  if (option === "none" || option === "custom") return null;
  const now = new Date();
  const ms: Record<string, number> = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  return new Date(now.getTime() + ms[option]).toISOString();
}

function formatTimeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  }
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

export function ShareButton() {
  const { t } = useTranslation();
  const presentationId = useEditorStore((s) => s.presentationId);
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState<PresentationMeta | null>(null);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [pw, setPw] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !presentationId) return;
    fetch(`/api/presentations/${presentationId}`)
      .then((r) => r.json())
      .then((d) => {
        setMeta({
          slug: d.slug,
          isPublic: d.isPublic,
          password: d.password ?? null,
          shareExpiresAt: d.shareExpiresAt ?? null,
          shareToken: d.shareToken ?? null,
        });
        setPw(d.password ?? "");
      })
      .catch(() => {});
  }, [open, presentationId]);

  useClickOutside(popRef, () => setOpen(false), open);

  useEffect(() => {
    if (meta?.isPublic && meta.slug) {
      QRCode.toDataURL(`${window.location.origin}/p/${meta.slug}`, {
        width: 120, margin: 1, color: { dark: "#ffffff", light: "#00000000" },
      }).then(setQrUrl).catch(() => {});
    } else {
      setQrUrl(null);
    }
  }, [meta?.isPublic, meta?.slug]);

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

  function copyTokenLink() {
    if (!meta?.shareToken) return;
    const url = `${window.location.origin}/p/${meta.slug}?token=${meta.shareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(true);
    toast.success(t.editor.linkCopied);
    setTimeout(() => setCopiedToken(false), 2000);
  }

  async function setExpiration(option: ExpirationOption) {
    if (!meta) return;
    if (option === "custom") {
      setShowCustomDate(true);
      return;
    }
    setShowCustomDate(false);
    const shareExpiresAt = getExpirationDate(option);
    const res = await fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shareExpiresAt }),
    });
    if (res.ok) {
      setMeta({ ...meta, shareExpiresAt });
      toast.success(shareExpiresAt ? t.editor.expirationSet : t.editor.expirationRemoved);
    }
  }

  async function setCustomExpiration() {
    if (!meta || !customDate) return;
    const shareExpiresAt = new Date(customDate).toISOString();
    const res = await fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shareExpiresAt }),
    });
    if (res.ok) {
      setMeta({ ...meta, shareExpiresAt });
      setShowCustomDate(false);
      toast.success(t.editor.expirationSet);
    }
  }

  async function generateToken() {
    if (!meta) return;
    const res = await fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generateShareToken: true }),
    });
    if (res.ok) {
      const data = await res.json();
      setMeta({ ...meta, shareToken: data.shareToken });
      toast.success(t.editor.tokenGenerated);
    }
  }

  async function revokeToken() {
    if (!meta) return;
    const res = await fetch(`/api/presentations/${presentationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revokeShareToken: true }),
    });
    if (res.ok) {
      setMeta({ ...meta, shareToken: null });
      toast.success(t.editor.tokenRevoked);
    }
  }

  const expirationOptions: { label: string; value: ExpirationOption }[] = [
    { label: t.editor.noExpiration, value: "none" },
    { label: t.editor.expire1h, value: "1h" },
    { label: t.editor.expire24h, value: "24h" },
    { label: t.editor.expire7d, value: "7d" },
    { label: t.editor.expire30d, value: "30d" },
    { label: t.editor.expireCustom, value: "custom" },
  ];

  return (
    <div ref={popRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors md:px-3"
        aria-label={t.editor.share}
        aria-expanded={open}
      >
        <ShareNetwork size={14} weight="regular" />
        <span className="hidden md:inline">{t.editor.share}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-[calc(100vw-2rem)] max-w-72 rounded border border-neutral-700 bg-[#1e1e1e] p-4 shadow-xl sm:max-w-80 max-h-[80vh] overflow-y-auto">
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

                  {/* Expiration */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-neutral-500" />
                      <span className="text-xs font-medium text-neutral-300">
                        {t.editor.linkExpiration}
                      </span>
                    </div>

                    {meta.shareExpiresAt && (
                      <p className="text-xs text-amber-400">
                        {formatTimeRemaining(meta.shareExpiresAt)}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-1">
                      {expirationOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setExpiration(opt.value)}
                          className="rounded border border-neutral-700 px-1.5 py-1 text-[10px] text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {showCustomDate && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="datetime-local"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="flex-1 rounded border border-neutral-700 bg-[#111111] px-2 py-1 text-xs text-neutral-300 outline-none focus:border-neutral-500"
                        />
                        <button
                          onClick={setCustomExpiration}
                          disabled={!customDate}
                          className="shrink-0 rounded bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 hover:bg-neutral-700 transition-colors disabled:opacity-40"
                        >
                          {t.common.save}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* QR Code */}
                  {qrUrl && (
                    <div className="flex justify-center">
                      <img src={qrUrl} alt="QR" width={96} height={96} className="rounded" />
                    </div>
                  )}

                  {/* Password */}
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      placeholder={t.editor.passwordPlaceholder}
                      className="flex-1 rounded border border-neutral-700 bg-[#111111] px-2 py-1.5 text-xs text-neutral-300 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
                    />
                    {pw.trim().length > 0 && pw.trim().length < 6 && (
                      <span className="absolute -bottom-4 left-0 text-xs text-amber-500">Weak password</span>
                    )}
                    <button
                      onClick={async () => {
                        const password = pw.trim() || null;
                        const res = await fetch(`/api/presentations/${presentationId}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ password }),
                        });
                        if (res.ok) {
                          setMeta({ ...meta, password });
                          toast.success(password ? t.editor.passwordSet : t.editor.passwordRemoved);
                        } else {
                          toast.error(t.common.error ?? "Failed to save");
                        }
                      }}
                      className="shrink-0 rounded bg-neutral-800 px-2 py-1.5 text-[10px] text-neutral-300 hover:bg-neutral-700 transition-colors"
                    >
                      {pw.trim() ? "Set" : "Clear"}
                    </button>
                  </div>

                  {/* Private token link */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Key size={14} className="text-neutral-500" />
                      <span className="text-xs font-medium text-neutral-300">
                        {t.editor.privateLink}
                      </span>
                    </div>
                    {meta.shareToken ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 truncate rounded bg-[#111111] px-2 py-1.5 text-[10px] text-neutral-500">
                            ...?token={meta.shareToken.slice(0, 12)}...
                          </div>
                          <button
                            onClick={copyTokenLink}
                            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                          >
                            {copiedToken ? <Check size={12} /> : <LinkIcon size={12} />}
                          </button>
                        </div>
                        <button
                          onClick={revokeToken}
                          className="w-full rounded border border-red-900/50 py-1 text-[10px] text-red-400 hover:bg-red-900/20 transition-colors"
                        >
                          {t.editor.revokeToken}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={generateToken}
                        className="w-full rounded border border-neutral-700 py-1.5 text-[10px] text-neutral-400 hover:bg-neutral-800 transition-colors"
                      >
                        {t.editor.generatePrivateLink}
                      </button>
                    )}
                    <p className="text-[10px] text-neutral-600">
                      {t.editor.privateLinkDesc}
                    </p>
                  </div>

                  {/* Embed */}
                  <EmbedPanel slug={meta.slug} />

                  {/* Social sharing */}
                  <div className="flex gap-1.5">
                    {([
                      { label: "X", href: `https://x.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/p/${meta.slug}`)}&text=${encodeURIComponent(t.editor.share)}` },
                      { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/p/${meta.slug}`)}` },
                      { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${window.location.origin}/p/${meta.slug}`)}` },
                    ] as const).map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded border border-neutral-700 py-1.5 text-center text-[10px] text-neutral-400 hover:bg-neutral-800 transition-colors"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
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
