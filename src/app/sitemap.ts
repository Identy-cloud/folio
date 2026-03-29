import type { MetadataRoute } from "next";
import { db } from "@/db";
import { presentations } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const publicPresentations = await db
    .select({ slug: presentations.slug, updatedAt: presentations.updatedAt })
    .from(presentations)
    .where(eq(presentations.isPublic, true));

  return [
    { url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${url}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${url}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...publicPresentations.map((p) => ({
      url: `${url}/p/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
