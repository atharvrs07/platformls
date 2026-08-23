"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/utils/format";
import type { Project } from "@/types";

export function RecentActivity({ projects }: { projects: Project[] | null }) {
  return (
    <section>
      <h2 className="mb-4 text-[15px] font-semibold tracking-tight text-foreground">Recent activity</h2>

      <div className="liqui-primary rounded-g2">
        {projects && projects.length > 0 ? (
          <ul className="divide-y divide-border">
            {projects.slice(0, 5).map((project) => (
              <li key={project.id}>
                <div className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-subtle/60">
                  <span className="flex size-8 shrink-0 items-center justify-center liqui-minimal rounded-g1">
                    <Activity className="size-3.5 text-muted" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-foreground">{project.name}</p>
                    <p className="text-[12px] text-muted">Updated {formatRelativeTime(project.updatedAt)}</p>
                  </div>
                  <Badge variant="neutral" className="text-[11px]">
                    Project
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-5">
            <EmptyState
              compact
              icon={Activity}
              title="No activity yet"
              description="Your recent changes and project updates will show up here."
              action={
                <Link href="/settings" className="inline-flex items-center gap-1 text-[13px] font-medium text-brand-600 hover:underline">
                  Complete your profile
                  <ArrowUpRight className="size-3.5" />
                </Link>
              }
            />
          </div>
        )}
      </div>

      <div className="liqui-primary mt-4 rounded-g2 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13.5px] font-semibold tracking-tight text-foreground">Getting started</h3>
          <Badge variant="brand" className="text-[11px]">
            Phase 1
          </Badge>
        </div>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center gap-2.5 text-[13px] text-muted">
            <CheckCircle2 className="size-4 text-emerald-500" />
            Account created
          </li>
          <li className="flex items-center gap-2.5 text-[13px] text-muted">
            <span className="flex size-4 items-center justify-center rounded-full border-2 border-border" />
            Explore the dashboard
          </li>
          <li className="flex items-center gap-2.5 text-[13px] text-muted">
            <span className="flex size-4 items-center justify-center rounded-full border-2 border-border" />
            Create your first project
          </li>
          <li className="flex items-center gap-2.5 text-[13px] text-muted">
            <span className="flex size-4 items-center justify-center rounded-full border-2 border-border" />
            Watch upcoming modules
          </li>
        </ul>
      </div>
    </section>
  );
}
