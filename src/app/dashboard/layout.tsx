import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const initials = (user.user_metadata?.full_name ?? user.email ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <header className="flex h-16 items-center justify-between border-b border-neutral-800 px-6">
        <h1 className="font-display text-2xl tracking-tight">
          FOLIO
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">
            {user.user_metadata?.full_name ?? user.email}
          </span>
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt=""
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-medium text-[#0a0a0a]">
              {initials}
            </div>
          )}
          <LogoutButton />
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
