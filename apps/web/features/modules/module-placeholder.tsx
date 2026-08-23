"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { modules } from "@/config/modules";

export function ModulePlaceholder({ moduleId }: { moduleId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const module = modules[moduleId];
  const [email, setEmail] = useState(user?.email ?? "");
  const [joined, setJoined] = useState(false);

  if (!module) return null;

  function handleNotify(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Enter a valid email", variant: "error" });
      return;
    }
    setJoined(true);
    toast({
      title: `You're on the list`,
      description: `We'll let you know when ${module.title} launches.`,
      variant: "success",
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="liqui-primary liqui-clip-content relative rounded-g3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60"
          style={{
            background: `radial-gradient(60% 100% at 50% 0%, ${"#4f46e5"}14, transparent 80%)`,
          }}
        />

        <div className="relative flex flex-col items-center px-6 py-12 text-center sm:py-16">
          <span className="liqui-minimal flex size-16 items-center justify-center rounded-g3">
            <module.icon className="size-7 text-brand-600" strokeWidth={1.5} />
          </span>

          <div className="mt-5 flex items-center gap-2">
            <Badge variant="brand" className="text-[11px]">
              <Sparkles className="size-3" />
              {module.availability}
            </Badge>
            <Badge variant="neutral" className="text-[11px]">
              {module.phase}
            </Badge>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {module.title}
          </h1>
          <p className="mt-2 text-[15px] font-medium text-muted">{module.short}</p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">{module.description}</p>

          <ul className="mt-8 grid w-full max-w-2xl gap-2.5 text-left sm:grid-cols-2">
            {module.features.map((feature) => (
              <li key={feature} className="liqui-minimal flex items-start gap-2.5 rounded-g1 px-4 py-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" />
                <span className="text-[13.5px] text-foreground/90">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 w-full max-w-md">
            {joined ? (
              <div className="liqui-minimal flex items-center justify-center gap-2 rounded-g2 bg-emerald-500/10 px-4 py-3.5 text-sm font-medium text-emerald-700 [box-shadow:inset_0_0_0_1px_rgb(16_185_129/0.25)] dark:text-emerald-400 animate-fade-in">
                <CheckCircle2 className="size-4" />
                You&apos;re on the list for {module.title}.
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex flex-col gap-2.5 sm:flex-row">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  aria-label="Email for updates"
                />
                <Button type="submit">
                  <Bell className="size-4" />
                  Notify me
                </Button>
              </form>
            )}
            <p className="mt-3 text-[12px] text-muted">
              Be first in line. No spam — only product updates.
            </p>
          </div>
        </div>
      </div>

      <div className="liqui-secondary mt-6 flex flex-col items-center justify-between gap-4 rounded-g2 px-6 py-5 sm:flex-row">
        <div>
          <p className="text-sm font-medium text-foreground">Explore what&apos;s available today</p>
          <p className="text-[13px] text-muted">
            Manage your workspace, profile, billing and settings right now.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          Go to dashboard
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
