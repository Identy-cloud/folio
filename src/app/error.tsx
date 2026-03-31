"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorLayout } from "@/components/ErrorLayout";

export default function GlobalError({
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
      label="Error"
      title="SOMETHING WENT WRONG"
      description="An unexpected error occurred. Try again or return to the dashboard."
      errorMessage={error?.message}
      digest={error?.digest}
      showDevError={process.env.NODE_ENV === "development"}
      primaryAction={{ label: "Try again", onClick: reset }}
      secondaryAction={{ label: "Dashboard", href: "/dashboard" }}
    />
  );
}
