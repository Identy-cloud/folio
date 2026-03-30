import { db } from "@/db";
import { fonts, presentations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const presentationId = searchParams.get("id");

  if (!presentationId) {
    return Response.json({ error: "Presentation id is required" }, { status: 400 });
  }

  const [pres] = await db
    .select({ userId: presentations.userId, isPublic: presentations.isPublic })
    .from(presentations)
    .where(eq(presentations.id, presentationId))
    .limit(1);

  if (!pres || !pres.isPublic) {
    return Response.json({ fonts: [] });
  }

  const rows = await db
    .select({
      id: fonts.id,
      name: fonts.name,
      family: fonts.family,
      url: fonts.url,
      format: fonts.format,
    })
    .from(fonts)
    .where(eq(fonts.userId, pres.userId));

  return Response.json({ fonts: rows });
}
