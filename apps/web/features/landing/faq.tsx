"use client";

import { useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { brand } from "@/config/brand";
import { Reveal } from "@/components/reveal";
import { cn } from "@/utils/cn";

const faqs = [
  {
    question: `What is ${brand.name}?`,
    answer: `${brand.name} is an all-in-one AI workspace that combines AI chat, workflow automation, agents, backend services, databases, storage, voice and integrations into a single platform. Instead of stitching together many tools, you get one coherent workspace.`,
  },
  {
    question: "When will the different modules be available?",
    answer:
      "We're building in phases. Phase 1 — the foundation — includes accounts, secure authentication, a premium dashboard and settings. AI Chat, Flows, Agents, Voice Studio, Backend, Database, Storage and Integrations will follow in subsequent releases.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. The Free plan includes a personal workspace, 100 monthly credits and access to AI Chat when it launches — no credit card required.",
  },
  {
    question: "How do credits work?",
    answer:
      "Credits power compute-heavy features like AI conversations, agent runs and voice synthesis. You receive credits with your plan, and you can top up at any time.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is core to our architecture. Data is encrypted in transit and at rest, sessions are managed with short-lived tokens, and the platform is designed with enterprise-grade permissions and audit logging in mind.",
  },
  {
    question: "Can I migrate to a team workspace later?",
    answer:
      "Absolutely. The workspace system is designed for teams from day one — invite members, assign roles and create shared workspaces whenever you're ready.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 px-5 py-24 sm:px-8">
      <Reveal stagger className="mx-auto max-w-3xl">
        <div className="text-center">
          <span
            className="reveal-child text-[13px] font-semibold uppercase tracking-widest text-brand-600"
            style={{ "--reveal-delay": "0ms" } as CSSProperties}
          >
            FAQ
          </span>
          <h2
            className="reveal-child mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={{ "--reveal-delay": "90ms" } as CSSProperties}
          >
            Frequently asked questions
          </h2>
          <p
            className="reveal-child mt-4 text-base text-muted"
            style={{ "--reveal-delay": "180ms" } as CSSProperties}
          >
            Everything you need to know about the platform. Can&apos;t find an answer?{" "}
            <a href={`mailto:${brand.emails.support}`} className="font-medium text-brand-600 hover:underline">
              Contact support
            </a>
            .
          </p>
        </div>

        <div
          className="liqui-primary reveal-child mt-12 divide-y divide-border-subtle rounded-g3"
          style={{ "--reveal-delay": "260ms" } as CSSProperties}
        >
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-subtle/50"
                  aria-expanded={open}
                >
                  <span className="text-[15px] font-medium tracking-tight text-foreground">{faq.question}</span>
                  <ChevronDown
                    className={cn("size-4 shrink-0 text-muted transition-transform duration-300", open && "rotate-180")}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
