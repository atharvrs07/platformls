"use client";

import { useRouter } from "next/navigation";
import { CreditCard, LogOut, Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Kbd } from "@/components/ui/kbd";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { NotificationsMenu } from "./notifications-menu";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useMounted } from "@/hooks/use-mounted";

export function Topbar({ onOpenMenu, onOpenSearch }: { onOpenMenu: () => void; onOpenSearch: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDark, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border-subtle bg-background/60 px-4 backdrop-blur-md sm:px-5">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMenu} aria-label="Open menu">
        <Menu className="size-4" />
      </Button>

      <button
        type="button"
        onClick={onOpenSearch}
        className="liqui-minimal group flex h-9 w-full max-w-xs items-center gap-2.5 rounded-g2 px-3 text-left text-[13px] text-muted transition-colors duration-200 ease-(--ease-liquid) hover:bg-surface-hover hover:text-muted"
      >
        <Search className="size-3.5" />
        <span className="flex-1">Search workspace…</span>
        <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "LIGHT" : "DARK")}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        )}

        <NotificationsMenu />

        {user && (
          <DropdownMenu
            label="Account menu"
            align="end"
            className="ml-1"
            trigger={
              <button type="button" className="rounded-full outline-none transition-opacity hover:opacity-80" aria-label="Open account menu">
                <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
              </button>
            }
            items={[
              {
                label: "Profile",
                icon: <User />,
                onSelect: () => router.push("/settings"),
              },
              {
                label: "Billing",
                icon: <CreditCard />,
                onSelect: () => router.push("/billing"),
              },
              {
                label: "Settings",
                icon: <Settings />,
                onSelect: () => router.push("/settings"),
              },
              { separator: true },
              { label: "Sign out", icon: <LogOut />, danger: true, onSelect: () => void logout() },
            ]}
          />
        )}
      </div>
    </header>
  );
}
