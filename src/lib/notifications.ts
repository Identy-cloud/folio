import { db } from "@/db";
import { notifications } from "@/db/schema";

type NotificationType =
  | "comment"
  | "collaborator_added"
  | "collaborator_removed"
  | "presentation_shared";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  presentationId?: string | null;
}

export async function createNotification(params: CreateNotificationParams) {
  const [row] = await db
    .insert(notifications)
    .values({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      presentationId: params.presentationId ?? null,
    })
    .returning();

  return row;
}
