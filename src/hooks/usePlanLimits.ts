import { useEffect, useState } from "react";
import { getPlanLimits, type PlanLimits } from "@/lib/plan-limits";

export function usePlanLimits(): { plan: string; limits: PlanLimits; loading: boolean } {
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.plan) {
          setPlan(data.plan);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { plan, limits: loading ? getPlanLimits("agency") : getPlanLimits(plan), loading };
}
