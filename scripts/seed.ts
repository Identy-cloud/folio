import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { randomUUID } from "crypto";
import * as schema from "../src/db/schema";
import { sql } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL!;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

const USERS = [
  {
    id: randomUUID(),
    email: "free@test.folio.app",
    name: "Ana García (Free)",
    username: "ana-free",
    bio: "Testing free plan",
    plan: "free",
  },
  {
    id: randomUUID(),
    email: "creator@test.folio.app",
    name: "Carlos López (Creator)",
    username: "carlos-creator",
    bio: "Testing creator plan",
    plan: "creator",
  },
  {
    id: randomUUID(),
    email: "studio@test.folio.app",
    name: "María Rodríguez (Studio)",
    username: "maria-studio",
    bio: "Testing studio plan",
    plan: "studio",
  },
  {
    id: randomUUID(),
    email: "agency@test.folio.app",
    name: "David Martín (Agency)",
    username: "david-agency",
    bio: "Testing agency plan",
    plan: "agency",
  },
];

function generateSlug() {
  return `test-${randomUUID().slice(0, 8)}`;
}

function sampleElements(theme: string) {
  return [
    {
      id: randomUUID(),
      type: "text",
      x: 120,
      y: 200,
      w: 1680,
      h: 200,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      visible: true,
      content: "<h1>Sample Presentation</h1>",
      fontFamily: "Bebas Neue",
      fontSize: 96,
      fontWeight: 700,
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "center",
      verticalAlign: "middle",
      lineHeight: 1.1,
      letterSpacing: 0,
      color: "#ffffff",
    },
    {
      id: randomUUID(),
      type: "text",
      x: 120,
      y: 440,
      w: 1680,
      h: 100,
      rotation: 0,
      opacity: 0.7,
      zIndex: 2,
      locked: false,
      visible: true,
      content: "Subtitle text for testing",
      fontFamily: "DM Sans",
      fontSize: 32,
      fontWeight: 400,
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "center",
      verticalAlign: "middle",
      lineHeight: 1.4,
      letterSpacing: 0,
      color: "#cccccc",
    },
    {
      id: randomUUID(),
      type: "shape",
      x: 860,
      y: 600,
      w: 200,
      h: 200,
      rotation: 0,
      opacity: 0.5,
      zIndex: 0,
      locked: false,
      visible: true,
      shapeType: "circle",
      backgroundColor: "#3b82f6",
      borderColor: "transparent",
      borderWidth: 0,
    },
  ];
}

const THEMES = ["editorial-blue", "monochrome", "dark-editorial", "warm-magazine", "swiss-minimal"];

async function seed() {
  console.log("Cleaning database...");

  await db.execute(sql`TRUNCATE TABLE comments CASCADE`);
  await db.execute(sql`TRUNCATE TABLE notifications CASCADE`);
  await db.execute(sql`TRUNCATE TABLE presentation_views CASCADE`);
  await db.execute(sql`TRUNCATE TABLE presentation_versions CASCADE`);
  await db.execute(sql`TRUNCATE TABLE questions CASCADE`);
  await db.execute(sql`TRUNCATE TABLE reports CASCADE`);
  await db.execute(sql`TRUNCATE TABLE saved_slides CASCADE`);
  await db.execute(sql`TRUNCATE TABLE fonts CASCADE`);
  await db.execute(sql`TRUNCATE TABLE collaborators CASCADE`);
  await db.execute(sql`TRUNCATE TABLE slides CASCADE`);
  await db.execute(sql`TRUNCATE TABLE presentations CASCADE`);
  await db.execute(sql`TRUNCATE TABLE workspace_members CASCADE`);
  await db.execute(sql`TRUNCATE TABLE workspaces CASCADE`);
  await db.execute(sql`TRUNCATE TABLE subscriptions CASCADE`);
  await db.execute(sql`TRUNCATE TABLE folders CASCADE`);
  await db.execute(sql`TRUNCATE TABLE users CASCADE`);

  console.log("Database cleaned.");

  console.log("Creating users...");
  for (const u of USERS) {
    await db.insert(schema.users).values({
      id: u.id,
      email: u.email,
      name: u.name,
      username: u.username,
      bio: u.bio,
      plan: u.plan,
      storageUsed: 0,
    });

    if (u.plan !== "free") {
      await db.insert(schema.subscriptions).values({
        userId: u.id,
        stripeCustomerId: `cus_test_${u.plan}`,
        stripeSubscriptionId: `sub_test_${u.plan}`,
        plan: u.plan,
        billingPeriod: "monthly",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    console.log(`  ✓ ${u.name} (${u.plan})`);
  }

  console.log("Creating presentations...");
  const presentationsPerUser = [2, 5, 4, 6];

  for (let ui = 0; ui < USERS.length; ui++) {
    const user = USERS[ui];
    const count = presentationsPerUser[ui];

    const folderId = ui >= 2 ? randomUUID() : null;
    if (folderId) {
      await db.insert(schema.folders).values({
        id: folderId,
        userId: user.id,
        name: `${user.name.split(" ")[0]}'s Folder`,
      });
    }

    for (let pi = 0; pi < count; pi++) {
      const presId = randomUUID();
      const theme = THEMES[pi % THEMES.length];
      const isPublic = pi === 0;
      const starred = pi < 2;

      await db.insert(schema.presentations).values({
        id: presId,
        userId: user.id,
        title: `${user.name.split(" ")[0]} — Presentation ${pi + 1}`,
        slug: generateSlug(),
        theme,
        isPublic,
        folderId: folderId && pi % 2 === 0 ? folderId : null,
      });

      const slideCount = 3 + (pi % 3);
      for (let si = 0; si < slideCount; si++) {
        await db.insert(schema.slides).values({
          presentationId: presId,
          order: si,
          backgroundColor: si === 0 ? "#161616" : "#ffffff",
          transition: si === 0 ? "fade" : "slide-left",
          elements: sampleElements(theme),
          notes: si === 0 ? `Speaker notes for slide ${si + 1}` : "",
        });
      }

      if (isPublic) {
        for (let vi = 0; vi < 10 + pi * 5; vi++) {
          await db.insert(schema.presentationViews).values({
            presentationId: presId,
            slideIndex: vi % slideCount,
            duration: 5000 + Math.floor(Math.random() * 20000),
            viewerIp: `hash_${vi}`,
            userAgent: "Mozilla/5.0 Test",
          });
        }
      }

      console.log(`  ✓ ${user.name.split(" ")[0]} — Pres ${pi + 1} (${slideCount} slides, ${isPublic ? "public" : "private"})`);
    }
  }

  console.log("Adding collaborators...");
  const studioUser = USERS[2];
  const agencyUser = USERS[3];
  const [studioPresentation] = await db
    .select({ id: schema.presentations.id })
    .from(schema.presentations)
    .where(sql`${schema.presentations.userId} = ${studioUser.id}`)
    .limit(1);

  if (studioPresentation) {
    await db.insert(schema.collaborators).values({
      presentationId: studioPresentation.id,
      userId: agencyUser.id,
      role: "editor",
    });
    console.log(`  ✓ ${agencyUser.name} added as collaborator to ${studioUser.name}'s presentation`);
  }

  console.log("Adding comments...");
  const [publicPres] = await db
    .select({ id: schema.presentations.id })
    .from(schema.presentations)
    .where(sql`${schema.presentations.isPublic} = true`)
    .limit(1);

  if (publicPres) {
    const commentId = randomUUID();
    await db.insert(schema.comments).values({
      id: commentId,
      presentationId: publicPres.id,
      slideIndex: 0,
      authorName: "Test Viewer",
      authorEmail: "viewer@test.com",
      content: "Great presentation! Love the design.",
    });
    await db.insert(schema.comments).values({
      presentationId: publicPres.id,
      slideIndex: 0,
      authorName: "Another Viewer",
      content: "Thanks for sharing this!",
      parentId: commentId,
    });
    console.log("  ✓ 2 comments (1 reply) added");
  }

  console.log("\n✅ Seed complete!\n");
  console.log("Test users:");
  console.log("┌─────────────────────────────────┬──────────┬─────────────────┐");
  console.log("│ Email                           │ Plan     │ Presentations   │");
  console.log("├─────────────────────────────────┼──────────┼─────────────────┤");
  for (let i = 0; i < USERS.length; i++) {
    const u = USERS[i];
    console.log(`│ ${u.email.padEnd(31)} │ ${u.plan.padEnd(8)} │ ${String(presentationsPerUser[i]).padEnd(15)} │`);
  }
  console.log("└─────────────────────────────────┴──────────┴─────────────────┘");
  console.log("\nNote: These are DB-only users. To login, create them in Supabase Auth");
  console.log("with the same emails, or use the app's signup flow.\n");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
