import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";
import type { ImageElement } from "@/types/elements";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addElement = useEditorStore((s) => s.addElement);
  const activeSlide = useEditorStore((s) => s.getActiveSlide());

  function trigger() {
    if (!inputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
      input.style.display = "none";
      input.addEventListener("change", handleFile);
      document.body.appendChild(input);
      inputRef.current = input;
    }
    inputRef.current.value = "";
    inputRef.current.click();
  }

  async function handleFile() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, filename: file.name }),
      });

      if (!res.ok) {
        toast.error("Error al subir imagen");
        return;
      }

      const { signedUrl, publicUrl } = await res.json();

      await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const el: ImageElement = {
        id: nanoid(),
        type: "image",
        x: 560, y: 240, w: 800, h: 600,
        rotation: 0, opacity: 1,
        zIndex: (activeSlide?.elements.length ?? 0) + 1,
        locked: false,
        src: publicUrl,
        objectFit: "cover",
        filter: "",
      };

      addElement(el);
      toast.success("Imagen insertada");
    } catch {
      toast.error("Error de conexión");
    } finally {
      setUploading(false);
    }
  }

  return { trigger, uploading };
}
