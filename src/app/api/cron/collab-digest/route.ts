import { db } from "@/db";
import { collaborators, presentations, users } from "@/db/schema";
import { sendCollabDigest } from "@/lib/email";
import { eq, gte, and, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import type { CollabDigestEntry } from "@/lib/email-templates-digest";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const recentlyEdited = await db
    .select({
      presId: presentations.id,
      presTitle: presentations.title,
      ownerId: presentations.userId,
      updatedAt: presentations.updatedAt,
    })
    .from(presentations)
    .where(gte(presentations.updatedAt, yesterday));

  const ownerMap = new Map<string, CollabDigestEntry[]>();

  for (const pres of recentlyEdited) {
    const collabs = await db
      .select({
        userId: collaborators.userId,
        userName: users.name,
      })
      .from(collaborators)
      .innerJoin(users, eq(users.id, collaborators.userId))
      .where(
        and(
          eq(collaborators.presentationId, pres.presId),
          ne(collaborators.userId, pres.ownerId)
        )
      );

    if (collabs.length === 0) continue;

    const existing = ownerMap.get(pres.ownerId) ?? [];
    for (const c of collabs) {
      existing.push({
        editorName: c.userName ?? "A collaborator",
        presentationTitle: pres.presTitle ?? "Untitled",
        presentationId: pres.presId,
      });
    }
    ownerMap.set(pres.ownerId, existing);
  }

  let sent = 0;

  for (const [ownerId, entries] of ownerMap) {
    const [owner] = await db
      .select({ email: users.email, name: users.name, emailDigest: users.emailDigest })
      .from(users)
      .where(eq(users.id, ownerId))
      .limit(1);

    if (!owner?.email || !owner.emailDigest) continue;

    await sendCollabDigest(owner.email, owner.name ?? "", entries).catch(() => {});
    sent++;
  }

  return Response.json({ ok: true, sent });
}
