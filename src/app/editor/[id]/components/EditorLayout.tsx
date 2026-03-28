"use client";

import { SlidePanel } from "./SlidePanel/SlidePanel";
import { Canvas } from "./Canvas/Canvas";
import { Toolbar } from "./Toolbar/Toolbar";
import { ElementPalette } from "./ElementPalette/ElementPalette";
import { Onboarding } from "@/components/editor/Onboarding";
import { OfflineBanner } from "@/components/editor/OfflineBanner";
import { useKeyboard } from "../hooks/useKeyboard";
import { useAutoSave } from "../hooks/useAutoSave";
import { useCollaboration } from "../hooks/useCollaboration";
import { useEditorStore } from "@/store/editorStore";
import { useSessionGuard } from "@/hooks/useSessionGuard";

export function EditorLayout() {
  const presentationId = useEditorStore((s) => s.presentationId);
  const { peers, connected, updateCursor, clearCursor } =
    useCollaboration(presentationId);

  useKeyboard();
  useAutoSave();
  useSessionGuard();

  return (
    <div className="flex h-screen flex-col bg-neutral-100">
      <OfflineBanner />
      <div data-panel="toolbar">
        <Toolbar connected={connected} peerCount={peers.length} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div data-panel="slides">
          <SlidePanel />
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <Canvas
            peers={peers}
            onCursorMove={updateCursor}
            onCursorLeave={clearCursor}
          />
        </div>
        <div data-panel="palette">
          <ElementPalette />
        </div>
      </div>
      <Onboarding />
    </div>
  );
}
