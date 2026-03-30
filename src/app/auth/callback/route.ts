import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { trackSession } from "@/lib/session-tracker";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }

      const token = await trackSession(data.user.id, request.headers);
      const response = NextResponse.redirect(`${origin}${safeNext}`);
      response.cookies.set("session-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
