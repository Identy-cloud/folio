"use client";

import { useState, useEffect, useCallback } from "react";
import { Microphone, Stop, Pause, Play, Trash, FloppyDisk, Circle } from "@phosphor-icons/react";
import { useRecording } from "@/hooks/useRecording";
import { useEditorStore } from "@/store/editorStore";
import { Tooltip } from "@/components/ui/Tooltip";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { requiredPlanFor } from "@/lib/plan-limits";
import { UpgradeModal } from "@/components/UpgradeModal";

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function RecordingControls() {
  const presentationId = useEditorStore((s) => s.presentationId);
  const getSlideIndex = useCallback(() => useEditorStore.getState().activeSlideIndex, []);
  const {
    isRecording, isPaused, recordingData, duration, error,
    startRecording, stopRecording, pauseRecording, resumeRecording, discardRecording,
  } = useRecording(getSlideIndex);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { limits } = usePlanLimits();
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!presentationId) return;
    fetch(`/api/presentations/${presentationId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.recordingUrl) setSaved(true); })
      .catch(() => {});
  }, [presentationId]);

  useEffect(() => {
    if (recordingData) {
      const url = URL.createObjectURL(recordingData.blob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [recordingData]);

  async function handleSave() {
    if (!recordingData || !presentationId) return;
    setSaving(true);
    try {
      const form = new FormData();
      form.append("audio", recordingData.blob, "recording.webm");
      form.append("timeline", JSON.stringify(recordingData.timeline));
      form.append("duration", String(recordingData.duration));
      const res = await fetch(`/api/presentations/${presentationId}/recording`, {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        setSaved(true);
        discardRecording();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!presentationId) return;
    await fetch(`/api/presentations/${presentationId}/recording`, { method: "DELETE" });
    setSaved(false);
  }

  if (recordingData && previewUrl) {
    return (
      <div className="flex items-center gap-2">
        <audio src={previewUrl} controls className="h-8 w-32 md:w-40" />
        <span className="text-[10px] text-neutral-500">{formatTime(recordingData.duration)}</span>
        <Tooltip content="Save recording">
          <button onClick={handleSave} disabled={saving} className="flex h-8 w-8 items-center justify-center rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 transition-colors">
            <FloppyDisk size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Discard">
          <button onClick={discardRecording} className="flex h-8 w-8 items-center justify-center rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition-colors">
            <Trash size={14} />
          </button>
        </Tooltip>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-2">
        <Circle size={10} weight="fill" className="text-red-500 animate-pulse" />
        <span className="font-mono text-xs text-red-400">{formatTime(duration)}</span>
        <Tooltip content={isPaused ? "Resume" : "Pause"}>
          <button onClick={isPaused ? resumeRecording : pauseRecording} className="flex h-8 w-8 items-center justify-center rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition-colors">
            {isPaused ? <Play size={14} weight="fill" /> : <Pause size={14} weight="fill" />}
          </button>
        </Tooltip>
        <Tooltip content="Stop recording">
          <button onClick={stopRecording} className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-white hover:bg-red-500 transition-colors">
            <Stop size={14} weight="fill" />
          </button>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-[10px] text-red-400">{error}</span>}
      <Tooltip content="Record narration">
        <button onClick={() => {
          if (!limits.canRecord) { setShowUpgrade(true); return; }
          startRecording();
        }} className="flex h-8 items-center gap-1.5 rounded px-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors">
          <Microphone size={14} weight={saved ? "fill" : "regular"} className={saved ? "text-red-400" : ""} />
          <span className="hidden md:inline text-xs">{saved ? "Re-record" : "Record"}</span>
        </button>
      </Tooltip>
      {saved && (
        <Tooltip content="Delete recording">
          <button onClick={handleDelete} className="flex h-8 w-8 items-center justify-center rounded text-neutral-500 hover:bg-neutral-800 hover:text-red-400 transition-colors">
            <Trash size={12} />
          </button>
        </Tooltip>
      )}
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Recording"
        requiredPlan={requiredPlanFor("canRecord")}
      />
    </div>
  );
}
