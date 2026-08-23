"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Tooltip({
  content,
  children,
  side = "bottom",
}: {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-g1 bg-foreground px-2 py-1 text-xs font-medium text-background shadow-sm animate-fade-in",
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
