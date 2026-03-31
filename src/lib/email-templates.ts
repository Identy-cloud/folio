import { APP_URL, base, button, heading, paragraph } from "./email-template-base";

export function collaboratorInviteHtml(
  inviterName: string,
  presentationTitle: string,
  link: string
): string {
  return base(
    "You've been invited to collaborate",
    heading("You're invited to collaborate") +
      paragraph(
        `<strong>${inviterName}</strong> has invited you to collaborate on <strong>&ldquo;${presentationTitle}&rdquo;</strong>.`
      ) +
      paragraph("Open the presentation to start editing together.") +
      button(link, "Open Presentation")
  );
}

export function commentNotificationHtml(
  commenterName: string,
  presentationTitle: string,
  link: string
): string {
  return base(
    "New comment on your presentation",
    heading("New comment") +
      paragraph(
        `<strong>${commenterName}</strong> left a comment on <strong>&ldquo;${presentationTitle}&rdquo;</strong>.`
      ) +
      button(link, "View Comment")
  );
}

export function commentReplyHtml(
  replierName: string,
  presentationTitle: string,
  link: string
): string {
  return base(
    "New reply to your comment",
    heading("Someone replied to your comment") +
      paragraph(
        `<strong>${replierName}</strong> replied to your comment on <strong>&ldquo;${presentationTitle}&rdquo;</strong>.`
      ) +
      button(link, "View Reply")
  );
}

export function welcomeHtml(name: string): string {
  return base(
    "Welcome to Folio",
    heading(`Welcome, ${name}!`) +
      paragraph(
        "Folio is where presentations are crafted to impress. Create, collaborate, and share with a single link."
      ) +
      paragraph("Start by creating your first presentation from the dashboard.") +
      button(`${APP_URL}/dashboard`, "Go to Dashboard")
  );
}

export function passwordResetHtml(resetLink: string): string {
  return base(
    "Reset your password",
    heading("Reset your password") +
      paragraph("We received a request to reset your password. Click the button below to choose a new one.") +
      button(resetLink, "Reset Password") +
      paragraph("If you didn't request this, you can safely ignore this email.")
  );
}

export function viewMilestoneHtml(
  userName: string,
  presentationTitle: string,
  milestone: number,
  link: string
): string {
  return base(
    `Your presentation hit ${milestone} views!`,
    heading(`${milestone.toLocaleString()} views!`) +
      paragraph(
        `Congratulations${userName ? `, ${userName}` : ""}! Your presentation <strong>&ldquo;${presentationTitle}&rdquo;</strong> just hit <strong>${milestone.toLocaleString()} views</strong>.`
      ) +
      paragraph("Keep sharing to reach even more people.") +
      button(link, "View Presentation")
  );
}

export function scheduledPublishHtml(
  userName: string,
  presentationTitle: string,
  slug: string
): string {
  return base(
    "Your presentation is now live!",
    heading("Your presentation is live") +
      paragraph(
        `${userName ? `Hi ${userName}, your` : "Your"} scheduled presentation <strong>&ldquo;${presentationTitle}&rdquo;</strong> has been published and is now publicly accessible.`
      ) +
      button(`${APP_URL}/p/${slug}`, "View Live Presentation")
  );
}
