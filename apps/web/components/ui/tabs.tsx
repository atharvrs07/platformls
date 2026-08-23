"use client";

import { cn } from "@/utils/cn";

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("liqui-minimal inline-flex items-center gap-1 rounded-g2 p-1", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-g1 px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ease-(--ease-liquid)",
            value === item.value
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
