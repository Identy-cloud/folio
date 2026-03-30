import { getAuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).max(100).default(1),
  per_page: z.coerce.number().int().min(1).max(30).default(20),
});

interface UnsplashPhoto {
  id: string;
  urls: { small: string; regular: string; full: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
  width: number;
  height: number;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit(`unsplash:${user.id}`, 30, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);

  const { searchParams } = new URL(request.url);
  const parsed = searchSchema.safeParse({
    q: searchParams.get("q"),
    page: searchParams.get("page"),
    per_page: searchParams.get("per_page"),
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return Response.json(
      { error: "Unsplash not configured" },
      { status: 503 },
    );
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", parsed.data.q);
  url.searchParams.set("page", String(parsed.data.page));
  url.searchParams.set("per_page", String(parsed.data.per_page));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return Response.json(
      { error: "Unsplash API error" },
      { status: res.status },
    );
  }

  const data: UnsplashSearchResponse = await res.json();

  const photos = data.results.map((p) => ({
    id: p.id,
    urls: { small: p.urls.small, regular: p.urls.regular, full: p.urls.full },
    alt_description: p.alt_description,
    user: { name: p.user.name, links: { html: p.user.links.html } },
    width: p.width,
    height: p.height,
  }));

  return Response.json({ results: photos, total: data.total, total_pages: data.total_pages });
}
