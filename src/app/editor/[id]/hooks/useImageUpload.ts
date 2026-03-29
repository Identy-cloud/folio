import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";
import type { ImageElement } from "@/types/elements";
import { useTranslation } from "@/lib/i18n/context";

export function useImageUpload() {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const addElement = useEditorStore((s) => s.addElement);

  useEffect(() => {
    return () => {
      if (inputRef.current?.parentNode) {
        inputRef.current.parentNode.removeChild(inputRef.current);
        inputRef.current = null;
      }
    };
  }, []);

  function trigger() {
    if (!inputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg,image/png,image/webp,image/gif";
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
        toast.error(t.editor.uploadError);
        return;
      }

      const { signedUrl, publicUrl } = await res.json();

      const putRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!putRes.ok) {
        toast.error(t.editor.uploadFileError);
        return;
      }

      const currentSlide = useEditorStore.getState().getActiveSlide();
      const el: ImageElement = {
        id: nanoid(),
        type: "image",
        x: 560, y: 240, w: 800, h: 600,
        rotation: 0, opacity: 1,
        zIndex: (currentSlide?.elements.length ?? 0) + 1,
        locked: false,
        src: publicUrl,
        objectFit: "cover",
        filter: "",
        isPlaceholder: false,
      };

      addElement(el);
      toast.success(t.editor.imageInserted);
    } catch {
      toast.error(t.common.connectionError);
    } finally {
      setUploading(false);
    }
  }

  return { trigger, uploading };
}
