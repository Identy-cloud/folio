"use client";

import { useEditorStore } from "@/store/editorStore";

interface AwarenessUser {
  name: string;
  color: string;
  cursor: { x: number; y: number; slideIndex: number } | null;
  clientId: number;
}

interface Props {
  peers: AwarenessUser[];
}

export function RemoteCursors({ peers }: Props) {
  const activeSlideIndex = useEditorStore((s) => s.activeSlideIndex);

  const visible = peers.filter(
    (p) => p.cursor && p.cursor.slideIndex === activeSlideIndex
  );

  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((peer) => (
        <div
          key={peer.clientId}
          style={{
            position: "absolute",
            left: peer.cursor!.x,
            top: peer.cursor!.y,
            pointerEvents: "none",
            zIndex: 99999,
            transition: "left 0.1s linear, top 0.1s linear",
          }}
        >
          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill={peer.color}
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          >
            <path d="M0 0L16 12L8 12L4 20L0 0Z" />
          </svg>
          <span
            style={{
              display: "inline-block",
              marginLeft: 8,
              marginTop: -4,
              padding: "2px 6px",
              backgroundColor: peer.color,
              color: "white",
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 3,
              whiteSpace: "nowrap",
            }}
          >
            {peer.name}
          </span>
        </div>
      ))}
    </>
  );
}
