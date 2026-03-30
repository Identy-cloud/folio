import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!dbUser) {
    const [newUser] = await db
      .insert(users)
      .values({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name ?? null,
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email!,
          name: user.user_metadata?.full_name ?? null,
          avatarUrl: user.user_metadata?.avatar_url ?? null,
        },
      })
      .returning();

    await db
      .insert(subscriptions)
      .values({ userId: user.id, plan: "free", status: "active" })
      .onConflictDoNothing();

    sendWelcomeEmail(
      newUser.email,
      newUser.name ?? newUser.email.split("@")[0],
    ).catch(() => {});

    return newUser;
  }

  return dbUser;
}
