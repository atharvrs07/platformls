"use client";

import { Coins, FolderOpen, Layers, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";
import type { Project } from "@/types";

interface StatCardsProps {
  projects: Project[] | null;
}

export function StatCards({ projects }: StatCardsProps) {
  const { bundle } = useAuth();
  const credits = bundle?.credits;
  const plan = bundle?.subscription?.plan ?? "FREE";

  const stats = [
    {
      label: "Credit balance",
      value: credits ? credits.balance.toLocaleString() : null,
      suffix: "credits",
      icon: Coins,
      tone: "text-amber-500 bg-amber-500/10",
    },
    {
      label: "Subscription",
      value: plan.charAt(0) + plan.slice(1).toLowerCase(),
      suffix: "plan",
      icon: Layers,
      tone: "text-brand-600 bg-brand-600/10",
    },
    {
      label: "Projects",
      value: projects ? String(projects.length) : null,
      suffix: projects && projects.length === 1 ? "project" : "projects",
      icon: FolderOpen,
      tone: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "Workspace modules",
      value: "8",
      suffix: "coming soon",
      icon: Zap,
      tone: "text-violet-500 bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="liqui-primary liqui-lift rounded-g2 p-4 sm:p-5"
        >
          <div className="flex items-center justify-between">
            <span className={cn("liqui-minimal flex size-9 items-center justify-center rounded-g1", stat.tone)}>
              <stat.icon className="size-4.5" strokeWidth={1.75} />
            </span>
          </div>
          <div className="mt-4">
            {stat.value ? (
              <p className="text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
            ) : (
              <Skeleton className="h-7 w-16" />
            )}
            <p className="mt-0.5 text-[13px] text-muted">
              {stat.label} · {stat.suffix}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
