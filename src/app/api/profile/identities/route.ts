import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const identities = (user.identities ?? []).map((i) => ({
    provider: i.provider,
    identityId: i.identity_id,
    createdAt: i.created_at,
  }));

  return Response.json({ identities });
}
