import { toPng } from "html-to-image";

export async function captureSlideThumb(
  slideElement: HTMLElement
): Promise<Blob> {
  const dataUrl = await toPng(slideElement, {
    width: 1920,
    height: 1080,
    pixelRatio: 1200 / 1920,
    cacheBust: true,
  });

  const res = await fetch(dataUrl);
  return res.blob();
}

export async function uploadThumbnail(
  presentationId: string,
  blob: Blob
): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentType: "image/png",
      filename: `thumb-${presentationId}.png`,
    }),
  });

  if (!res.ok) return "";

  const { signedUrl, publicUrl } = await res.json();

  await fetch(signedUrl, {
    method: "PUT",
    body: blob,
    headers: { "Content-Type": "image/png" },
  });

  await fetch(`/api/presentations/${presentationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thumbnailUrl: publicUrl }),
  });

  return publicUrl;
}
