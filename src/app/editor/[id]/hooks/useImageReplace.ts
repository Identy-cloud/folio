import { useState, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/context";

export function useImageReplace(elementId: string) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const setElementBusy = useEditorStore((s) => s.setElementBusy);
  const clearElementBusy = useEditorStore((s) => s.clearElementBusy);

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
    setElementBusy(elementId);
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

      updateElement(elementId, { src: publicUrl, isPlaceholder: false });
      pushHistory();
      toast.success(t.editor.imageReplaced);
    } catch {
      toast.error(t.common.connectionError);
    } finally {
      setUploading(false);
      clearElementBusy(elementId);
    }
  }

  return { trigger, uploading };
}
