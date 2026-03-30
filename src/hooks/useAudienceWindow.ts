"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useBroadcastChannel } from "./useBroadcastChannel";

interface UseAudienceWindowOptions {
  slug: string;
  currentSlide: number;
}

export function useAudienceWindow({ slug, currentSlide }: UseAudienceWindowOptions) {
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audienceWindowRef = useRef<Window | null>(null);

  const { postMessage, isSupported } = useBroadcastChannel(
    `folio-presenter-${slug}`,
  );

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (audienceOpen) {
      postMessage({ type: "slide-change", slide: currentSlide });
    }
  }, [currentSlide, audienceOpen, postMessage]);

  useEffect(() => {
    return () => {
      postMessage({ type: "presenter-disconnected" });
    };
  }, [postMessage]);

  useEffect(() => {
    if (!audienceOpen) return;
    const interval = setInterval(() => {
      if (audienceWindowRef.current?.closed) {
        setAudienceOpen(false);
        audienceWindowRef.current = null;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [audienceOpen]);

  const openAudienceWindow = useCallback(() => {
    const url = `/p/${slug}?presenter=true&slide=${currentSlide}`;
    const win = window.open(url, "folio-audience", "width=1280,height=720");
    if (win) {
      audienceWindowRef.current = win;
      setAudienceOpen(true);
      postMessage({ type: "presenter-connected" });
    }
  }, [slug, currentSlide, postMessage]);

  const closeAudienceWindow = useCallback(() => {
    audienceWindowRef.current?.close();
    audienceWindowRef.current = null;
    setAudienceOpen(false);
    postMessage({ type: "presenter-disconnected" });
  }, [postMessage]);

  const canShow = isSupported && !isMobile;

  return { audienceOpen, canShow, openAudienceWindow, closeAudienceWindow };
}
