"use client";

import { Bell, BellOff } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function NotificationsMenu() {
  return (
    <DropdownMenu
      label="Notifications"
      align="end"
      trigger={
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-4" />
        </Button>
      }
      content={
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <span className="liqui-minimal flex size-10 items-center justify-center rounded-g2">
            <BellOff className="size-4.5 text-muted" strokeWidth={1.75} />
          </span>
          <p className="text-sm font-medium text-foreground">You&apos;re all caught up</p>
          <p className="text-[13px] text-muted">Notifications about your workspace will appear here.</p>
        </div>
      }
      menuClassName="w-80"
    />
  );
}
