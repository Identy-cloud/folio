import sharp from "sharp";

interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
}

const MAX_DIMENSION = 2000;
const QUALITY = 85;

export async function processImage(
  buffer: Buffer,
  mimeType: string,
): Promise<ProcessedImage> {
  let pipeline = sharp(buffer);
  const metadata = await pipeline.metadata();

  const currentWidth = metadata.width ?? 0;
  const currentHeight = metadata.height ?? 0;

  if (currentWidth > MAX_DIMENSION || currentHeight > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  switch (mimeType) {
    case "image/jpeg":
      pipeline = pipeline.jpeg({ quality: QUALITY });
      break;
    case "image/png":
      pipeline = pipeline.png();
      break;
    case "image/webp":
      pipeline = pipeline.webp({ quality: QUALITY });
      break;
    case "image/gif":
      pipeline = pipeline.gif();
      break;
    default:
      pipeline = pipeline.jpeg({ quality: QUALITY });
  }

  const outputBuffer = await pipeline.toBuffer();
  const outputMeta = await sharp(outputBuffer).metadata();

  const formatMap: Record<string, string> = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  return {
    buffer: outputBuffer,
    width: outputMeta.width ?? 0,
    height: outputMeta.height ?? 0,
    format: formatMap[mimeType] ?? "jpeg",
  };
}
