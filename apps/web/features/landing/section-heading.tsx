import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <Reveal stagger className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <span
        className="reveal-child text-[13px] font-semibold uppercase tracking-widest text-brand-600"
        style={{ "--reveal-delay": "0ms" } as CSSProperties}
      >
        {eyebrow}
      </span>
      <h2
        className="reveal-child mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        style={{ "--reveal-delay": "90ms" } as CSSProperties}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="reveal-child mt-4 text-base leading-relaxed text-muted"
          style={{ "--reveal-delay": "180ms" } as CSSProperties}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
