import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests within limit", async () => {
    const key = `test-${Date.now()}`;
    const result = await checkRateLimit(key, 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests over limit", async () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      await checkRateLimit(key, 3, 60_000);
    }
    const result = await checkRateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("returns retryAfter when blocked", async () => {
    const key = `test-retry-${Date.now()}`;
    for (let i = 0; i < 2; i++) {
      await checkRateLimit(key, 2, 60_000);
    }
    const result = await checkRateLimit(key, 2, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("uses different limits per key", async () => {
    const key1 = `test-a-${Date.now()}`;
    const key2 = `test-b-${Date.now()}`;
    for (let i = 0; i < 2; i++) {
      await checkRateLimit(key1, 2, 60_000);
    }
    expect((await checkRateLimit(key1, 2, 60_000)).allowed).toBe(false);
    expect((await checkRateLimit(key2, 2, 60_000)).allowed).toBe(true);
  });
});
