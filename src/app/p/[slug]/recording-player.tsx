"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, ArrowCounterClockwise, SpeakerHigh } from "@phosphor-icons/react";

interface TimelineEntry {
  slideIndex: number;
  startTime: number;
}

interface Props {
  recordingUrl: string;
  timeline: TimelineEntry[];
  duration: number;
  onSlideChange: (index: number) => void;
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function RecordingPlayer({ recordingUrl, timeline, duration, onSlideChange }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const rafRef = useRef<number>(0);

  const syncSlide = useCallback((timeMs: number) => {
    let activeEntry = timeline[0];
    for (const entry of timeline) {
      if (entry.startTime <= timeMs) activeEntry = entry;
      else break;
    }
    if (activeEntry) onSlideChange(activeEntry.slideIndex);
  }, [timeline, onSlideChange]);

  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const ms = audio.currentTime * 1000;
    setCurrentTime(ms);
    syncSlide(ms);
    if (!audio.paused) rafRef.current = requestAnimationFrame(tick);
  }, [syncSlide]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function handlePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
      rafRef.current = requestAnimationFrame(tick);
    } else {
      audio.pause();
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  }

  function handleRestart() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    syncSlide(0);
    if (!audio.paused) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = (pct * duration) / 1000;
    setCurrentTime(pct * duration);
    syncSlide(pct * duration);
  }

  function handleEnded() {
    setPlaying(false);
    cancelAnimationFrame(rafRef.current);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex h-11 w-11 md:h-9 md:w-auto md:px-3 items-center justify-center gap-1.5 rounded-full md:rounded bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Play narration"
      >
        <SpeakerHigh size={16} weight="fill" />
        <span className="hidden md:inline text-xs">Narration</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-black/80 px-3 py-2 backdrop-blur-sm">
      <audio ref={audioRef} src={recordingUrl} onEnded={handleEnded} preload="auto" />
      <button onClick={handlePlayPause} className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover transition-colors" aria-label={playing ? "Pause" : "Play"}>
        {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
      </button>
      <div className="flex flex-col gap-1 min-w-[120px] md:min-w-[180px]">
        <div className="h-1.5 w-full cursor-pointer rounded-full bg-white/20" onClick={handleSeek} onTouchStart={handleSeek}>
          <div className="h-full rounded-full bg-white transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-silver/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <button onClick={handleRestart} className="flex h-8 w-8 items-center justify-center rounded text-silver/70 hover:text-white transition-colors" aria-label="Restart">
        <ArrowCounterClockwise size={14} />
      </button>
      <button onClick={() => { setExpanded(false); audioRef.current?.pause(); setPlaying(false); }} className="text-[10px] text-silver/50 hover:text-white transition-colors">
        Close
      </button>
    </div>
  );
}
