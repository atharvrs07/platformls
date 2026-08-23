"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type RevealVariant = "up" | "left" | "right" | "zoom" | "blur" | "none";

interface RevealProps {
  children?: ReactNode;
  className?: string;
  /** Direction of the entrance (defaults to up). Use "none" to animate only children. */
  variant?: RevealVariant;
  /** Delay in ms applied to the reveal itself. */
  delay?: number;
  /** When true the wrapper stays put and only `.reveal-child` children animate. */
  stagger?: boolean;
  style?: CSSProperties;
}

export function Reveal({ children, className, variant = "up", delay = 0, stagger = false, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={stagger ? "none" : variant}
      data-revealed={revealed || undefined}
      className={cn(className)}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
