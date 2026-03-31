"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorLayout } from "@/components/ErrorLayout";

export default function ViewerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorLayout
      label="Viewer error"
      title="COULDN'T LOAD PRESENTATION"
      description="This presentation failed to load. It may have been removed or there was a temporary issue."
      errorMessage={error?.message}
      digest={error?.digest}
      showDevError={process.env.NODE_ENV === "development"}
      primaryAction={{ label: "Try again", onClick: reset }}
      secondaryAction={{ label: "Go home", href: "/" }}
    />
  );
}
