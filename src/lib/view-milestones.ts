import { db } from "@/db";
import { presentationViews, presentations, users } from "@/db/schema";
import { sendViewMilestone } from "@/lib/email";
import { eq, count } from "drizzle-orm";

const VIEW_MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000] as const;

export async function checkViewMilestone(presentationId: string) {
  const [result] = await db
    .select({ totalViews: count() })
    .from(presentationViews)
    .where(eq(presentationViews.presentationId, presentationId));

  const total = result.totalViews;
  const milestone = VIEW_MILESTONES.find((m) => total === m);
  if (!milestone) return;

  const [pres] = await db
    .select({
      title: presentations.title,
      slug: presentations.slug,
      userId: presentations.userId,
    })
    .from(presentations)
    .where(eq(presentations.id, presentationId))
    .limit(1);
  if (!pres) return;

  const [owner] = await db
    .select({ email: users.email, name: users.name, emailDigest: users.emailDigest })
    .from(users)
    .where(eq(users.id, pres.userId))
    .limit(1);
  if (!owner?.email || !owner.emailDigest) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://folio.identy.cloud";
  await sendViewMilestone(
    owner.email,
    owner.name ?? "",
    pres.title ?? "Untitled",
    milestone,
    `${appUrl}/p/${pres.slug}`
  );
}
