import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATABASE_URL = process.env.DATABASE_URL!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error("Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

const TEST_PASSWORD = "Test1234!";

const USERS = [
  { email: "free@test.folio.app", name: "Ana García (Free)", plan: "free", username: "ana-free" },
  { email: "creator@test.folio.app", name: "Carlos López (Creator)", plan: "creator", username: "carlos-creator" },
  { email: "studio@test.folio.app", name: "María Rodríguez (Studio)", plan: "studio", username: "maria-studio" },
  { email: "agency@test.folio.app", name: "David Martín (Agency)", plan: "agency", username: "david-agency" },
];

async function seedAuth() {
  console.log("Creating users in Supabase Auth + syncing DB IDs...\n");

  for (const u of USERS) {
    // Delete existing auth user if any
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find((x) => x.email === u.email);
    if (found) {
      await supabase.auth.admin.deleteUser(found.id);
      console.log(`  🗑 Deleted existing auth user: ${u.email}`);
    }

    // Create in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { name: u.name },
    });

    if (error) {
      console.error(`  ✗ Failed to create ${u.email}:`, error.message);
      continue;
    }

    const authId = data.user.id;
    console.log(`  ✓ Auth created: ${u.email} (${authId})`);

    // Check if DB user exists with this email
    const [dbUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, u.email))
      .limit(1);

    if (dbUser) {
      // Update the DB user ID to match Supabase Auth ID
      if (dbUser.id !== authId) {
        // Need to delete and re-create since ID is primary key
        await db.delete(schema.users).where(eq(schema.users.id, dbUser.id));
        await db.insert(schema.users).values({
          id: authId,
          email: u.email,
          name: u.name,
          username: u.username,
          plan: u.plan,
          storageUsed: 0,
        });
        console.log(`  ✓ DB user re-created with matching auth ID`);
      }
    } else {
      // Create DB user
      await db.insert(schema.users).values({
        id: authId,
        email: u.email,
        name: u.name,
        username: u.username,
        plan: u.plan,
        storageUsed: 0,
      });
      console.log(`  ✓ DB user created`);
    }

    // Create subscription for paid plans
    if (u.plan !== "free") {
      await db.delete(schema.subscriptions).where(eq(schema.subscriptions.userId, authId)).catch(() => {});
      await db.insert(schema.subscriptions).values({
        userId: authId,
        stripeCustomerId: `cus_test_${u.plan}`,
        stripeSubscriptionId: `sub_test_${u.plan}`,
        plan: u.plan,
        billingPeriod: "monthly",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      console.log(`  ✓ Subscription: ${u.plan} (active)`);
    }

    console.log();
  }

  console.log("✅ All users ready!\n");
  console.log("┌─────────────────────────────────┬──────────┬──────────────┐");
  console.log("│ Email                           │ Plan     │ Password     │");
  console.log("├─────────────────────────────────┼──────────┼──────────────┤");
  for (const u of USERS) {
    console.log(`│ ${u.email.padEnd(31)} │ ${u.plan.padEnd(8)} │ ${TEST_PASSWORD.padEnd(12)} │`);
  }
  console.log("└─────────────────────────────────┴──────────┴──────────────┘");

  await client.end();
}

seedAuth().catch((err) => {
  console.error("Seed auth failed:", err);
  process.exit(1);
});
