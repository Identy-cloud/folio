"use client";

interface PricingToggleProps {
  annual: boolean;
  setAnnual: (v: boolean) => void;
  monthlyLabel: string;
  annualLabel: string;
  discountLabel: string;
}

export function PricingToggle({
  annual, setAnnual, monthlyLabel, annualLabel, discountLabel,
}: PricingToggleProps) {
  return (
    <div className="mt-10 inline-flex items-center rounded-full border border-silver/40 bg-[#FAFAFA] p-1">
      <button
        onClick={() => setAnnual(false)}
        className={`px-5 py-2 text-xs font-medium tracking-wide transition-colors duration-200 rounded-full ${
          !annual ? "bg-navy text-white" : "text-steel hover:text-navy"
        }`}
      >
        {monthlyLabel}
      </button>
      <button
        onClick={() => setAnnual(true)}
        className={`flex items-center gap-2 px-5 py-2 text-xs font-medium tracking-wide transition-colors duration-200 rounded-full ${
          annual ? "bg-navy text-white" : "text-steel hover:text-navy"
        }`}
      >
        {annualLabel}
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          annual ? "bg-green-400/20 text-green-300" : "bg-green-500/15 text-green-600"
        }`}>
          {discountLabel}
        </span>
      </button>
    </div>
  );
}
