import { useEffect, useState, useCallback, useRef, type MutableRefObject } from "react";
import * as Y from "yjs";
import type { WebsocketProvider } from "y-websocket";

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  timestamp: number;
}

interface UseChatOptions {
  ydocRef: MutableRefObject<Y.Doc | null>;
  providerRef: MutableRefObject<WebsocketProvider | null>;
  presentationId: string;
}

function getLastReadKey(presentationId: string): string {
  return `folio-chat-lastread-${presentationId}`;
}

function getLastReadTimestamp(presentationId: string): number {
  if (typeof window === "undefined") return 0;
  const val = localStorage.getItem(getLastReadKey(presentationId));
  return val ? Number(val) : 0;
}

function setLastReadTimestamp(presentationId: string, ts: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getLastReadKey(presentationId), String(ts));
}

export function useChat({ ydocRef, providerRef, presentationId }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelOpenRef = useRef(false);

  const syncMessages = useCallback((yMessages: Y.Array<ChatMessage>) => {
    const msgs = yMessages.toJSON() as ChatMessage[];
    setMessages(msgs);

    if (panelOpenRef.current) {
      const now = Date.now();
      setLastReadTimestamp(presentationId, now);
      setUnreadCount(0);
    } else {
      const lastRead = getLastReadTimestamp(presentationId);
      const unread = msgs.filter((m) => m.timestamp > lastRead).length;
      setUnreadCount(unread);
    }
  }, [presentationId]);

  useEffect(() => {
    const ydoc = ydocRef.current;
    if (!ydoc) return;

    const yMessages = ydoc.getArray<ChatMessage>("chat-messages");
    syncMessages(yMessages);

    const observer = () => syncMessages(yMessages);
    yMessages.observe(observer);

    return () => {
      yMessages.unobserve(observer);
    };
  }, [ydocRef, ydocRef.current, syncMessages]);

  const sendMessage = useCallback((text: string) => {
    const ydoc = ydocRef.current;
    const provider = providerRef.current;
    if (!ydoc || !provider) return;

    const awareness = provider.awareness.getLocalState();
    const user = awareness?.user as
      | { name: string; color: string; clientId: number }
      | undefined;

    const msg: ChatMessage = {
      id: `${ydoc.clientID}-${Date.now()}`,
      userId: String(ydoc.clientID),
      userName: user?.name ?? "Anonymous",
      userColor: user?.color ?? "#888",
      text: text.trim(),
      timestamp: Date.now(),
    };

    const yMessages = ydoc.getArray<ChatMessage>("chat-messages");
    ydoc.transact(() => {
      yMessages.push([msg]);
    });

    setLastReadTimestamp(presentationId, Date.now());
    setUnreadCount(0);
  }, [ydocRef, providerRef, presentationId]);

  const markAsRead = useCallback(() => {
    panelOpenRef.current = true;
    setLastReadTimestamp(presentationId, Date.now());
    setUnreadCount(0);
  }, [presentationId]);

  const markAsClosed = useCallback(() => {
    panelOpenRef.current = false;
  }, []);

  return { messages, sendMessage, unreadCount, markAsRead, markAsClosed };
}
