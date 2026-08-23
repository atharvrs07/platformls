import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  MessageSquare,
  GitBranch,
  Bot,
  Server,
  Database,
  Cloud,
  Plug,
  Mic,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

const moduleIcons: LucideIcon[] = [MessageSquare, GitBranch, Bot, Mic, Puzzle, Server, Database, Cloud, Plug];

const floatingChips: { icon: LucideIcon; label: string; className: string }[] = [
  { icon: MessageSquare, label: "AI Chat", className: "-left-6 top-16 lg:left-4" },
  { icon: GitBranch, label: "Flows", className: "-right-6 top-36 lg:right-0" },
  { icon: Bot, label: "Agents", className: "-left-10 bottom-36 lg:left-8" },
  { icon: Mic, label: "Voice", className: "-right-10 bottom-24 lg:right-6" },
];

function ProductPreview() {
  const bars = [40, 70, 50, 90, 60, 78, 52];
  return (
    <div className="relative mx-auto mt-16 w-full max-w-5xl">
      <div
        aria-hidden
        className="absolute -inset-x-8 -top-12 bottom-0 rounded-[40px] opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, ${brand.accent.from}22, transparent 70%)`,
        }}
      />

      {floatingChips.map((chip) => (
        <div key={chip.label} className={`absolute z-20 hidden lg:flex ${chip.className}`}>
          <div className="liqui-minimal flex items-center gap-2 rounded-full px-3.5 py-2 shadow-sm">
            <chip.icon className="size-4 text-brand-600" strokeWidth={1.75} />
            <span className="text-[12.5px] font-medium text-foreground/80">{chip.label}</span>
          </div>
        </div>
      ))}

      <Reveal variant="zoom" className="relative">
        <div className="liqui-primary liqui-clip-content rounded-g3">
          <div className="flex items-center gap-2 px-4 py-3 [box-shadow:inset_0_-1px_0_rgb(148_163_184/0.12)]">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
            <div className="liqui-minimal ml-4 hidden h-6 max-w-md flex-1 items-center rounded-g1 px-3 text-[11px] text-muted sm:flex">
              {brand.domains.platform}/dashboard
              <span className="ml-1 inline-block w-px animate-caret self-stretch bg-brand-500" />
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="size-1.5 animate-ping-slow rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
          </div>

          <div className="flex">
            <div className="hidden w-44 shrink-0 p-3 [box-shadow:inset_-1px_0_0_rgb(148_163_184/0.1)] sm:block">
              <div className="mb-3 flex items-center gap-2 px-2">
                <span className="size-4 rounded-md bg-brand-600" />
                <span className="h-2 w-14 animate-pulse-soft rounded-full bg-surface-hover" />
              </div>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`mb-1.5 flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? "bg-surface shadow-sm" : ""}`}
                >
                  {i === 0 ? (
                    <span className="size-3.5 rounded bg-brand-600" />
                  ) : (
                    <span className="size-3.5 rounded bg-surface-hover" />
                  )}
                  <span className={`h-2 rounded-full ${i === 0 ? "w-16 bg-foreground/80" : "w-12 bg-surface-hover"}`} />
                </div>
              ))}
            </div>

            <div className="flex-1 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3.5 w-32 rounded-full bg-surface-hover" />
                  <div className="mt-2 h-2 w-48 rounded-full bg-surface-hover" />
                </div>
                <span className="rounded-full bg-brand-600/10 px-2.5 py-1 text-[10px] font-medium text-brand-700 dark:text-brand-300">
                  Welcome back
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[0, 1, 2].map((col) => (
                  <div key={col} className="liqui-minimal rounded-g1 p-3">
                    <div className="h-2 w-10 rounded-full bg-surface-hover" />
                    <div className="mt-2 h-3.5 w-16 rounded-full bg-foreground/70" />
                    <div className="mt-2 flex h-9 origin-bottom items-end gap-1">
                      {bars.map((h, j) => (
                        <span
                          key={j}
                          className="w-2 animate-grow-bar rounded-sm bg-brand-500/60"
                          style={{ height: h / 3, animationDelay: `${col * 180 + j * 90}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="liqui-minimal rounded-g1 p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-brand-600/10">
                      <GitBranch className="size-3.5 text-brand-600" />
                    </span>
                    <span className="h-2 w-12 rounded-full bg-surface-hover" />
                  </div>
                  <div className="mt-3 h-2 w-24 rounded-full bg-surface-hover" />
                  <div className="mt-1.5 h-2 w-16 rounded-full bg-surface-hover" />
                </div>
                <div className="liqui-minimal rounded-g1 p-4">
                  <div className="flex items-center justify-between">
                    <span className="h-2 w-10 rounded-full bg-surface-hover" />
                    <span className="size-1.5 animate-pulse-soft rounded-full bg-emerald-500" />
                  </div>
                  <div className="mt-3 h-2 w-20 rounded-full bg-surface-hover" />
                  <div className="mt-1.5 h-2 w-14 rounded-full bg-surface-hover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-36 pb-10 sm:px-8 sm:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-50" />
        {/* Still ambient light — calm, motionless, spatial */}
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-white/60 blur-[120px]" />
        <div className="absolute left-[10%] top-44 size-72 rounded-full bg-sky-200/25 blur-[110px]" />
        <div className="absolute right-[6%] top-24 size-80 rounded-full bg-indigo-200/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal stagger>
          <div
            className="liqui-primary reveal-child mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-muted"
            style={{ "--reveal-delay": "0ms" } as CSSProperties}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 animate-ping-slow rounded-full bg-brand-500" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-600" />
            </span>
            <Sparkles className="size-3.5 text-brand-600" />
            The all-in-one AI workspace
            <span className="rounded-full bg-brand-600/10 px-1.5 text-[11px] font-semibold text-brand-700 dark:text-brand-300">
              Phase 1
            </span>
          </div>

          <h1
            className="reveal-child text-[42px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            Build.
            <br />
            Automate.
            <br />
            <span className="text-gradient-animated">Create.</span>
          </h1>

          <p
            className="reveal-child mx-auto mt-6 max-w-xl text-lg font-medium tracking-tight text-foreground/90"
            style={{ "--reveal-delay": "240ms" } as CSSProperties}
          >
            One workspace. Infinite possibilities.
          </p>

          <p
            className="reveal-child mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted"
            style={{ "--reveal-delay": "340ms" } as CSSProperties}
          >
            {brand.longDescription}
          </p>

          <div
            className="reveal-child mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ "--reveal-delay": "440ms" } as CSSProperties}
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="group relative w-full overflow-hidden sm:w-auto">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                <span className="relative">Get Started</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/docs" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <BookOpen className="size-4" />
                View Documentation
              </Button>
            </Link>
          </div>

          <p
            className="reveal-child mt-5 text-[13px] text-muted"
            style={{ "--reveal-delay": "540ms" } as CSSProperties}
          >
            Free to start · No credit card required · 100 welcome credits
          </p>
        </Reveal>
      </div>

      <ProductPreview />

      <Reveal stagger className="relative mx-auto mt-14 max-w-4xl">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-medium text-muted">
          <span className="reveal-child text-foreground/50" style={{ "--reveal-delay": "0ms" } as CSSProperties}>
            Everything your team needs:
          </span>
          {moduleIcons.map((Icon, i) => (
            <span
              key={i}
              className="reveal-child flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:text-foreground"
              style={{ "--reveal-delay": `${80 + i * 70}ms` } as CSSProperties}
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
          ))}
          <span
            className="reveal-child text-foreground/50"
            style={{ "--reveal-delay": `${80 + moduleIcons.length * 70}ms` } as CSSProperties}
          >
            in one place.
          </span>
        </div>
      </Reveal>
    </section>
  );
}
