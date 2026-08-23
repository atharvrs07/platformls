import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, ...props },
  ref
) {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          "liqui-minimal flex min-h-[96px] w-full rounded-g2 px-3 py-2.5 text-sm text-foreground transition-[background-color,box-shadow] duration-200 ease-(--ease-liquid) placeholder:text-muted/70 focus:outline-none focus:[box-shadow:inset_0_0_0_1px_rgb(99_102_241/0.55),0_0_0_3px_rgb(99_102_241/0.15)] disabled:cursor-not-allowed disabled:opacity-50",
          error && "focus:[box-shadow:inset_0_0_0_1px_rgb(239_68_68/0.65),0_0_0_3px_rgb(239_68_68/0.14)]",
          className
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <p className="mt-1.5 text-[13px] leading-snug text-red-600">{error}</p> : null}
    </div>
  );
});
