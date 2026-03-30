import { APP_URL, base, button, heading, paragraph } from "./email-template-base";

export interface AnalyticsDigestData {
  userName: string;
  totalViews: number;
  previousWeekViews: number;
  topPresentations: Array<{
    title: string;
    slug: string;
    views: number;
  }>;
}

export interface CollabDigestEntry {
  editorName: string;
  presentationTitle: string;
  presentationId: string;
}

export function analyticsDigestTemplate(data: AnalyticsDigestData): string {
  const { userName, totalViews, previousWeekViews, topPresentations } = data;
  const change = previousWeekViews > 0
    ? Math.round(((totalViews - previousWeekViews) / previousWeekViews) * 100)
    : totalViews > 0 ? 100 : 0;
  const trendIcon = change > 0 ? "&#9650;" : change < 0 ? "&#9660;" : "&#8212;";
  const trendColor = change > 0 ? "#22c55e" : change < 0 ? "#ef4444" : "#a1a1aa";
  const trendText = change === 0
    ? "No change"
    : `${change > 0 ? "+" : ""}${change}% vs last week`;

  const topRows = topPresentations
    .map(
      (p, i) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e4e4e7">
          <span style="color:#a1a1aa;font-size:13px;margin-right:8px">${i + 1}.</span>
          <a href="${APP_URL}/p/${p.slug}" style="color:#18181b;font-size:14px;font-weight:600;text-decoration:none">${p.title}</a>
        </td><td style="padding:10px 0;border-bottom:1px solid #e4e4e7;text-align:right;font-size:14px;color:#3f3f46;font-weight:600">
          ${p.views.toLocaleString()} views
        </td></tr>`
    )
    .join("");

  const statsBlock = `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0">
    <tr><td style="background:#fafafa;border-radius:8px;padding:20px;text-align:center">
      <p style="margin:0;font-size:36px;font-weight:700;color:#18181b;letter-spacing:-1px">${totalViews.toLocaleString()}</p>
      <p style="margin:6px 0 0;font-size:13px;color:${trendColor};font-weight:600">${trendIcon} ${trendText}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#a1a1aa">Total views this week</p>
    </td></tr></table>`;

  const topSection = topPresentations.length > 0
    ? `<p style="margin:24px 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#a1a1aa">Top presentations</p>
       <table width="100%" cellpadding="0" cellspacing="0">${topRows}</table>`
    : "";

  return base(
    "Your weekly analytics",
    heading(`Hi ${userName}, here's your week in review`) +
      paragraph("A quick look at how your presentations performed over the last 7 days.") +
      statsBlock +
      topSection +
      button(`${APP_URL}/dashboard`, "View Full Analytics")
  );
}

export function collabDigestHtml(
  userName: string,
  entries: CollabDigestEntry[]
): string {
  const rows = entries
    .map(
      (e) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e4e4e7">
          <strong style="color:#18181b;font-size:14px">${e.editorName}</strong>
          <span style="color:#3f3f46;font-size:14px"> edited </span>
          <a href="${APP_URL}/editor/${e.presentationId}" style="color:#18181b;font-size:14px;font-weight:600;text-decoration:none">${e.presentationTitle}</a>
        </td></tr>`
    )
    .join("");

  return base(
    "Collaboration digest",
    heading(`Hi ${userName}, here's what changed yesterday`) +
      paragraph("Your collaborators made edits on the following presentations:") +
      `<table width="100%" cellpadding="0" cellspacing="0">${rows}</table>` +
      button(`${APP_URL}/dashboard`, "Go to Dashboard")
  );
}
