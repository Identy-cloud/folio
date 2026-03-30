import { db } from "@/db";
import { presentations, users } from "@/db/schema";
import { sendScheduledPublishConfirmation } from "@/lib/email";
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
    .select({
      id: presentations.id,
      title: presentations.title,
      slug: presentations.slug,
      userId: presentations.userId,
    })
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

    notifyPublishOwner(row.userId, row.title ?? "Untitled", row.slug);
  }

  return Response.json({ ok: true, published });
}

function notifyPublishOwner(userId: string, title: string, slug: string) {
  db.select({ email: users.email, name: users.name, emailDigest: users.emailDigest })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .then(([owner]) => {
      if (owner?.email && owner.emailDigest) {
        sendScheduledPublishConfirmation(
          owner.email,
          owner.name ?? "",
          title,
          slug
        ).catch(() => {});
      }
    })
    .catch(() => {});
}
