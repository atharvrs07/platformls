"use client";

import { CreditCard, FileText, Receipt, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import { brand } from "@/config/brand";
import { cn } from "@/utils/cn";
import type { Plan, SubscriptionStatus } from "@/types";

const PLAN_NAMES: Record<Plan, string> = { FREE: "Free", PRO: "Pro", TEAM: "Team", ENTERPRISE: "Enterprise" };
const STATUS_META: Record<SubscriptionStatus, { label: string; variant: "success" | "neutral" | "warning" | "danger" }> = {
  TRIALING: { label: "Trial", variant: "success" },
  ACTIVE: { label: "Active", variant: "success" },
  PAST_DUE: { label: "Past due", variant: "warning" },
  CANCELED: { label: "Canceled", variant: "neutral" },
  INCOMPLETE: { label: "Incomplete", variant: "danger" },
};

const UPGRADES = [
  {
    plan: "Pro",
    price: "$19",
    period: "per user / month",
    features: ["5,000 credits / month", "Flows & Agents", "Backend & Database", "Priority support"],
    popular: true,
  },
  {
    plan: "Team",
    price: "$49",
    period: "per user / month",
    features: ["25,000 credits / month", "SSO & SCIM ready", "Advanced permissions", "Audit logs"],
    popular: false,
  },
] as const;

export function BillingView() {
  const { bundle } = useAuth();
  const subscription = bundle?.subscription;
  const credits = bundle?.credits;

  const plan = PLAN_NAMES[subscription?.plan ?? "FREE"];
  const status = subscription ? STATUS_META[subscription.status] : null;
  const percent = credits ? Math.min(100, Math.round((credits.balance / Math.max(credits.lifetime, 1)) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Current plan</CardTitle>
                <CardDescription>Your {brand.name} subscription.</CardDescription>
              </div>
              <Badge variant="brand" className="text-[11px]">
                {plan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {status && (
              <Badge variant={status.variant} className="text-[11px]">
                {status.label}
              </Badge>
            )}
            {subscription?.currentPeriodEnd && subscription.status !== "CANCELED" && (
              <p className="text-[12.5px] text-muted">
                {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"} on {formatDate(subscription.currentPeriodEnd)}
              </p>
            )}
            {subscription?.cancelAtPeriodEnd && (
              <p className="text-[12.5px] text-amber-600 dark:text-amber-400">
                Your subscription is set to cancel at the end of the period.
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" disabled>
                Manage plan
              </Button>
              <Button size="sm" variant="outline" disabled>
                Invoices
              </Button>
            </div>
            <p className="text-[12px] text-muted">Billing & payments arrive in a future phase.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Credits</CardTitle>
                <CardDescription>Credits power every AI module across {brand.name}.</CardDescription>
              </div>
              <Zap className="size-5 text-brand-600" strokeWidth={1.75} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight text-foreground">
                {credits ? credits.balance.toLocaleString() : "—"}
              </span>
              <span className="text-sm text-muted">credits available</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
              <div
                className={cn("h-full rounded-full bg-brand-600 transition-all", percent >= 90 && "bg-amber-500")}
                style={{ width: `${Math.max(percent, 4)}%` }}
              />
            </div>
            {credits && (
              <p className="text-[12.5px] text-muted">
                {credits.lifetime.toLocaleString()} credits earned in total ·{" "}
                <span className="text-foreground/80">{percent}%</span> remaining
              </p>
            )}
            <Button size="sm" variant="outline" disabled>
              Buy credits
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade</CardTitle>
          <CardDescription>Unlock more credits and every module as they launch.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {UPGRADES.map((upgrade) => (
              <div
                key={upgrade.plan}
                className={cn(
                  "flex flex-col rounded-2xl border bg-surface-subtle/40 p-5",
                  upgrade.popular && "border-brand-600/40 ring-1 ring-brand-600/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{upgrade.plan}</h3>
                  {upgrade.popular && (
                    <Badge variant="brand" className="text-[10px]">
                      <Sparkles className="mr-1 size-2.5" />
                      Most popular
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold tracking-tight text-foreground">{upgrade.price}</span>
                  <span className="text-[12px] text-muted">/ {upgrade.period}</span>
                </div>
                <ul className="mt-4 flex flex-col gap-1.5 text-[13px] text-muted">
                  {upgrade.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-brand-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex-1" />
                <Button className="mt-5" variant={upgrade.popular ? "primary" : "secondary"} disabled>
                  Coming soon
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing history</CardTitle>
          <CardDescription>Payment methods, invoices and receipts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-surface-hover">
              <FileText className="size-5 text-muted" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">No invoices yet</p>
              <p className="text-[12.5px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Receipt className="size-3.5" />
                  Payments will appear here once billing launches.
                </span>
              </p>
            </div>
            <Button size="sm" variant="outline" disabled>
              <CreditCard className="mr-2 size-3.5" />
              Manage payment methods
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
