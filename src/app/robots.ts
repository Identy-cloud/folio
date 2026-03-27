import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/p/"],
        disallow: ["/dashboard", "/editor/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
