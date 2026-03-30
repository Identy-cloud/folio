"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch((err: unknown) => {
        if (err instanceof Error) {
          console.warn("SW registration failed:", err.message);
        }
      });
    }
  }, []);

  return null;
}
