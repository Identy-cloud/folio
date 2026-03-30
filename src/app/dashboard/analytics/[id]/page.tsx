import { AnalyticsClient } from "./analytics-client";

export const metadata = {
  title: "Analytics — Folio",
};

export default async function AnalyticsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnalyticsClient presentationId={id} />;
}
