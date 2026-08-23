import { brand } from "@/config/brand";
import { cn } from "@/utils/cn";

export interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * Brand mark — a stylized link glyph on the brand gradient.
 * Colors come from config/brand.ts (accent).
 */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  const { from, to } = brand.accent;
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-xl shadow-sm shadow-brand-600/30", className)}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size * 0.56, height: size * 0.56 }}
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    </span>
  );
}

export function Logo({ size = 28, withWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          {brand.name}
        </span>
      )}
    </span>
  );
}
