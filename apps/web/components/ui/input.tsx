import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, leftIcon, rightIcon, ...props },
  ref
) {
  return (
    <div className="relative w-full">
      {leftIcon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted [&>svg]:size-4">
          {leftIcon}
        </span>
      ) : null}
      <input
        ref={ref}
        className={cn(
          "liqui-minimal flex h-9.5 w-full rounded-g2 px-3 text-sm text-foreground transition-[background-color,box-shadow] duration-200 ease-(--ease-liquid) placeholder:text-muted/70 focus:outline-none focus:[box-shadow:inset_0_0_0_1px_rgb(99_102_241/0.55),0_0_0_3px_rgb(99_102_241/0.15)] disabled:cursor-not-allowed disabled:opacity-50",
          leftIcon && "pl-9",
          rightIcon && "pr-9",
          error &&
            "focus:[box-shadow:inset_0_0_0_1px_rgb(239_68_68/0.65),0_0_0_3px_rgb(239_68_68/0.14)]",
          className
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {rightIcon ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted [&>svg]:size-4">{rightIcon}</span>
      ) : null}
      {error ? <p className="mt-1.5 text-[13px] leading-snug text-red-600">{error}</p> : null}
    </div>
  );
});
