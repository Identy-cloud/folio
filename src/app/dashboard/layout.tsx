import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { FolioLogo } from "@/components/FolioLogo";
import { NotificationBell } from "@/components/NotificationBell";
import { UpgradeButton } from "@/components/UpgradeButton";
import { WorkspaceSwitcherWrapper } from "./workspace-switcher-wrapper";
import { WorkspaceProvider } from "./workspace-context";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  const [dbUser] = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const initials = (user.user_metadata?.full_name ?? user.email ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <WorkspaceProvider>
    <div className="flex min-h-screen flex-col bg-white text-navy">
      <header className="flex h-14 items-center justify-between border-b border-silver/30 px-3 sm:h-16 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-xl text-navy sm:text-2xl">
            <FolioLogo size={22} className="text-navy" />
          </h1>
          <div className="hidden sm:block">
            <WorkspaceSwitcherWrapper />
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-4">
          <Link href="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="hidden text-sm text-slate sm:block">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-medium text-white">
                {initials}
              </div>
            )}
          </Link>
          {dbUser?.username && (
            <Link
              href={`/u/${dbUser.username}`}
              className="hidden text-[10px] tracking-[0.15em] text-steel uppercase hover:text-navy transition-colors sm:block"
            >
              Portfolio
            </Link>
          )}
          <div className="hidden sm:flex">
            <UpgradeButton />
          </div>
          <NotificationBell />
          <LogoutButton />
        </div>
      </header>
      <main id="main-content" className="flex-1 p-4 sm:p-6">{children}</main>
      <footer className="border-t border-silver/30 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-4">
          <Link href="/terms" className="text-[10px] tracking-[0.15em] text-steel/60 uppercase hover:text-navy transition-colors">
            Legal
          </Link>
          <Link href="/privacy" className="text-[10px] tracking-[0.15em] text-steel/60 uppercase hover:text-navy transition-colors">
            Privacidad
          </Link>
          <Link href="/accessibility" className="hidden text-[10px] tracking-[0.15em] text-steel/60 uppercase hover:text-navy transition-colors sm:block">
            Accesibilidad
          </Link>
        </div>
      </footer>
    </div>
    </WorkspaceProvider>
  );
}
