import { describe, it, expect } from "vitest";
import { getPlanLimits } from "@/lib/plan-limits";

describe("getPlanLimits", () => {
  it("returns free limits", () => {
    const limits = getPlanLimits("free");
    expect(limits.maxPresentations).toBe(3);
    expect(limits.hasWatermark).toBe(true);
    expect(limits.canExportPdf).toBe(false);
    expect(limits.canCollaborate).toBe(false);
    expect(limits.canUseAllTemplates).toBe(false);
  });

  it("returns creator limits", () => {
    const limits = getPlanLimits("creator");
    expect(limits.maxPresentations).toBe(Infinity);
    expect(limits.hasWatermark).toBe(false);
    expect(limits.canExportPdf).toBe(true);
    expect(limits.canUseAllTemplates).toBe(true);
  });

  it("returns studio limits", () => {
    const limits = getPlanLimits("studio");
    expect(limits.canCollaborate).toBe(true);
    expect(limits.maxCollaborators).toBe(5);
    expect(limits.canExportPptx).toBe(true);
    expect(limits.canUseBrandKit).toBe(true);
  });

  it("returns agency limits", () => {
    const limits = getPlanLimits("agency");
    expect(limits.canWhiteLabel).toBe(true);
    expect(limits.canUseMultiWorkspace).toBe(true);
    expect(limits.maxCollaborators).toBe(Infinity);
  });

  it("falls back to free for unknown plan", () => {
    const limits = getPlanLimits("unknown");
    expect(limits.maxPresentations).toBe(3);
  });
});
