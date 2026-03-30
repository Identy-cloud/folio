"use client";

import { useEffect, useRef, useCallback } from "react";

interface BroadcastMessage {
  type: "slide-change" | "presenter-connected" | "presenter-disconnected";
  slide?: number;
}

type MessageHandler = (msg: BroadcastMessage) => void;

export function useBroadcastChannel(
  channelName: string,
  onMessage?: MessageHandler,
) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(channelName);
    channelRef.current = ch;

    if (onMessage) {
      ch.onmessage = (ev: MessageEvent<BroadcastMessage>) => {
        onMessage(ev.data);
      };
    }

    return () => {
      ch.close();
      channelRef.current = null;
    };
  }, [channelName, onMessage]);

  const postMessage = useCallback(
    (msg: BroadcastMessage) => {
      channelRef.current?.postMessage(msg);
    },
    [],
  );

  const isSupported = typeof BroadcastChannel !== "undefined";

  return { postMessage, isSupported };
}
