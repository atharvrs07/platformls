import type { CSSProperties } from "react";
import { Rocket, ShieldCheck, TrendingUp, Code2, type LucideIcon } from "lucide-react";
import { brand } from "@/config/brand";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    icon: Rocket,
    title: "Move at the speed of thought",
    description:
      "Everything lives in one workspace. No context switching, no glue code, no jumping between ten tools to ship one feature.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "End-to-end encryption, granular permissions, SSO-ready architecture and full audit trails from day one.",
  },
  {
    icon: TrendingUp,
    title: "Built to scale with you",
    description:
      "From side project to enterprise. Our architecture is designed so every module grows without re-platforming.",
  },
  {
    icon: Code2,
    title: "Made for developers",
    description:
      "Clean APIs, SDKs, webhooks and docs. When you outgrow the UI, the platform is still there for you.",
  },
];

const stats = [
  { to: 9, suffix: "+", label: "Integrated modules" },
  { to: 100, suffix: "", label: "Welcome credits" },
  { to: 1, suffix: "", label: "Login for everything" },
];

export function WhyLiquiLink() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(45% 40% at 85% 20%, ${"#4f46e5"}0d, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <span className="text-[13px] font-semibold uppercase tracking-widest text-brand-600">Why {brand.name}</span>
            <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              One platform.
              <br />
              Zero friction.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Most teams stitch together ten different tools. {brand.name} replaces the patchwork with a single,
              coherent workspace — so your focus goes to the product, not the plumbing.
            </p>
          </Reveal>

          <Reveal stagger className="mt-10">
            <div className="grid max-w-md grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="liqui-secondary reveal-child rounded-g2 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                  style={{ "--reveal-delay": `${i * 120}ms` } as CSSProperties}
                >
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    <CountUp to={stat.to} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal stagger>
          <div className="flex flex-col gap-3">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="liqui-primary reveal-child group flex gap-5 rounded-g2 p-6 liqui-lift"
                style={{ "--reveal-delay": `${i * 110}ms` } as CSSProperties}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-subtle transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-brand-600/30 group-hover:bg-brand-600/10">
                  <pillar.icon
                    className="size-5 text-foreground transition-colors duration-300 group-hover:text-brand-600"
                    strokeWidth={1.75}
                  />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
