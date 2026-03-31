"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorLayout } from "@/components/ErrorLayout";

export default function DashboardError({
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
      label="Dashboard error"
      title="COULDN'T LOAD DASHBOARD"
      description="We had trouble loading your presentations. Please try again."
      errorMessage={error?.message}
      digest={error?.digest}
      showDevError={process.env.NODE_ENV === "development"}
      primaryAction={{ label: "Try again", onClick: reset }}
      secondaryAction={{ label: "Go home", href: "/" }}
    />
  );
}
