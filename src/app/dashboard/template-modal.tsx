"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/templates/themes";
import { toast } from "sonner";
import { X, Plus } from "@phosphor-icons/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const themeKeys = Object.keys(THEMES);

export function TemplateModal({ open, onClose }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState<string | null>(null);

  if (!open) return null;

  async function handleSelect(themeKey: string) {
    setCreating(themeKey);
    try {
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeKey, useTemplate: true }),
      });
      if (res.ok) {
        const p = await res.json();
        router.push(`/editor/${p.id}`);
        router.refresh();
      } else {
        toast.error("Error al crear presentación");
        setCreating(null);
      }
    } catch {
      toast.error("Error de conexión");
      setCreating(null);
    }
  }

  async function handleBlank() {
    setCreating("blank");
    try {
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useTemplate: false }),
      });
      if (res.ok) {
        const p = await res.json();
        router.push(`/editor/${p.id}`);
        router.refresh();
      } else {
        toast.error("Error al crear presentación");
        setCreating(null);
      }
    } catch {
      toast.error("Error de conexión");
      setCreating(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-4xl rounded-sm bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-tight">
              NUEVA PRESENTACIÓN
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Elige un tema o empieza en blanco
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={creating !== null}
            className="text-neutral-400 hover:text-neutral-900 disabled:opacity-30"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {themeKeys.map((key) => {
            const t = THEMES[key];
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={creating !== null}
                className="group relative overflow-hidden border border-neutral-200 text-left transition-shadow hover:shadow-lg disabled:opacity-50"
              >
                <div
                  className="flex aspect-video items-end p-4"
                  style={{ backgroundColor: t.background }}
                >
                  <div>
                    <p
                      className="text-2xl leading-none"
                      style={{
                        fontFamily: t.fontDisplay,
                        color: t.text,
                      }}
                    >
                      {t.label}
                    </p>
                    <div
                      className="mt-2 h-0.5 w-8"
                      style={{ backgroundColor: t.accent }}
                    />
                  </div>
                  <div
                    className="absolute right-4 top-4 h-6 w-6 rounded-full"
                    style={{ backgroundColor: t.accent }}
                  />
                </div>
                <div className="px-4 py-2">
                  <p className="text-xs text-neutral-500">
                    {t.fontDisplay} + {t.fontBody}
                  </p>
                </div>
                {creating === key && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <span className="text-xs text-neutral-500">Creando...</span>
                  </div>
                )}
              </button>
            );
          })}

          <button
            onClick={handleBlank}
            disabled={creating !== null}
            className="flex aspect-video items-center justify-center border-2 border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-600 disabled:opacity-50"
          >
            <div className="flex flex-col items-center">
              <Plus size={28} />
              <span className="mt-2 block text-xs uppercase tracking-wider">
                En blanco
              </span>
            </div>
            {creating === "blank" && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <span className="text-xs text-neutral-500">Creando...</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
