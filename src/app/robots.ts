import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/p/", "/pricing", "/login", "/terms", "/privacy", "/cookies", "/accessibility", "/dmca"],
        disallow: ["/dashboard", "/editor/", "/api/", "/auth/", "/reset-password"],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
