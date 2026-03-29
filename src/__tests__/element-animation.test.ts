import { describe, it, expect } from "vitest";
import { getElementAnimationStyle } from "@/lib/element-animation";

describe("getElementAnimationStyle", () => {
  it("returns empty object for 'none'", () => {
    expect(getElementAnimationStyle("none", 0)).toEqual({});
  });

  it("returns animation for 'fade-up'", () => {
    const style = getElementAnimationStyle("fade-up", 0);
    expect(style.opacity).toBe(0);
    expect(style.animation).toContain("el-fade-up");
  });

  it("defaults to 'fade-up' when undefined", () => {
    const style = getElementAnimationStyle(undefined, 0);
    expect(style.animation).toContain("el-fade-up");
  });

  it("includes delay in animation string", () => {
    const style = getElementAnimationStyle("fade-left", 200);
    expect(style.animation).toContain("200ms");
  });

  it("handles all animation types", () => {
    const types = ["fade-up", "fade-down", "fade-left", "fade-right", "zoom-in"] as const;
    for (const type of types) {
      const style = getElementAnimationStyle(type, 0);
      expect(style.opacity).toBe(0);
      expect(style.animation).toBeTruthy();
    }
  });
});
