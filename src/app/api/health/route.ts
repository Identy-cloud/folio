import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT 1 as ok`);
    return Response.json({ status: "ok", db: "connected" });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ status: "error", error: message }, { status: 500 });
  }
}
