import type { CSSProperties } from "react";
import { MessageSquare, GitBranch, Bot, Server, Database, Cloud, Mic, Plug, Braces, type LucideIcon } from "lucide-react";
import { brand } from "@/config/brand";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "./section-heading";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
}

const features: Feature[] = [
  {
    icon: MessageSquare,
    title: "AI Chat",
    description: "Conversational intelligence with memory, context and tool use, available across your entire workspace.",
  },
  {
    icon: GitBranch,
    title: "Workflow Flows",
    description: "Visual automation that connects apps, data and logic — trigger, transform and act without code.",
  },
  {
    icon: Bot,
    title: "AI Agents",
    description: "Autonomous agents that plan and execute multi-step tasks with full visibility and control.",
  },
  {
    icon: Server,
    title: "Backend Services",
    description: "Serverless functions, realtime sockets and edge infrastructure that scale with your product.",
  },
  {
    icon: Database,
    title: "Managed Database",
    description: "Postgres provisioned in seconds — with backups, observability and point-in-time recovery.",
  },
  {
    icon: Cloud,
    title: "Object Storage",
    description: "Durable storage with signed URLs and CDN edge delivery for files of any size.",
  },
  {
    icon: Mic,
    title: "Voice Studio",
    description: "Generate and synthesize natural, expressive speech for assistants, apps and content.",
  },
  {
    icon: Plug,
    title: "Integrations",
    description: "Connect the tools your team already uses with one-click, secure, reversible integrations.",
  },
  {
    icon: Braces,
    title: "Developer Tools",
    description: "A complete API surface with keys, SDKs, logs and dashboards for building at speed.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Features"
          title={<>Everything your product needs, in one workspace</>}
          subtitle={
            <>
              {brand.name} brings the tools you&apos;d normally glue together into a single, cohesive platform — so you
              can focus on building.
            </>
          }
        />

        <Reveal stagger className="mt-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="liqui-primary reveal-child group relative overflow-hidden rounded-g2 p-6 liqui-lift"
                style={{ "--reveal-delay": `${i * 70}ms` } as CSSProperties}
              >
                <span className="liqui-minimal flex size-11 items-center justify-center rounded-g1 transition-all duration-300 group-hover:bg-brand-600/10">
                  <feature.icon className="size-5 text-foreground transition-colors duration-300 group-hover:text-brand-600" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
