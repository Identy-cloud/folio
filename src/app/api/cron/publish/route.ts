import { db } from "@/db";
import { presentations } from "@/db/schema";
import { and, eq, lte, isNotNull } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const due = await db
    .select({ id: presentations.id })
    .from(presentations)
    .where(
      and(
        eq(presentations.isPublic, false),
        isNotNull(presentations.publishAt),
        lte(presentations.publishAt, now)
      )
    );

  let published = 0;

  for (const row of due) {
    await db
      .update(presentations)
      .set({
        isPublic: true,
        publishAt: null,
        updatedAt: now,
      })
      .where(eq(presentations.id, row.id));
    published++;
  }

  return Response.json({ ok: true, published });
}
