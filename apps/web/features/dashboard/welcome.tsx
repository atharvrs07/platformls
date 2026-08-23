"use client";

import { CalendarDays } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { brand } from "@/config/brand";

export function WelcomeBanner() {
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "there";

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="liqui-deep liqui-clip-content relative rounded-g3 p-7 sm:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-8 h-24 opacity-40"
        style={{
          background: "radial-gradient(60% 100% at 30% 0%, rgba(255,255,255,0.14), transparent 75%)",
        }}
      />
      <div className="relative">
        <p className="flex items-center gap-2 text-[13px] font-medium text-white/70">
          <CalendarDays className="size-3.5" />
          {today}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
          Your workspace is ready. AI, flows, agents and infrastructure are all coming together — here&apos;s what&apos;s
          available today.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
            <span className="size-1.5 animate-pulse-soft rounded-full bg-emerald-300" />
            Phase 1 · {brand.name} foundation live
          </span>
        </div>
      </div>
    </div>
  );
}
