"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronsUpDown, CreditCard, LogOut, Plus, Settings, Sparkles, User } from "lucide-react";
import { dashboardNav, sidebarFooterItems } from "@/config/navigation";
import { LogoMark } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/cn";
import { brand } from "@/config/brand";

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4" aria-label="Sidebar">
      {dashboardNav.map((group, i) => (
        <div key={group.label ?? i}>
          {group.label && (
            <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted/80">
              {group.label}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-2.5 px-2.5 py-2 text-[13.5px] font-medium transition-all duration-200 ease-(--ease-liquid) rounded-g1",
                      active
                        ? "liqui-minimal text-foreground shadow-sm"
                        : "text-muted hover:bg-surface-hover/70 hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn("size-4 shrink-0 transition-colors", active ? "text-brand-600" : "text-muted group-hover:text-foreground")}
                      strokeWidth={1.75}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.status === "soon" && (
                      <Badge variant="neutral" className="px-1.5 py-0 text-[10px]">
                        Soon
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function WorkspaceSwitcher() {
  const { bundle } = useAuth();
  const workspace = bundle?.workspace;

  return (
    <div className="px-3 pt-3">
      <DropdownMenu
        label="Switch workspace"
        align="start"
        className="w-full"
        menuClassName="left-3 right-3"
        trigger={
          <span className="liqui-minimal flex w-full items-center gap-2.5 rounded-g2 px-2.5 py-2 text-left transition-colors duration-200 hover:bg-surface-hover">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-g1 bg-gradient-to-br from-brand-400 to-brand-700 text-[11px] font-bold text-white shadow-sm">
              {workspace ? workspace.name.slice(0, 1) : "L"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-foreground">
                {workspace?.name ?? brand.name}
              </span>
              <span className="block text-[11px] text-muted">Personal workspace</span>
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-muted" />
          </span>
        }
        items={[
          {
            label: `${workspace?.name ?? brand.name} — Personal`,
            icon: <Sparkles className="text-brand-600" />,
            onSelect: () => {},
          },
          { separator: true },
          {
            label: "Create team workspace",
            icon: <Plus />,
            disabled: true,
            onSelect: () => {},
          },
        ]}
      />
    </div>
  );
}

export function Sidebar({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
  const { user, logout } = useAuth();

  return (
    <aside className={cn("flex h-full w-60 flex-col border-r border-border-subtle", mobile ? "liqui-primary rounded-r-g3" : "bg-background/55 backdrop-blur-md")}>
      <div className="flex items-center gap-2 px-5 pt-4">
        <LogoMark size={28} />
        {mobile && <span className="text-[15px] font-semibold tracking-tight text-foreground">{brand.name}</span>}
      </div>

      {!mobile && <WorkspaceSwitcher />}

      <NavItems onNavigate={onNavigate} />

      <div className="border-t border-border-subtle px-3 py-2">
        {sidebarFooterItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-g1 px-2.5 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <item.icon className="size-4" strokeWidth={1.75} />
            {item.label}
            <Badge variant="neutral" className="ml-auto px-1.5 py-0 text-[10px]">
              Soon
            </Badge>
          </Link>
        ))}
      </div>

      {user && (
        <div className="border-t border-border p-3">
          <DropdownMenu
            label="Account menu"
            align="start"
            className="w-full"
            menuClassName="left-3 right-3"
            trigger={
              <span className="flex w-full items-center gap-2.5 rounded-g2 px-2 py-1.5 text-left transition-colors hover:bg-surface-hover">
                <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-foreground">{user.fullName}</span>
                  <span className="block truncate text-[11px] text-muted">@{user.username}</span>
                </span>
                <ChevronsUpDown className="size-3.5 shrink-0 text-muted" />
              </span>
            }
            items={[
              {
                label: "Profile",
                icon: <User />,
                onSelect: () => {
                  onNavigate?.();
                  window.location.href = "/settings";
                },
              },
              {
                label: "Billing",
                icon: <CreditCard />,
                onSelect: () => {
                  onNavigate?.();
                  window.location.href = "/billing";
                },
              },
              {
                label: "Settings",
                icon: <Settings />,
                onSelect: () => {
                  onNavigate?.();
                  window.location.href = "/settings";
                },
              },
              { separator: true },
              { label: "Sign out", icon: <LogOut />, danger: true, onSelect: () => void logout() },
            ]}
          />
        </div>
      )}
    </aside>
  );
}
