import type { ReactNode } from "react";
import { Label } from "./label";
import { cn } from "@/utils/cn";

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor}>{label}</Label>
        {hint && <span className="text-[12px] text-muted">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[13px] text-red-600">{error}</p>}
    </div>
  );
}
