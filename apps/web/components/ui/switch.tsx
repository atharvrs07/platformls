import { useId } from "react";
import { cn } from "@/utils/cn";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export function Switch({ checked, onCheckedChange, disabled, id, className, ...ariaProps }: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={switchId}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5.5 w-9.5 shrink-0 items-center rounded-full border border-transparent transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-brand-600" : "bg-surface-hover border-border",
        className
      )}
      {...ariaProps}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
