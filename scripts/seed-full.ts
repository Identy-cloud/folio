import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATABASE_URL = process.env.DATABASE_URL!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

const TEST_PASSWORD = "Test1234!";
const THEMES = ["editorial-blue", "monochrome", "dark-editorial", "warm-magazine", "swiss-minimal"];

const USERS = [
  { email: "free@test.folio.app", name: "Ana García (Free)", plan: "free", username: "ana-free", bio: "Testing free plan", presCount: 2 },
  { email: "creator@test.folio.app", name: "Carlos López (Creator)", plan: "creator", username: "carlos-creator", bio: "Testing creator plan", presCount: 5 },
  { email: "studio@test.folio.app", name: "María Rodríguez (Studio)", plan: "studio", username: "maria-studio", bio: "Testing studio plan", presCount: 4 },
  { email: "agency@test.folio.app", name: "David Martín (Agency)", plan: "agency", username: "david-agency", bio: "Testing agency plan", presCount: 6 },
];

function sampleElements() {
  return [
    { id: randomUUID(), type: "text", x: 120, y: 200, w: 1680, h: 200, rotation: 0, opacity: 1, zIndex: 1, locked: false, visible: true, content: "<h1>Sample Presentation</h1>", fontFamily: "Bebas Neue", fontSize: 96, fontWeight: 700, fontStyle: "normal", textDecoration: "none", textAlign: "center", verticalAlign: "middle", lineHeight: 1.1, letterSpacing: 0, color: "#ffffff" },
    { id: randomUUID(), type: "text", x: 120, y: 440, w: 1680, h: 100, rotation: 0, opacity: 0.7, zIndex: 2, locked: false, visible: true, content: "Subtitle text for testing", fontFamily: "DM Sans", fontSize: 32, fontWeight: 400, fontStyle: "normal", textDecoration: "none", textAlign: "center", verticalAlign: "middle", lineHeight: 1.4, letterSpacing: 0, color: "#cccccc" },
    { id: randomUUID(), type: "shape", x: 860, y: 600, w: 200, h: 200, rotation: 0, opacity: 0.5, zIndex: 0, locked: false, visible: true, shapeType: "circle", backgroundColor: "#3b82f6", borderColor: "transparent", borderWidth: 0 },
  ];
}

async function seed() {
  // Step 1: Clean everything
  console.log("🧹 Cleaning database...");
  await db.execute(sql`TRUNCATE TABLE users CASCADE`);
  console.log("   Done.\n");

  // Step 2: Create auth users + DB users
  console.log("👤 Creating users...");
  const userIds: string[] = [];

  for (const u of USERS) {
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find((x) => x.email === u.email);
    if (found) await supabase.auth.admin.deleteUser(found.id);

    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email, password: TEST_PASSWORD, email_confirm: true,
      user_metadata: { name: u.name },
    });
    if (error) { console.error(`   ✗ ${u.email}: ${error.message}`); continue; }

    const id = data.user.id;
    userIds.push(id);

    await db.insert(schema.users).values({ id, email: u.email, name: u.name, username: u.username, bio: u.bio, plan: u.plan, storageUsed: 0 });

    if (u.plan !== "free") {
      await db.insert(schema.subscriptions).values({
        userId: id, stripeCustomerId: `cus_test_${u.plan}`, stripeSubscriptionId: `sub_test_${u.plan}`,
        plan: u.plan, billingPeriod: "monthly", status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }
    console.log(`   ✓ ${u.name} → ${u.plan} (${id.slice(0, 8)})`);
  }

  // Step 3: Create presentations
  console.log("\n📊 Creating presentations...");
  for (let ui = 0; ui < USERS.length; ui++) {
    const u = USERS[ui];
    const userId = userIds[ui];
    if (!userId) continue;

    for (let pi = 0; pi < u.presCount; pi++) {
      const presId = randomUUID();
      const isPublic = pi === 0;
      await db.insert(schema.presentations).values({
        id: presId, userId, title: `${u.name.split(" ")[0]} — Presentation ${pi + 1}`,
        slug: `test-${randomUUID().slice(0, 8)}`, theme: THEMES[pi % THEMES.length], isPublic,
      });

      const slideCount = 3 + (pi % 3);
      for (let si = 0; si < slideCount; si++) {
        await db.insert(schema.slides).values({
          presentationId: presId, order: si,
          backgroundColor: si === 0 ? "#161616" : "#ffffff",
          transition: si === 0 ? "fade" : "slide-left",
          elements: sampleElements(),
          notes: si === 0 ? `Speaker notes for slide ${si + 1}` : "",
        });
      }

      if (isPublic) {
        for (let vi = 0; vi < 15 + pi * 5; vi++) {
          await db.insert(schema.presentationViews).values({
            presentationId: presId, slideIndex: vi % slideCount,
            duration: 5000 + Math.floor(Math.random() * 20000),
            viewerIp: `hash_${vi}`, userAgent: "Mozilla/5.0 Test",
          });
        }
      }
      console.log(`   ✓ ${u.name.split(" ")[0]} — Pres ${pi + 1} (${slideCount} slides, ${isPublic ? "🌐 public" : "🔒 private"})`);
    }
  }

  // Step 4: Collaborator
  if (userIds[2] && userIds[3]) {
    const [pres] = await db.select({ id: schema.presentations.id }).from(schema.presentations)
      .where(sql`${schema.presentations.userId} = ${userIds[2]}`).limit(1);
    if (pres) {
      await db.insert(schema.collaborators).values({ presentationId: pres.id, userId: userIds[3], role: "editor" });
      console.log(`\n🤝 David added as collaborator to María's presentation`);
    }
  }

  // Step 5: Comments
  const [pub] = await db.select({ id: schema.presentations.id }).from(schema.presentations)
    .where(sql`${schema.presentations.isPublic} = true`).limit(1);
  if (pub) {
    const cid = randomUUID();
    await db.insert(schema.comments).values({ id: cid, presentationId: pub.id, slideIndex: 0, authorName: "Test Viewer", authorEmail: "viewer@test.com", content: "Great presentation! Love the design." });
    await db.insert(schema.comments).values({ presentationId: pub.id, slideIndex: 0, authorName: "Another Viewer", content: "Thanks for sharing!", parentId: cid });
    console.log(`💬 2 comments added`);
  }

  console.log("\n✅ Seed complete!\n");
  console.log("┌─────────────────────────────────┬──────────┬──────────────┐");
  console.log("│ Email                           │ Plan     │ Password     │");
  console.log("├─────────────────────────────────┼──────────┼──────────────┤");
  for (const u of USERS) {
    console.log(`│ ${u.email.padEnd(31)} │ ${u.plan.padEnd(8)} │ ${TEST_PASSWORD.padEnd(12)} │`);
  }
  console.log("└─────────────────────────────────┴──────────┴──────────────┘");

  await client.end();
}

seed().catch((e) => { console.error(e); process.exit(1); });
