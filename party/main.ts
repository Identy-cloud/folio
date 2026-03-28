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
    } catch {
      conn.close(4002, "Auth validation failed");
      return;
    }

    return onConnect(conn, this.room, {
      persist: { mode: "snapshot" },
    });
  }
}
