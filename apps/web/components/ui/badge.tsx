import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export type BadgeVariant = "default" | "brand" | "success" | "warning" | "danger" | "neutral" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-hover text-foreground border border-border",
  brand: "bg-brand-600/10 text-brand-700 border border-brand-600/20 dark:text-brand-300",
  success: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 border border-amber-500/20 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-700 border border-red-500/20 dark:text-red-400",
  neutral: "bg-muted/10 text-muted border border-border",
  outline: "bg-transparent text-muted border border-border",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant = "default", ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
