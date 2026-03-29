import { describe, it, expect } from "vitest";
import { getPlanLimits } from "@/lib/plan-limits";

describe("getPlanLimits", () => {
  it("returns free limits by default", () => {
    const limits = getPlanLimits("free");
    expect(limits.maxPresentations).toBe(5);
    expect(limits.maxStorageBytes).toBe(100 * 1024 * 1024);
    expect(limits.canExportPdf).toBe(false);
    expect(limits.canCustomThemes).toBe(false);
  });

  it("returns pro limits", () => {
    const limits = getPlanLimits("pro");
    expect(limits.maxPresentations).toBe(Infinity);
    expect(limits.maxStorageBytes).toBe(10 * 1024 * 1024 * 1024);
    expect(limits.canExportPdf).toBe(true);
    expect(limits.canCustomThemes).toBe(true);
  });

  it("returns team limits", () => {
    const limits = getPlanLimits("team");
    expect(limits.maxPresentations).toBe(Infinity);
    expect(limits.canExportPdf).toBe(true);
  });

  it("falls back to free for unknown plan", () => {
    const limits = getPlanLimits("unknown");
    expect(limits.maxPresentations).toBe(5);
  });
});
