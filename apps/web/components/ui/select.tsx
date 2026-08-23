import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options, error, defaultValue, ...props },
  ref
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "liqui-minimal flex h-9.5 w-full appearance-none rounded-g2 px-3 pr-9 text-sm text-foreground transition-[background-color,box-shadow] duration-200 ease-(--ease-liquid) focus:outline-none focus:[box-shadow:inset_0_0_0_1px_rgb(99_102_241/0.55),0_0_0_3px_rgb(99_102_241/0.15)] disabled:cursor-not-allowed disabled:opacity-50",
          error && "focus:[box-shadow:inset_0_0_0_1px_rgb(239_68_68/0.65),0_0_0_3px_rgb(239_68_68/0.14)]",
          className
        )}
        defaultValue={defaultValue}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
      {error ? <p className="mt-1.5 text-[13px] text-red-600">{error}</p> : null}
    </div>
  );
});
