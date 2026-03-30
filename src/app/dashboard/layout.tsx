import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { DeleteAccountButton } from "./delete-account-button";
import { LocaleSelector } from "@/components/LocaleSelector";
import { FolioLogo } from "@/components/FolioLogo";
import { NotificationBell } from "@/components/NotificationBell";
import { UpgradeButton } from "@/components/UpgradeButton";
import { WorkspaceSwitcherWrapper } from "./workspace-switcher-wrapper";
import { WorkspaceProvider } from "./workspace-context";

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
    <WorkspaceProvider>
    <div className="flex min-h-screen flex-col bg-[#161616] text-neutral-200">
      <header className="flex h-14 items-center justify-between border-b border-neutral-800 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl text-white sm:text-2xl">
            <FolioLogo size={22} />
          </h1>
          <WorkspaceSwitcherWrapper />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="hidden text-sm text-neutral-400 sm:block">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 text-xs font-medium text-[#161616]">
                {initials}
              </div>
            )}
          </Link>
          <UpgradeButton />
          <NotificationBell />
          <LocaleSelector />
          <LogoutButton />
        </div>
      </header>
      <main id="main-content" className="flex-1 p-4 sm:p-6">{children}</main>
      <footer className="border-t border-neutral-800 px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <DeleteAccountButton />
          <Link href="/terms" className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            Terminos
          </Link>
          <Link href="/privacy" className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            Privacidad
          </Link>
          <Link href="/cookies" className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            Cookies
          </Link>
          <Link href="/dmca" className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            DMCA
          </Link>
          <Link href="/accessibility" className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            Accesibilidad
          </Link>
          <Link href="/privacy#ccpa" className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase hover:text-neutral-400 transition-colors">
            No vender mi informacion
          </Link>
        </div>
      </footer>
    </div>
    </WorkspaceProvider>
  );
}
