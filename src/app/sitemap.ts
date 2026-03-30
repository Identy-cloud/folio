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

  const staticPages: MetadataRoute.Sitemap = [
    { url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${url}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${url}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${url}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${url}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${url}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${url}/accessibility`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${url}/dmca`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  const presentationPages: MetadataRoute.Sitemap = publicPresentations.map((p) => ({
    url: `${url}/p/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...presentationPages];
}
