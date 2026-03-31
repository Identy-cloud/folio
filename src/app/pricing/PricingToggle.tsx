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
    <div className="relative mt-10 inline-flex items-center rounded-full border border-steel/40 bg-slate/30 p-1">
      <div
        className="absolute top-1 bottom-1 rounded-full bg-accent transition-all duration-300 ease-out"
        style={{
          left: annual ? "50%" : "4px",
          width: annual ? "calc(50% - 4px)" : "calc(50% - 4px)",
        }}
      />
      <button
        onClick={() => setAnnual(false)}
        className={`relative z-10 px-5 py-2 text-xs font-medium tracking-wide transition-colors rounded-full ${
          !annual ? "text-white" : "text-silver/60 hover:text-white"
        }`}
      >
        {monthlyLabel}
      </button>
      <button
        onClick={() => setAnnual(true)}
        className={`relative z-10 flex items-center gap-2 px-5 py-2 text-xs font-medium tracking-wide transition-colors rounded-full ${
          annual ? "text-white" : "text-silver/60 hover:text-white"
        }`}
      >
        {annualLabel}
        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400">
          {discountLabel}
        </span>
      </button>
    </div>
  );
}
