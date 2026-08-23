"use client";

import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useToast, type ToastVariant } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";

const variantStyles: Record<ToastVariant, { icon: typeof Info; classes: string }> = {
  default: { icon: Info, classes: "" },
  success: {
    icon: CheckCircle2,
    classes: "[box-shadow:inset_0_0_0_1px_rgb(16_185_129/0.28),var(--liqui-shadow-standard)]",
  },
  error: {
    icon: XCircle,
    classes: "[box-shadow:inset_0_0_0_1px_rgb(239_68_68/0.3),var(--liqui-shadow-standard)]",
  },
  info: {
    icon: Info,
    classes: "[box-shadow:inset_0_0_0_1px_rgb(99_102_241/0.3),var(--liqui-shadow-standard)]",
  },
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const { icon: Icon, classes } = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "liqui-primary pointer-events-auto flex items-start gap-3 rounded-g2 p-4 liqui-emerge",
              classes
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 size-4 shrink-0",
                toast.variant === "success" && "text-emerald-500",
                toast.variant === "error" && "text-red-500",
                toast.variant === "info" && "text-brand-600"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-[13px] leading-snug text-muted">{toast.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="liqui-minimal rounded-g1 p-1 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
