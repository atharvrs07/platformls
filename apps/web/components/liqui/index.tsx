"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";

/* ============================================================================
   LIQUI PRIMITIVES
   ----------------------------------------------------------------------------
   The canonical way to inherit the LiquiLink design language. New surfaces
   should use these instead of hand-assembling material classes; they
   centralize geometry (G1/G2/G3), material tiering, optics and motion.
   ========================================================================== */

export type LiquiTier = "primary" | "secondary" | "minimal";
export type LiquiGeometry = "g1" | "g2" | "g3";

const tierClass: Record<LiquiTier, string> = {
  primary: "liqui-primary",
  secondary: "liqui-secondary",
  minimal: "liqui-minimal",
};

const geometryClass: Record<LiquiGeometry, string> = {
  g1: "rounded-g1",
  g2: "rounded-g2",
  g3: "rounded-g3",
};

export interface LiquiSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Material hierarchy: primary (major surfaces), secondary (grouped), minimal (dense UI). */
  tier?: LiquiTier;
  /** Geometry token. Defaults to G2, the LiquiLink signature. */
  geometry?: LiquiGeometry;
  /** Gentle suspension on hover (interactive surfaces only). */
  lift?: boolean;
  /** Visible focus ring that follows the squircle shape. */
  focusable?: boolean;
}

/** Raw Liqui Material surface — the atom every other primitive builds on. */
export const LiquiSurface = forwardRef<HTMLDivElement, LiquiSurfaceProps>(function LiquiSurface(
  { className, tier = "primary", geometry = "g2", lift = false, focusable = false, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        tierClass[tier],
        geometryClass[geometry],
        lift && "liqui-lift cursor-pointer",
        focusable && "liqui-focus",
        className
      )}
      {...props}
    />
  );
});

/** LiquiCard — primary-tier content card with conventional padding slots. */
export function LiquiCard({
  className,
  children,
  header,
  footer,
  lift = false,
  ...props
}: LiquiSurfaceProps & { header?: ReactNode; footer?: ReactNode }) {
  return (
    <LiquiSurface tier="primary" geometry="g2" lift={lift} className={className} {...props}>
      {(header || children) && <div className="p-5 sm:p-6">{header}</div>}
      {children}
      {footer && <div className="p-5 pt-0 sm:p-6 sm:pt-0">{footer}</div>}
    </LiquiSurface>
  );
}

/** LiquiPanel — secondary-tier grouped surface for sections inside a page. */
export function LiquiPanel({ className, ...props }: LiquiSurfaceProps) {
  return <LiquiSurface tier="secondary" geometry="g2" {...props} />;
}

/** LiquiButton — button on the Liqui geometry/motion system. */
export const LiquiButton = forwardRef<HTMLButtonElement, ButtonProps>(function LiquiButton(props, ref) {
  return <Button ref={ref} {...props} />;
});

/** LiquiInput — input on the Liqui geometry/material system. */
export const LiquiInput = forwardRef<HTMLInputElement, InputProps>(function LiquiInput(props, ref) {
  return <Input ref={ref} {...props} />;
});

/** LiquiModal — modal surface treatment (pair with the Dialog shell). */
export function LiquiModal({ className, ...props }: LiquiSurfaceProps) {
  return <LiquiSurface tier="primary" geometry="g3" className={cn("shadow-modal", className)} {...props} />;
}

/* ---------------------------------------------------------------------------
   LiquiIndicator — liquid morphing state indicator.
   When `state` changes, the indicator briefly deforms like a settling droplet
   before resolving into its new colour/label. Purposeful transitions only.
   ------------------------------------------------------------------------ */

export interface LiquiIndicatorProps {
  /** Changing this value triggers the liquid settle morph. */
  state: string;
  label?: string;
  className?: string;
}

const stateDotClass: Record<string, string> = {
  running: "bg-brand-500",
  loading: "bg-brand-500",
  processing: "bg-brand-500",
  success: "bg-emerald-500",
  completed: "bg-emerald-500",
  paused: "bg-amber-500",
  error: "bg-red-500",
};

export function LiquiIndicator({ state, label, className }: LiquiIndicatorProps) {
  // Remounting on state change restarts the settle morph exactly once.
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span key={state} className="liqui-morph relative inline-flex size-2">
        <span className={cn("absolute inset-0 rounded-full", stateDotClass[state] ?? "bg-muted")} />
        <span
          aria-hidden
          className={cn("absolute inset-0 rounded-full opacity-40 blur-[3px]", stateDotClass[state] ?? "bg-muted")}
        />
      </span>
      {label && (
        <span key={`${state}-label`} className="text-[12px] font-medium text-muted">
          {label}
        </span>
      )}
      <span className="sr-only" role="status">
        {state}
      </span>
    </span>
  );
}
