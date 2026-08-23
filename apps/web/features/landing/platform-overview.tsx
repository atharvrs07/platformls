import type { CSSProperties } from "react";
import { MessageSquare, GitBranch, Bot, Mic, Plug, Check, Loader2, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "./section-heading";
import { cn } from "@/utils/cn";

function ChatVisual() {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex max-w-[80%] items-start gap-2 tile-anim animate-fade-up" style={{ animationDelay: "0ms" }}>
        <span className="mt-1 size-5 shrink-0 rounded-md bg-brand-600" />
        <div className="liqui-minimal rounded-g1 rounded-tl-[0.25rem] px-3 py-2">
          <p className="text-[11px] leading-relaxed text-muted">Summarize this quarter&apos;s metrics for me.</p>
        </div>
      </div>
      <div className="flex max-w-[85%] items-start gap-2 tile-anim animate-fade-up" style={{ animationDelay: "240ms" }}>
        <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-md bg-brand-600/15 text-[9px] font-bold text-brand-600">
          AI
        </span>
        <div className="liqui-minimal rounded-g1 rounded-tl-[0.25rem] px-3 py-2">
          <div className="flex gap-1 pb-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-bounce-soft rounded-full bg-brand-500"
                style={{ animationDelay: `${i * 140}ms` }}
              />
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-muted">
            Revenue is up 24% QoQ. Strongest growth in the APAC region. I&apos;ve drafted a full summary for you.
          </p>
        </div>
      </div>
    </div>
  );
}

function FlowsVisual() {
  return (
    <div className="mt-6 flex items-center justify-between rounded-xl border border-dashed border-border bg-surface-subtle/50 px-4 py-5">
      {["Webhook", "Filter", "Enrich", "Notify"].map((step, i) => (
        <div key={step} className="flex flex-1 items-center">
          <span
            className={cn(
              "tile-anim animate-scale-in whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[10.5px] font-medium",
              i < 3
                ? "border-brand-600/30 bg-brand-600/10 text-brand-700 dark:text-brand-300"
                : "liqui-minimal rounded-g1 text-muted"
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {step}
          </span>
          {i < 3 && (
            <div className="relative mx-1.5 h-px flex-1 bg-border">
              <span
                className="absolute -top-[3px] size-1.5 animate-dash-dot rounded-full bg-brand-500"
                style={{ animationDelay: `${i * 650}ms` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AgentsVisual() {
  const tasks = [
    { label: "Research competitor pricing", done: true },
    { label: "Draft comparison report", done: true },
    { label: "Share with team", done: false },
  ];
  return (
    <div className="mt-6 space-y-2">
      {tasks.map((task, i) => (
        <div
          key={task.label}
          className="liqui-minimal tile-anim animate-fade-up flex items-center gap-2.5 rounded-g1 px-3 py-2"
          style={{ animationDelay: `${i * 140}ms` }}
        >
          {task.done ? (
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-brand-600 bg-brand-600">
              <Check className="size-2.5 text-white" strokeWidth={3.5} />
            </span>
          ) : (
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-border">
              <Loader2 className="size-3 animate-spin text-muted" />
            </span>
          )}
          <span className="text-[11px] text-muted">{task.label}</span>
        </div>
      ))}
    </div>
  );
}

function VoiceVisual() {
  return (
    <div className="liqui-minimal mt-6 flex h-16 items-center gap-[3px] overflow-hidden rounded-g1 px-4">
      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom animate-voice-bar rounded-full bg-brand-500/70"
          style={{
            height: `${20 + Math.abs(Math.sin(i * 0.55)) * 60}%`,
            animationDelay: `${(i % 9) * 110}ms`,
            animationDuration: `${0.9 + (i % 5) * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function IntegrationsVisual() {
  const tools = ["Slack", "GitHub", "Stripe", "Notion", "Linear", "Supabase", "Vercel", "Twilio"];
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {tools.map((name, i) => (
        <span
          key={name}
          className="liqui-minimal tile-anim animate-scale-in rounded-full px-2.5 py-1.5 text-[11px] font-medium text-muted transition-colors hover:text-foreground"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          {name}
        </span>
      ))}
    </div>
  );
}

interface ModuleTile {
  icon: LucideIcon;
  title: string;
  tagline: string;
  span: string;
  visual: () => React.ReactElement;
}

const modules: ModuleTile[] = [
  {
    icon: MessageSquare,
    title: "AI Chat",
    tagline: "A single assistant that understands your entire workspace.",
    span: "lg:col-span-2",
    visual: ChatVisual,
  },
  {
    icon: GitBranch,
    title: "Workflow Flows",
    tagline: "Drag, connect, automate. From trigger to action in minutes.",
    span: "lg:col-span-2",
    visual: FlowsVisual,
  },
  {
    icon: Bot,
    title: "AI Agents",
    tagline: "Autonomous workers with goals, memory and tools.",
    span: "lg:col-span-2",
    visual: AgentsVisual,
  },
  {
    icon: Mic,
    title: "Voice Studio",
    tagline: "Expressive, production-ready speech for every use case.",
    span: "lg:col-span-3",
    visual: VoiceVisual,
  },
  {
    icon: Plug,
    title: "Integrations",
    tagline: "The tools you love, connected in a few clicks.",
    span: "lg:col-span-3",
    visual: IntegrationsVisual,
  },
];

export function PlatformOverview() {
  return (
    <section id="platform" className="relative scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Platform Overview"
          title={<>A workspace that grows with you</>}
          subtitle={
            <>
              Every module is being designed to work together — one login, one data layer, one consistent experience.
            </>
          }
        />

        <Reveal stagger className="mt-14">
          <div className="grid gap-4 lg:grid-cols-6">
            {modules.map((module, index) => (
              <div
                key={module.title}
                className={cn(
                  "liqui-primary reveal-child group rounded-g3 p-6 liqui-lift sm:p-7",
                  module.span
                )}
                style={{ "--reveal-delay": `${index * 120}ms` } as CSSProperties}
              >
                <div className="flex items-start justify-between">
                  <span className="liqui-minimal flex size-10 items-center justify-center rounded-g1 transition-colors duration-300 group-hover:bg-brand-600/20">
                    <module.icon className="size-5 text-brand-600" strokeWidth={1.75} />
                  </span>
                  <Badge variant="brand" className="text-[11px]">
                    Coming soon
                  </Badge>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{module.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{module.tagline}</p>
                <module.visual />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
