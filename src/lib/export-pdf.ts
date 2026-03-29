import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

interface ExportOptions {
  title: string;
  slideCount: number;
  getSlideElement: (index: number) => HTMLElement | null;
  onProgress: (current: number, total: number) => void;
  delayMs?: number;
}

export async function exportToPdf({
  title,
  slideCount,
  getSlideElement,
  onProgress,
  delayMs = 0,
}: ExportOptions): Promise<void> {
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1920, 1080] });

  for (let i = 0; i < slideCount; i++) {
    onProgress(i + 1, slideCount);

    const el = getSlideElement(i);
    if (!el) continue;

    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }

    const dataUrl = await toPng(el, {
      width: 1920,
      height: 1080,
      pixelRatio: 1,
      cacheBust: true,
    });

    if (i > 0) pdf.addPage([1920, 1080], "landscape");
    pdf.addImage(dataUrl, "PNG", 0, 0, 1920, 1080);
  }

  const safeName = title.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "presentation";
  pdf.save(`${safeName}.pdf`);
}
