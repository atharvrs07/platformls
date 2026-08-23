import type { CSSProperties } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "./section-heading";
import { cn } from "@/utils/cn";

interface Plan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start building.",
    features: [
      "1 workspace",
      "100 credits / month",
      "AI Chat access",
      "Community support",
      "Up to 3 projects",
    ],
    cta: "Start for free",
  },
  {
    name: "Pro",
    price: "$19",
    period: "per user / month",
    description: "For builders who need serious power.",
    features: [
      "Unlimited workspaces",
      "5,000 credits / month",
      "Flows & Agents",
      "Backend & Database",
      "Priority support",
    ],
    cta: "Start Pro trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "per user / month",
    description: "For teams shipping together.",
    features: [
      "Everything in Pro",
      "25,000 credits / month",
      "SSO & SCIM ready",
      "Advanced permissions",
      "Audit logs & analytics",
    ],
    cta: "Contact sales",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Simple pricing that scales with you</>}
          subtitle={
            <>
              Start free. Upgrade when you&apos;re ready. Every plan includes the full platform experience.
            </>
          }
        />

        <Reveal stagger className="mt-14">
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "liqui-primary reveal-child group relative flex flex-col overflow-hidden rounded-g3 p-7 liqui-lift",
                  plan.popular && "[box-shadow:inset_0_0_0_1px_rgb(99_102_241/0.35),var(--liqui-shadow-standard)]"
                )}
                style={{ "--reveal-delay": `${plans.indexOf(plan) * 130}ms` } as CSSProperties}
              >
                {plan.popular && (
                  <>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent opacity-60"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -left-1/3 top-0 h-[160%] w-1/4 animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      style={{ animationDelay: "2s" }}
                    />
                    <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                      <Sparkles className="size-3 animate-wiggle" />
                      Most popular
                    </span>
                  </>
                )}
                <h3 className="text-base font-semibold tracking-tight text-foreground">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-[13px] text-muted">/ {plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted">{plan.description}</p>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground/90">
                      <span
                        className={cn(
                          "flex size-4.5 items-center justify-center rounded-full transition-colors duration-300",
                          plan.popular ? "bg-brand-600/15 text-brand-600" : "bg-surface-hover text-muted"
                        )}
                      >
                        <Check className="size-3" strokeWidth={2.5} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex-1" />
                <Link href="/waitlist" className="block">
                  <Button variant={plan.popular ? "primary" : "secondary"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-8 space-y-1.5">
          <p className="text-center text-[13px] text-muted">
            The final pricing may differ after the launch of the actual product.
          </p>
          <p className="text-center text-[13px] text-muted">
            Need more?{" "}
            <a href={`mailto:${brand.emails.hello}`} className="font-medium text-brand-600 hover:underline">
              Talk to us about Enterprise
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
