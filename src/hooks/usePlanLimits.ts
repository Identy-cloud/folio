import { useEffect, useState } from "react";
import { getPlanLimits, type PlanLimits } from "@/lib/plan-limits";

let cachedPlan: string | null = null;

export function usePlanLimits(): { plan: string; limits: PlanLimits; loading: boolean } {
  const [plan, setPlan] = useState(cachedPlan ?? "free");
  const [loading, setLoading] = useState(!cachedPlan);

  useEffect(() => {
    if (cachedPlan) return;
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.plan) {
          cachedPlan = data.plan;
          setPlan(data.plan);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { plan, limits: getPlanLimits(plan), loading };
}
