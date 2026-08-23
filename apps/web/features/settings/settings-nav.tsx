"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNav } from "@/config/navigation";
import { cn } from "@/utils/cn";

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" aria-label="Settings">
      {settingsNav.map((group, i) => (
        <div key={group.label ?? i} className="flex items-center gap-1 lg:flex-col lg:items-stretch">
          {group.label && (
            <p className="hidden px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-widest text-muted/80 lg:block">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-surface-hover text-foreground shadow-sm"
                    : "text-muted hover:bg-surface-hover/70 hover:text-foreground"
                )}
              >
                <item.icon className={cn("size-4", active ? "text-brand-600" : "text-muted")} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
