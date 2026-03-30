"use client";

import { useState, useRef, useCallback } from "react";

export interface TimelineEntry {
  slideIndex: number;
  startTime: number;
}

export interface RecordingData {
  blob: Blob;
  timeline: TimelineEntry[];
  duration: number;
}

export function useRecording(getActiveSlideIndex: () => number) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingData, setRecordingData] = useState<RecordingData | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timelineRef = useRef<TimelineEntry[]>([]);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSlideRef = useRef(-1);
  const slideCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slideCheckRef.current) clearInterval(slideCheckRef.current);
    timerRef.current = null;
    slideCheckRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setRecordingData(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorderRef.current = recorder;
      chunksRef.current = [];

      const slideIdx = getActiveSlideIndex();
      lastSlideRef.current = slideIdx;
      timelineRef.current = [{ slideIndex: slideIdx, startTime: 0 }];
      startTimeRef.current = Date.now();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const totalDuration = Date.now() - startTimeRef.current;
        setRecordingData({
          blob,
          timeline: timelineRef.current,
          duration: totalDuration,
        });
        setDuration(totalDuration);
        clearTimers();
      };

      recorder.start(250);
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setDuration(Date.now() - startTimeRef.current);
      }, 200);

      slideCheckRef.current = setInterval(() => {
        const idx = getActiveSlideIndex();
        if (idx !== lastSlideRef.current) {
          lastSlideRef.current = idx;
          timelineRef.current.push({
            slideIndex: idx,
            startTime: Date.now() - startTimeRef.current,
          });
        }
      }, 100);
    } catch {
      setError("Microphone access denied");
    }
  }, [getActiveSlideIndex, clearTimers]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  }, []);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current?.state === "paused") {
      recorderRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const discardRecording = useCallback(() => {
    setRecordingData(null);
    setDuration(0);
  }, []);

  return {
    isRecording,
    isPaused,
    recordingData,
    duration,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    discardRecording,
  };
}
