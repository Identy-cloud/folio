import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class YjsServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const url = new URL(ctx.request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      conn.close(4001, "Missing auth token");
      return;
    }

    // Validate token against Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      conn.close(4003, "Server misconfigured");
      return;
    }

    let userId: string;
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: supabaseKey,
        },
      });

      if (!res.ok) {
        conn.close(4001, "Invalid auth token");
        return;
      }

      const userData = await res.json();
      userId = userData.id;
    } catch {
      conn.close(4002, "Auth validation failed");
      return;
    }

    // Verify user has access to this presentation room (owner OR collaborator)
    const roomId = this.room.id;
    try {
      const [ownerRes, collabRes] = await Promise.all([
        fetch(
          `${supabaseUrl}/rest/v1/presentations?id=eq.${roomId}&user_id=eq.${userId}&select=id`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        ),
        fetch(
          `${supabaseUrl}/rest/v1/collaborators?presentation_id=eq.${roomId}&user_id=eq.${userId}&select=id`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        ),
      ]);
      const ownerRows = await ownerRes.json();
      const collabRows = await collabRes.json();
      const isOwner = Array.isArray(ownerRows) && ownerRows.length > 0;
      const isCollaborator = Array.isArray(collabRows) && collabRows.length > 0;
      if (!isOwner && !isCollaborator) {
        conn.close(4003, "Access denied");
        return;
      }
    } catch {
      conn.close(4002, "Authorization check failed");
      return;
    }

    return onConnect(conn, this.room, {
      persist: { mode: "snapshot" },
    });
  }
}
