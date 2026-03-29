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

    // Verify user has access to this presentation room
    const roomId = this.room.id;
    try {
      const dbRes = await fetch(
        `${supabaseUrl}/rest/v1/presentations?id=eq.${roomId}&user_id=eq.${userId}&select=id`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      const rows = await dbRes.json();
      if (!Array.isArray(rows) || rows.length === 0) {
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
