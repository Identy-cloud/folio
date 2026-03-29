import { db } from "@/db";
import { presentations } from "@/db/schema";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

const bodySchema = z.object({
  password: z.string().min(1).max(255),
});

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf-8");
  const bBuf = Buffer.from(b, "utf-8");

  if (aBuf.length !== bBuf.length) {
    const padded = Buffer.alloc(aBuf.length);
    bBuf.copy(padded);
    timingSafeEqual(aBuf, padded);
    return false;
  }

  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { id } = await params;

  const rl = checkRateLimit(`verify-pw:${ip}:${id}`, 10, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [pres] = await db
    .select({ password: presentations.password })
    .from(presentations)
    .where(eq(presentations.id, id))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (!pres.password) {
    return Response.json({ valid: true });
  }

  const valid = safeCompare(pres.password, parsed.data.password);

  return Response.json({ valid });
}
