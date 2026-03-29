import type { Plan } from "./stripe";

export interface PlanLimits {
  maxPresentations: number;
  maxStorageBytes: number;
  maxCollaborators: number;
  hasWatermark: boolean;
  canExportPdf: boolean;
  canExportPptx: boolean;
  canCollaborate: boolean;
  canUseCustomDomain: boolean;
  canUseBrandKit: boolean;
  canUseCustomFonts: boolean;
  canUseMultiWorkspace: boolean;
  canWhiteLabel: boolean;
  canUseAllTemplates: boolean;
  canUseAnalytics: boolean;
  canUseAdvancedAnalytics: boolean;
}

export const FREE_THEMES = ["editorial-blue"] as const;

const LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxPresentations: 3,
    maxStorageBytes: 100 * 1024 * 1024, // 100 MB
    maxCollaborators: 0,
    hasWatermark: true,
    canExportPdf: false,
    canExportPptx: false,
    canCollaborate: false,
    canUseCustomDomain: false,
    canUseBrandKit: false,
    canUseCustomFonts: false,
    canUseMultiWorkspace: false,
    canWhiteLabel: false,
    canUseAllTemplates: false,
    canUseAnalytics: false,
    canUseAdvancedAnalytics: false,
  },
  creator: {
    maxPresentations: Infinity,
    maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    maxCollaborators: 0,
    hasWatermark: false,
    canExportPdf: true,
    canExportPptx: false,
    canCollaborate: false,
    canUseCustomDomain: true,
    canUseBrandKit: false,
    canUseCustomFonts: false,
    canUseMultiWorkspace: false,
    canWhiteLabel: false,
    canUseAllTemplates: true,
    canUseAnalytics: true,
    canUseAdvancedAnalytics: false,
  },
  studio: {
    maxPresentations: Infinity,
    maxStorageBytes: 50 * 1024 * 1024 * 1024, // 50 GB
    maxCollaborators: 5,
    hasWatermark: false,
    canExportPdf: true,
    canExportPptx: true,
    canCollaborate: true,
    canUseCustomDomain: true,
    canUseBrandKit: true,
    canUseCustomFonts: true,
    canUseMultiWorkspace: false,
    canWhiteLabel: false,
    canUseAllTemplates: true,
    canUseAnalytics: true,
    canUseAdvancedAnalytics: false,
  },
  agency: {
    maxPresentations: Infinity,
    maxStorageBytes: 200 * 1024 * 1024 * 1024, // 200 GB
    maxCollaborators: Infinity,
    hasWatermark: false,
    canExportPdf: true,
    canExportPptx: true,
    canCollaborate: true,
    canUseCustomDomain: true,
    canUseBrandKit: true,
    canUseCustomFonts: true,
    canUseMultiWorkspace: true,
    canWhiteLabel: true,
    canUseAllTemplates: true,
    canUseAnalytics: true,
    canUseAdvancedAnalytics: true,
  },
};

export function getPlanLimits(plan: string): PlanLimits {
  return LIMITS[(plan as Plan)] ?? LIMITS.free;
}

export const PLAN_PRICES = {
  creator: { monthly: 19, annual: 15 },
  studio: { monthly: 49, annual: 39 },
  agency: { monthly: 149, annual: 119 },
} as const;

export function requiredPlanFor(feature: keyof PlanLimits): Plan {
  if (LIMITS.creator[feature]) return "creator";
  if (LIMITS.studio[feature]) return "studio";
  return "agency";
}
