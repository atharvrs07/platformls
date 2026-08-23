"use client";

import { useCallback, useEffect, useState } from "react";
import { WelcomeBanner } from "@/features/dashboard/welcome";
import { StatCards } from "@/features/dashboard/stat-cards";
import { QuickActions } from "@/features/dashboard/quick-actions";
import { RecentActivity } from "@/features/dashboard/recent-activity";
import { UpcomingFeatures } from "@/features/dashboard/upcoming-features";
import { useAuth } from "@/hooks/use-auth";
import { workspaceApi } from "@/services/api.endpoints";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/types";

export default function DashboardHome() {
  const { bundle } = useAuth();
  const workspaceId = bundle?.workspace?.id;
  const [projects, setProjects] = useState<Project[] | null>(null);

  const loadProjects = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const data = await workspaceApi.projects(workspaceId);
      setProjects(data.projects);
    } catch {
      setProjects([]);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <WelcomeBanner />

      <StatCards projects={projects} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <QuickActions onProjectCreated={() => void loadProjects()} />
        </div>
        <div className="lg:col-span-3">
          {projects === null ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-36" />
              <div className="liqui-primary rounded-g2 p-6">
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ) : (
            <RecentActivity projects={projects} />
          )}
        </div>
      </div>

      <UpcomingFeatures />
    </div>
  );
}
