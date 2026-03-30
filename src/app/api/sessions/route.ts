import { getAuthenticatedUser } from "@/lib/auth";
import { listSessions, revokeSession, revokeAllSessions } from "@/lib/session-tracker";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const items = await listSessions(user.id);
  return Response.json({ sessions: items });
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));

  if (body.sessionId) {
    await revokeSession(user.id, body.sessionId);
    return Response.json({ ok: true });
  }

  if (body.all) {
    await revokeAllSessions(user.id, body.exceptToken);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Invalid request" }, { status: 400 });
}
