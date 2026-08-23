import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "liqui-shape bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 border border-transparent [box-shadow:inset_0_1px_0_rgb(255_255_255/0.22),var(--liqui-shadow-micro)] hover:[box-shadow:inset_0_1px_0_rgb(255_255_255/0.28),var(--liqui-shadow-standard)]",
  secondary:
    "liqui-minimal text-foreground hover:bg-surface-hover active:bg-surface-hover rounded-g2",
  ghost: "text-foreground hover:bg-surface-hover active:bg-surface-hover",
  outline:
    "liqui-minimal bg-transparent text-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-hover rounded-g2",
  destructive:
    "liqui-shape bg-red-600 text-white hover:bg-red-500 active:bg-red-700 border border-transparent [box-shadow:inset_0_1px_0_rgb(255_255_255/0.18),var(--liqui-shadow-micro)]",
  link: "text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline p-0 h-auto",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-g1",
  md: "h-9.5 px-4 text-sm gap-2 rounded-g2",
  lg: "h-11 px-6 text-[15px] gap-2 rounded-g2",
  icon: "h-9 w-9 rounded-g2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading = false, disabled, leftIcon, rightIcon, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ease-(--ease-liquid) outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
        variantClasses[variant],
        sizeClasses[size],
        variant === "link" && "shadow-none border-none focus-visible:ring-0",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
