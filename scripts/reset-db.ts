import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  comments,
  presentationViews,
  slides,
  collaborators,
  subscriptions,
  presentations,
  users,
} from "../src/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function resetDatabase() {
  console.log("Resetting database...\n");

  const tables = [
    { name: "comments", table: comments },
    { name: "presentationViews", table: presentationViews },
    { name: "slides", table: slides },
    { name: "collaborators", table: collaborators },
    { name: "subscriptions", table: subscriptions },
    { name: "presentations", table: presentations },
    { name: "users", table: users },
  ];

  for (const { name, table } of tables) {
    const deleted = await db.delete(table).returning({ id: table.id });
    console.log(`  ${name}: ${deleted.length} rows deleted`);
  }

  console.log("\nDatabase reset complete.");
  await client.end();
  process.exit(0);
}

resetDatabase().catch(async (err) => {
  console.error("Failed to reset database:", err);
  await client.end();
  process.exit(1);
});
