"use client";

import { SlidePanel } from "./SlidePanel/SlidePanel";
import { Canvas } from "./Canvas/Canvas";
import { Toolbar } from "./Toolbar/Toolbar";
import { ElementPalette } from "./ElementPalette/ElementPalette";
import { useKeyboard } from "../hooks/useKeyboard";
import { useAutoSave } from "../hooks/useAutoSave";

export function EditorLayout() {
  useKeyboard();
  useAutoSave();

  return (
    <div className="flex h-screen flex-col bg-neutral-100">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <SlidePanel />
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <Canvas />
        </div>
        <ElementPalette />
      </div>
    </div>
  );
}
