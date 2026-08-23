"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface DropdownItem {
  label?: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items?: DropdownItem[];
  content?: ReactNode;
  align?: "start" | "end";
  className?: string;
  menuClassName?: string;
  label?: string;
}

export function DropdownMenu({
  trigger,
  items = [],
  content,
  align = "end",
  className,
  menuClassName,
  label,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="outline-none"
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "liqui-primary absolute top-full z-50 mt-2 w-56 rounded-g2 p-1.5 liqui-emerge",
            align === "end" ? "right-0" : "left-0",
            menuClassName
          )}
        >
          {content ? (
            content
          ) : (
            <>
              {items.map((item, index) =>
                item.separator ? (
                  <div key={index} className="my-1 h-px bg-border-subtle" />
                ) : (
                  <button
                    key={index}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      item.onSelect?.();
                      close();
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-g1 px-2.5 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
                      item.danger && "text-red-600 hover:bg-red-500/10 hover:text-red-600"
                    )}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                )
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
