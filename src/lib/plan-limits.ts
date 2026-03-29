export type Plan = "free" | "pro" | "team";

interface PlanLimits {
  maxPresentations: number;
  maxStorageBytes: number;
  canExportPdf: boolean;
  canCustomThemes: boolean;
}

const LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxPresentations: 5,
    maxStorageBytes: 100 * 1024 * 1024, // 100 MB
    canExportPdf: false,
    canCustomThemes: false,
  },
  pro: {
    maxPresentations: Infinity,
    maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    canExportPdf: true,
    canCustomThemes: true,
  },
  team: {
    maxPresentations: Infinity,
    maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    canExportPdf: true,
    canCustomThemes: true,
  },
};

export function getPlanLimits(plan: string): PlanLimits {
  return LIMITS[(plan as Plan)] ?? LIMITS.free;
}
