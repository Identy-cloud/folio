import { useEffect, useRef, useState, useCallback } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { createClient } from "@/lib/supabase/client";
import { useEditorStore } from "@/store/editorStore";
import type { Slide } from "@/types/elements";

interface AwarenessUser {
  name: string;
  color: string;
  cursor: { x: number; y: number; slideIndex: number } | null;
  clientId: number;
}

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
];

function colorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function useCollaboration(presentationId: string) {
  const [peers, setPeers] = useState<AwarenessUser[]>([]);
  const [connected, setConnected] = useState(false);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const LOCAL_ORIGIN = "local-store";

  const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST;

  useEffect(() => {
    if (!host || !presentationId) return;

    const supabase = createClient();
    let provider: WebsocketProvider | null = null;
    let ydoc: Y.Doc | null = null;

    async function connect() {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const user = data.session?.user;
      const userName = user?.user_metadata?.full_name ?? user?.email ?? "Anónimo";
      const userColor = colorFromId(user?.id ?? "");

      ydoc = new Y.Doc();
      ydocRef.current = ydoc;

      provider = new WebsocketProvider(
        `wss://${host}/party/${presentationId}`,
        presentationId,
        ydoc,
        { params: { token } }
      );
      providerRef.current = provider;

      provider.on("status", ({ status }: { status: string }) => {
        setConnected(status === "connected");
      });

      provider.awareness.setLocalStateField("user", {
        name: userName,
        color: userColor,
        cursor: null,
        clientId: ydoc.clientID,
      });

      provider.awareness.on("change", () => {
        const states = provider!.awareness.getStates();
        const others: AwarenessUser[] = [];
        states.forEach((state, clientId) => {
          if (clientId !== ydoc!.clientID && state.user) {
            others.push({ ...state.user, clientId });
          }
        });
        setPeers(others);
      });

      const ySlides = ydoc.getArray("slides");

      ySlides.observeDeep((_events, transaction) => {
        if (transaction.origin === LOCAL_ORIGIN) return;
        const slidesData = ySlides.toJSON() as Slide[];
        if (slidesData.length > 0) {
          const store = useEditorStore.getState();
          const currentJson = JSON.stringify(store.slides);
          const remoteJson = JSON.stringify(slidesData);
          if (currentJson !== remoteJson) {
            store.init(presentationId, slidesData);
          }
        }
      });

      const unsub = useEditorStore.subscribe((state, prev) => {
        if (state.slides !== prev.slides && ydoc && ySlides) {
          ydoc.transact(() => {
            ySlides.delete(0, ySlides.length);
            state.slides.forEach((slide) => {
              ySlides.push([slide]);
            });
          }, LOCAL_ORIGIN);
        }
      });

      return unsub;
    }

    let unsub: (() => void) | undefined;
    connect().then((u) => {
      unsub = u;
    });

    return () => {
      unsub?.();
      provider?.disconnect();
      provider?.destroy();
      ydoc?.destroy();
      providerRef.current = null;
      ydocRef.current = null;
    };
  }, [presentationId, host]);

  const updateCursor = useCallback(
    (x: number, y: number, slideIndex: number) => {
      providerRef.current?.awareness.setLocalStateField("user", {
        ...providerRef.current.awareness.getLocalState()?.user,
        cursor: { x, y, slideIndex },
      });
    },
    []
  );

  const clearCursor = useCallback(() => {
    providerRef.current?.awareness.setLocalStateField("user", {
      ...providerRef.current.awareness.getLocalState()?.user,
      cursor: null,
    });
  }, []);

  return { peers, connected, updateCursor, clearCursor };
}
