"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ArrowRight, Moon, Search, Sun, CornerDownLeft, type LucideIcon } from "lucide-react";
import { dashboardNav } from "@/config/navigation";
import { Kbd } from "@/components/ui/kbd";
import { useMounted } from "@/hooks/use-mounted";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/utils/cn";

interface CommandItem {
  label: string;
  hint?: string;
  icon: LucideIcon;
  group: string;
  action: () => void;
}

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const mounted = useMounted();
  const { isDark, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const items = useMemo<CommandItem[]>(() => {
    const navItems = dashboardNav.flatMap((group) =>
      group.items.map((item) => ({
        label: item.label,
        hint: item.status === "soon" ? "Coming soon" : undefined,
        icon: item.icon,
        group: "Navigate",
        action: () => {
          onOpenChange(false);
          router.push(item.href);
        },
      }))
    );

    const quickActions: CommandItem[] = [
      {
        label: isDark ? "Switch to light mode" : "Switch to dark mode",
        icon: isDark ? Sun : Moon,
        group: "Actions",
        action: () => {
          setTheme(isDark ? "LIGHT" : "DARK");
          onOpenChange(false);
        },
      },
      {
        label: "Go to settings",
        icon: ArrowRight,
        group: "Actions",
        action: () => {
          onOpenChange(false);
          router.push("/settings");
        },
      },
    ];

    return [...navItems, ...quickActions];
  }, [router, onOpenChange, isDark, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => setActiveIndex(0), [query]);

  if (!mounted || !open) return null;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) item.action();
    }
  }

  let flatIndex = -1;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px] animate-fade-in" onClick={() => onOpenChange(false)} aria-hidden />
      <div className="liqui-primary liqui-clip-content liqui-emerge relative w-full max-w-lg rounded-g3">
        <div className="flex items-center gap-3 px-4 [box-shadow:inset_0_-1px_0_rgb(148_163_184/0.12)]">
          <Search className="size-4 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search workspace…"
            className="h-13 w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
            aria-label="Search workspace"
          />
          <Kbd>ESC</Kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {grouped.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted">No results for “{query}”</p>
          )}
          {grouped.map(([group, groupItems]) => (
            <div key={group}>
              <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-widest text-muted/80">{group}</p>
              {groupItems.map((item) => {
                flatIndex += 1;
                const idx = flatIndex;
                return (
                  <button
                    key={`${group}-${item.label}`}
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => item.action()}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-g1 px-3 py-2.5 text-left text-sm transition-colors duration-150",
                      idx === activeIndex ? "bg-surface-hover text-foreground" : "text-muted"
                    )}
                  >
                    <item.icon className={cn("size-4 shrink-0", idx === activeIndex ? "text-brand-600" : "text-muted")} strokeWidth={1.75} />
                    <span className={cn("flex-1", idx === activeIndex && "text-foreground")}>{item.label}</span>
                    {item.hint && <span className="text-[11px] text-muted/70">{item.hint}</span>}
                    {idx === activeIndex && <CornerDownLeft className="size-3.5 text-muted" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
