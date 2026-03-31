"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorLayout } from "@/components/ErrorLayout";

export default function EditorError({
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
      label="Editor error"
      title="COULDN'T LOAD EDITOR"
      description="The editor encountered an error. Your work has been saved automatically."
      errorMessage={error?.message}
      digest={error?.digest}
      showDevError={process.env.NODE_ENV === "development"}
      primaryAction={{ label: "Try again", onClick: reset }}
      secondaryAction={{ label: "Return to dashboard", href: "/dashboard" }}
    />
  );
}
