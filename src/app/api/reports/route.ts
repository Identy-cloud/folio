import { db } from "@/db";
import { reports, presentations } from "@/db/schema";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { NextRequest } from "next/server";

const reportSchema = z.object({
  presentationId: z.string().uuid(),
  reporterEmail: z.string().email().max(255).optional(),
  reason: z.enum(["copyright", "inappropriate", "spam", "other"]),
  description: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(`reports:${ip}`, 3, 3_600_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const raw = await request.json().catch(() => ({}));
  const parsed = reportSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { presentationId, reporterEmail, reason, description } = parsed.data;

  const [pres] = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(eq(presentations.id, presentationId))
    .limit(1);

  if (!pres) {
    return Response.json({ error: "Presentation not found" }, { status: 404 });
  }

  const [report] = await db
    .insert(reports)
    .values({
      presentationId,
      reporterEmail: reporterEmail ?? null,
      reason,
      description,
    })
    .returning();

  return Response.json(report, { status: 201 });
}
