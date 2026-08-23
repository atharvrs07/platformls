import { cn } from "@/utils/cn";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "liqui-minimal pointer-events-none inline-flex h-5 items-center gap-0.5 rounded-[0.375rem] px-1.5 font-mono text-[11px] font-medium text-muted",
        className
      )}
    >
      {children}
    </kbd>
  );
}
