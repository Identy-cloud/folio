import { db } from "@/db";
import { presentations } from "@/db/schema";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { compare } from "bcryptjs";
import type { NextRequest } from "next/server";

const bodySchema = z.object({
  password: z.string().min(1).max(255),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { id } = await params;

  const rl = await checkRateLimit(`verify-pw:${ip}:${id}`, 10, 60_000);
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

  const valid = await compare(parsed.data.password, pres.password);

  return Response.json({ valid });
}
