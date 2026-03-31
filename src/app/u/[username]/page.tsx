import { db } from "@/db";
import { users, presentations, presentationViews } from "@/db/schema";
import { eq, and, count, inArray, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortfolioClient } from "./portfolio-client";
import { SocialIcons } from "./social-icons";

interface Props {
  params: Promise<{ username: string }>;
}

async function getPortfolioData(username: string) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
      socialLinks: users.socialLinks,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) return null;

  const publicPresentations = await db
    .select({
      id: presentations.id,
      title: presentations.title,
      slug: presentations.slug,
      thumbnailUrl: presentations.thumbnailUrl,
      forkCount: presentations.forkCount,
      createdAt: presentations.createdAt,
    })
    .from(presentations)
    .where(
      and(
        eq(presentations.userId, user.id),
        eq(presentations.isPublic, true),
      ),
    )
    .orderBy(desc(presentations.updatedAt));

  const presIds = publicPresentations.map((p) => p.id);
  const viewCounts = presIds.length > 0
    ? await db
        .select({
          presentationId: presentationViews.presentationId,
          views: count(),
        })
        .from(presentationViews)
        .where(inArray(presentationViews.presentationId, presIds))
        .groupBy(presentationViews.presentationId)
    : [];

  const viewMap = new Map(viewCounts.map((v) => [v.presentationId, v.views]));

  const items = publicPresentations.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    thumbnailUrl: p.thumbnailUrl,
    forkCount: p.forkCount,
    viewCount: viewMap.get(p.id) ?? 0,
  }));

  return { user, presentations: items };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getPortfolioData(username);
  if (!data) return { title: "User not found" };

  const displayName = data.user.name ?? data.user.username ?? username;
  return {
    title: `${displayName} — Portfolio`,
    description: data.user.bio ?? `Public presentations by ${displayName}`,
    openGraph: {
      title: `${displayName} — Portfolio`,
      description: data.user.bio ?? `Public presentations by ${displayName}`,
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const data = await getPortfolioData(username);
  if (!data) notFound();

  return (
    <div className="min-h-screen bg-navy text-silver">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <header className="mb-8 flex flex-col items-center gap-4 text-center sm:mb-12">
          {data.user.avatarUrl ? (
            <img
              src={data.user.avatarUrl}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-xl font-medium text-silver/70">
              {(data.user.name ?? data.user.username ?? "U")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl tracking-tight sm:text-3xl lg:text-4xl">
              {data.user.name ?? data.user.username}
            </h1>
            {data.user.bio && (
              <p className="mx-auto mt-2 max-w-md text-sm text-silver/70 sm:text-base">
                {data.user.bio}
              </p>
            )}
          </div>
          <SocialIcons links={data.user.socialLinks ?? {}} />
          <p className="text-xs tracking-[0.2em] text-silver/40 uppercase">
            {data.presentations.length} presentation{data.presentations.length !== 1 ? "s" : ""}
          </p>
        </header>

        <PortfolioClient presentations={data.presentations} />
      </div>
    </div>
  );
}
