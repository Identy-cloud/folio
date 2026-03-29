import { db } from "@/db";
import { users, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";

export async function DELETE() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete all presentations (slides + collaborators cascade via DB)
  await db.delete(presentations).where(eq(presentations.userId, user.id));

  // Delete user from DB
  await db.delete(users).where(eq(users.id, user.id));

  // Delete auth user from Supabase
  const supabase = await createClient();
  await supabase.auth.signOut();

  return Response.json({ ok: true });
}

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // GDPR data export
  const userPresentations = await db
    .select()
    .from(presentations)
    .where(eq(presentations.userId, user.id));

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    presentations: userPresentations.map((p) => ({
      id: p.id,
      title: p.title,
      theme: p.theme,
      isPublic: p.isPublic,
      createdAt: p.createdAt,
    })),
    exportedAt: new Date().toISOString(),
  });
}
