import { db } from "@/db";
import { users, presentations } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== "string" || !body.password.trim()) {
    return Response.json(
      { error: "Password is required" },
      { status: 400 },
    );
  }

  const supabaseAuth = await createClient();
  const { error: signInError } = await supabaseAuth.auth.signInWithPassword({
    email: user.email,
    password: body.password,
  });

  if (signInError) {
    return Response.json(
      { error: "Invalid password" },
      { status: 403 },
    );
  }

  await db.delete(presentations).where(eq(presentations.userId, user.id));

  // Delete user from DB
  await db.delete(users).where(eq(users.id, user.id));

  // Delete auth user from Supabase using admin API
  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  await adminClient.auth.admin.deleteUser(user.id);

  await supabaseAuth.auth.signOut();

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
