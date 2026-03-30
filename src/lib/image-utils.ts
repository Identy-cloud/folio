interface ImageResizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "contain" | "cover" | "crop";
}

export const IMAGE_PRESETS = {
  thumbnail: { width: 320 },
  preview: { width: 800 },
  full: { width: 1920 },
} as const satisfies Record<string, ImageResizeOptions>;

function isCdnUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith(".r2.dev") || parsed.hostname.endsWith(".cloudflarestorage.com");
  } catch {
    return false;
  }
}

export function getOptimizedImageUrl(
  originalUrl: string,
  options?: ImageResizeOptions,
): string {
  if (!options) return originalUrl;
  if (!isCdnUrl(originalUrl)) return originalUrl;

  const params: string[] = [];
  if (options.width) params.push(`width=${options.width}`);
  if (options.height) params.push(`height=${options.height}`);
  if (options.quality) params.push(`quality=${options.quality}`);
  if (options.fit) params.push(`fit=${options.fit}`);

  if (params.length === 0) return originalUrl;

  try {
    const url = new URL(originalUrl);
    return `${url.origin}/cdn-cgi/image/${params.join(",")}${url.pathname}`;
  } catch {
    return originalUrl;
  }
}
