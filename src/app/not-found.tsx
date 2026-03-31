import { NotFoundLayout } from "@/components/NotFoundLayout";

export default function NotFound() {
  return (
    <NotFoundLayout
      message="This page doesn't exist or has been removed."
      ctaLabel="Go home"
      ctaHref="/"
    />
  );
}
