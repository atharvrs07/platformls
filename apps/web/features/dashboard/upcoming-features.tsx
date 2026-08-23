import { Check } from "lucide-react";
import { comingSoonModules } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

const roadmap = [
  {
    phase: "Phase 1",
    title: "Foundation",
    items: ["Accounts & auth", "Dashboard", "Settings", "Billing"],
    status: "live",
  },
  {
    phase: "Phase 2",
    title: "Intelligence",
    items: ["AI Chat", "Workflow Flows"],
    status: "next",
  },
  {
    phase: "Phase 3",
    title: "Automation",
    items: ["AI Agents", "Voice Studio"],
    status: "later",
  },
  {
    phase: "Phase 4",
    title: "Infrastructure",
    items: ["Backend", "Database", "Storage", "Integrations"],
    status: "later",
  },
] as const;

const statusStyles = {
  live: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  next: "bg-brand-600/10 text-brand-700 border-brand-600/20 dark:text-brand-300",
  later: "bg-surface-hover text-muted border-border",
};

export function UpcomingFeatures() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Upcoming modules</h2>
        <Badge variant="brand" className="text-[11px]">
          Roadmap
        </Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {comingSoonModules.map((module) => (
          <div
            key={module.href}
            className="liqui-primary liqui-lift group flex items-start gap-4 rounded-g2 p-5"
          >
            <span className="liqui-minimal flex size-10 shrink-0 items-center justify-center rounded-g1 transition-colors duration-300 group-hover:bg-brand-600/20">
              <module.icon className="size-5 text-brand-600" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold tracking-tight text-foreground">{module.title}</h3>
                <Badge variant="neutral" className="px-1.5 py-0 text-[10px]">
                  Soon
                </Badge>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{module.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="grid min-w-[720px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((step, i) => (
            <div key={step.phase} className="liqui-secondary relative rounded-g2 p-5">
              {i < roadmap.length - 1 && (
                <span aria-hidden className="absolute -right-3 top-1/2 hidden h-px w-3 bg-border lg:block" />
              )}
              <div className="flex items-center justify-between">
                <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize", statusStyles[step.status])}>
                  {step.status === "live" ? (
                    <>
                      <Check className="size-3" /> Live
                    </>
                  ) : (
                    step.status
                  )}
                </span>
                <span className="text-[11px] font-medium text-muted">{step.phase}</span>
              </div>
              <h3 className="mt-3 text-[14px] font-semibold tracking-tight text-foreground">{step.title}</h3>
              <ul className="mt-2.5 space-y-1.5">
                {step.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[12.5px] text-muted">
                    <span className={cn("size-1 rounded-full", step.status === "live" ? "bg-emerald-500" : "bg-border")} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
