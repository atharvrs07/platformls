import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "liqui-secondary flex flex-col items-center justify-center rounded-g3 text-center liqui-emerge",
        compact ? "gap-3 px-6 py-10" : "gap-4 px-6 py-16",
        className
      )}
    >
      <span className="liqui-minimal flex size-12 items-center justify-center rounded-g2">
        <Icon className="size-5 text-muted" strokeWidth={1.75} />
      </span>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {description && <p className="mx-auto max-w-sm text-[13px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
