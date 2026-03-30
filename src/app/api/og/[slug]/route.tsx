import { ImageResponse } from "@vercel/og";
import { db } from "@/db";
import { presentations, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { THEMES } from "@/lib/templates/themes";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [pres] = await db
    .select()
    .from(presentations)
    .where(eq(presentations.slug, slug))
    .limit(1);

  if (!pres || !pres.isPublic) {
    return new Response("Not found", { status: 404 });
  }

  const [author] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, pres.userId))
    .limit(1);

  const customMap = (pres.customThemes ?? {}) as Record<string, import("@/lib/templates/themes").Theme>;
  const theme = customMap[pres.theme] ?? THEMES[pres.theme] ?? THEMES["editorial-blue"];
  const authorName = author?.name ?? author?.email ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: theme.background,
          color: theme.text,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.2em",
              opacity: 0.4,
              textTransform: "uppercase" as const,
            }}
          >
            FOLIO — EDITORIAL SLIDES
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: theme.accent,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.0,
              maxWidth: 900,
            }}
          >
            {pres.title}
          </div>
          <div
            style={{
              width: 60,
              height: 3,
              backgroundColor: theme.accent,
            }}
          />
          {authorName && (
            <div style={{ fontSize: 18, opacity: 0.5 }}>{authorName}</div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
