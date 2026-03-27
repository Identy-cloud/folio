import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class YjsServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const token = new URL(ctx.request.url).searchParams.get("token");
    if (!token) {
      conn.close(4001, "Missing auth token");
      return;
    }

    return onConnect(conn, this.room, {
      persist: { mode: "snapshot" },
    });
  }
}
