import { Resend } from "resend";
import {
  collaboratorInviteHtml,
  commentNotificationHtml,
  commentReplyHtml,
  viewMilestoneHtml,
  scheduledPublishHtml,
  welcomeHtml,
  passwordResetHtml,
} from "./email-templates";
import {
  analyticsDigestTemplate,
  collabDigestHtml,
} from "./email-templates-digest";
import type { AnalyticsDigestData, CollabDigestEntry } from "./email-templates-digest";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM ?? "noreply@identy.cloud";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function sendCollaboratorInvite(
  to: string,
  inviterName: string,
  presentationTitle: string,
  link: string
) {
  return sendEmail({
    to,
    subject: `${inviterName} invited you to collaborate on "${presentationTitle}"`,
    html: collaboratorInviteHtml(inviterName, presentationTitle, link),
  });
}

export function sendCommentNotification(
  to: string,
  commenterName: string,
  presentationTitle: string,
  link: string
) {
  return sendEmail({
    to,
    subject: `New comment on "${presentationTitle}"`,
    html: commentNotificationHtml(commenterName, presentationTitle, link),
  });
}

export function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Welcome to Folio",
    html: welcomeHtml(name),
  });
}

export function sendPasswordResetEmail(to: string, resetLink: string) {
  return sendEmail({
    to,
    subject: "Reset your Folio password",
    html: passwordResetHtml(resetLink),
  });
}

export function sendAnalyticsDigest(to: string, data: AnalyticsDigestData) {
  return sendEmail({
    to,
    subject: `Your week in review: ${data.totalViews.toLocaleString()} views`,
    html: analyticsDigestTemplate(data),
  });
}

export function sendCommentReply(
  to: string,
  replierName: string,
  presentationTitle: string,
  link: string
) {
  return sendEmail({
    to,
    subject: `${replierName} replied to your comment on "${presentationTitle}"`,
    html: commentReplyHtml(replierName, presentationTitle, link),
  });
}

export function sendViewMilestone(
  to: string,
  userName: string,
  presentationTitle: string,
  milestone: number,
  link: string
) {
  return sendEmail({
    to,
    subject: `Your presentation "${presentationTitle}" just hit ${milestone.toLocaleString()} views!`,
    html: viewMilestoneHtml(userName, presentationTitle, milestone, link),
  });
}

export function sendCollabDigest(
  to: string,
  userName: string,
  entries: CollabDigestEntry[]
) {
  return sendEmail({
    to,
    subject: `${entries.length} presentation${entries.length === 1 ? "" : "s"} edited by collaborators yesterday`,
    html: collabDigestHtml(userName, entries),
  });
}

export function sendScheduledPublishConfirmation(
  to: string,
  userName: string,
  presentationTitle: string,
  slug: string
) {
  return sendEmail({
    to,
    subject: `Your presentation "${presentationTitle}" is now live!`,
    html: scheduledPublishHtml(userName, presentationTitle, slug),
  });
}
