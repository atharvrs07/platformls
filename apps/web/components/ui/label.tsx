import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(function Label(
  { className, children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={cn("mb-1.5 block text-[13px] font-medium text-foreground", className)}
      {...props}
    >
      {children}
    </label>
  );
});
