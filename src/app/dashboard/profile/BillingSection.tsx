"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CreditCard, Receipt, ArrowSquareOut } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";
import { Bone } from "./ProfileSkeleton";

interface BillingData {
  plan: string;
  billingPeriod: string;
  status: string;
  currentPeriodEnd: string | null;
  paymentMethod: { brand: string; last4: string; expMonth: number; expYear: number } | null;
  invoices: { id: string; date: string; amount: number; currency: string; status: string; url: string | null }[];
}

const PLAN_LABELS: Record<string, string> = { free: "Free", creator: "Creator", studio: "Studio", agency: "Agency" };
const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  active: { text: "Activo", color: "text-green-600" },
  canceled: { text: "Cancelado", color: "text-red-500" },
  past_due: { text: "Pago pendiente", color: "text-amber-500" },
  trialing: { text: "Periodo de prueba", color: "text-blue-500" },
};

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("es", { style: "currency", currency }).format(cents / 100);
}

export function BillingSection() {
  const { t } = useTranslation();
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function openPortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const d = await res.json();
    if (d.url) window.location.href = d.url;
  }

  if (loading) return (
    <div className="space-y-4">
      <Bone className="h-3 w-24" />
      <div className="border border-silver/30 p-4 space-y-3">
        <Bone className="h-6 w-20" />
        <Bone className="h-3 w-32" />
      </div>
    </div>
  );
  if (!data) return null;

  const status = STATUS_LABELS[data.status] ?? STATUS_LABELS.active;

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-steel">
        Facturacion
      </p>

      {/* Plan + status */}
      <div className="border border-silver/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-navy">
              {PLAN_LABELS[data.plan] ?? data.plan}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-[11px] ${status.color}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {status.text}
              </span>
              {data.plan !== "free" && (
                <span className="text-[11px] text-steel">
                  {data.billingPeriod === "annual" ? "Anual" : "Mensual"}
                </span>
              )}
            </div>
            {data.currentPeriodEnd && data.plan !== "free" && (
              <p className="mt-1 text-[11px] text-steel">
                Renueva el {new Date(data.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {data.plan !== "free" && (
              <button onClick={openPortal} className="text-xs tracking-[0.15em] text-steel uppercase hover:text-navy transition-colors">
                Gestionar
              </button>
            )}
            <Link href="/pricing" className="text-xs tracking-[0.15em] text-slate uppercase hover:text-navy transition-colors">
              {data.plan === "free" ? "Upgrade" : (t.dashboard.profileUpgrade ?? "Ver planes")}
            </Link>
          </div>
        </div>
      </div>

      {/* Payment method */}
      {data.paymentMethod && (
        <div className="border border-silver/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-steel" />
              <div>
                <p className="text-xs text-slate">
                  {data.paymentMethod.brand.charAt(0).toUpperCase() + data.paymentMethod.brand.slice(1)} **** {data.paymentMethod.last4}
                </p>
                <p className="text-[11px] text-steel">
                  Exp. {String(data.paymentMethod.expMonth).padStart(2, "0")}/{data.paymentMethod.expYear}
                </p>
              </div>
            </div>
            <button onClick={openPortal} className="text-xs text-steel hover:text-navy transition-colors">
              Cambiar
            </button>
          </div>
        </div>
      )}

      {/* Invoices */}
      {data.invoices.length > 0 && (
        <div className="border border-silver/30 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Receipt size={14} className="text-steel" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-steel">Facturas recientes</p>
          </div>
          <div className="space-y-2">
            {data.invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between text-xs">
                <span className="text-slate">{new Date(inv.date).toLocaleDateString()}</span>
                <span className="text-navy">{formatAmount(inv.amount, inv.currency)}</span>
                <span className={`text-[10px] ${inv.status === "paid" ? "text-green-600" : "text-steel"}`}>
                  {inv.status === "paid" ? "Pagada" : inv.status}
                </span>
                {inv.url && (
                  <a href={inv.url} target="_blank" rel="noopener noreferrer" aria-label="Ver factura" className="text-steel hover:text-navy transition-colors">
                    <ArrowSquareOut size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
