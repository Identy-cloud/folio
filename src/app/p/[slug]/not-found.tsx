import { NotFoundLayout } from "@/components/NotFoundLayout";

export default function ViewerNotFound() {
  return (
    <NotFoundLayout
      message="This presentation doesn't exist or is private."
      ctaLabel="Create my own presentation"
      ctaHref="/login"
    />
  );
}
