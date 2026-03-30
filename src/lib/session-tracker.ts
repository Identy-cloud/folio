import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  let browser = "Unknown";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";

  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Linux")) os = "Linux";

  let device = "Desktop";
  if (ua.includes("Mobile") || ua.includes("iPhone") || ua.includes("Android")) device = "Mobile";
  else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet";

  return { device, browser, os };
}

export async function trackSession(userId: string, headers: Headers): Promise<string> {
  const ua = headers.get("user-agent") ?? "";
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? headers.get("x-real-ip")
    ?? "unknown";
  const { device, browser, os } = parseUserAgent(ua);

  const token = nanoid(32);

  await db.insert(sessions).values({
    userId,
    token,
    device,
    browser,
    os,
    ip,
  });

  return token;
}

export async function touchSession(userId: string, token: string) {
  await db
    .update(sessions)
    .set({ lastActiveAt: new Date() })
    .where(and(eq(sessions.userId, userId), eq(sessions.token, token)));
}

export async function listSessions(userId: string) {
  return db
    .select({
      id: sessions.id,
      device: sessions.device,
      browser: sessions.browser,
      os: sessions.os,
      ip: sessions.ip,
      lastActiveAt: sessions.lastActiveAt,
      createdAt: sessions.createdAt,
    })
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(sessions.lastActiveAt);
}

export async function revokeSession(userId: string, sessionId: string) {
  await db
    .delete(sessions)
    .where(and(eq(sessions.userId, userId), eq(sessions.id, sessionId)));
}

export async function revokeAllSessions(userId: string, exceptToken?: string) {
  if (exceptToken) {
    const all = await db
      .select({ id: sessions.id, token: sessions.token })
      .from(sessions)
      .where(eq(sessions.userId, userId));
    const toDelete = all.filter((s) => s.token !== exceptToken);
    for (const s of toDelete) {
      await db.delete(sessions).where(eq(sessions.id, s.id));
    }
    return toDelete.length;
  }
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
