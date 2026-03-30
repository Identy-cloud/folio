import { memo } from "react";
import { VideoCamera } from "@phosphor-icons/react";
import type { VideoElement } from "@/types/elements";

interface Props {
  element: VideoElement;
  mode?: "editor" | "viewer" | "preview";
}

export const VideoRenderer = memo(function VideoRenderer({ element, mode = "editor" }: Props) {
  if (mode === "preview") {
    if (element.poster) {
      return (
        <img
          src={element.poster}
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-900/60">
        <VideoCamera size={32} className="text-neutral-500" weight="duotone" />
      </div>
    );
  }

  if (mode === "editor") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black">
        {element.poster ? (
          <img
            src={element.poster}
            alt=""
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <video
            src={element.src}
            muted
            playsInline
            preload="metadata"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <VideoCamera size={24} className="text-white" weight="fill" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <video
      src={element.src}
      poster={element.poster || undefined}
      autoPlay={element.autoplay}
      loop={element.loop}
      muted={element.muted}
      playsInline
      controls={!element.autoplay}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
});
