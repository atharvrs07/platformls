"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  Clock,
  Coins,
  Database,
  FolderKanban,
  KeyRound,
  Loader2,
  ScrollText,
  Server,
  ShieldCheck,
  Users,
  UsersRound,
} from "lucide-react";
import { adminApi } from "@/services/api.endpoints";
import type { AdminOverview, AdminUser, WaitlistEntry } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2.5">
        <span className="liqui-minimal flex size-8 items-center justify-center rounded-g1">
          <Icon className="size-4 text-brand-600" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
          <p className="truncate text-lg font-semibold tracking-tight text-foreground">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export function AdminView() {
  const router = useRouter();
  const { user, status } = useAuth();
  const { toast } = useToast();

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [status, isAdmin, router]);

  const load = useCallback(async () => {
    try {
      const [ov, us, wl] = await Promise.all([adminApi.overview(), adminApi.users(), adminApi.waitlist()]);
      setOverview(ov);
      setUsers(us.users);
      setEntries(wl.entries);
    } catch {
      toast({ title: "Failed to load admin data", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAdmin && status === "authenticated") void load();
  }, [isAdmin, status, load]);

  async function toggleUserActive(target: AdminUser) {
    setBusyId(target.id);
    try {
      await adminApi.setUserActive(target.id, !target.isActive);
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, isActive: !u.isActive } : u)));
      toast({ title: `Account ${!target.isActive ? "activated" : "deactivated"}`, variant: "success" });
    } catch {
      toast({ title: "Action failed", variant: "error" });
    } finally {
      setBusyId(null);
    }
  }

  async function setEntryStatus(entry: WaitlistEntry, grant: boolean) {
    setBusyId(entry.id);
    try {
      if (grant) {
        await adminApi.grant(entry.id);
      } else {
        await adminApi.revoke(entry.id);
      }
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? { ...e, status: grant ? "GRANTED" : "PENDING", grantedAt: grant ? new Date().toISOString() : null }
            : e
        )
      );
      toast({
        title: grant ? `${entry.email} can now register` : `Beta access revoked for ${entry.email}`,
        variant: "success",
      });
    } catch {
      toast({ title: "Action failed", variant: "error" });
    } finally {
      setBusyId(null);
    }
  }

  if (loading || status !== "authenticated" || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
          <ShieldCheck className="size-6 text-brand-600" />
          Admin Panel
        </h1>
        <p className="mt-1 text-sm text-muted">Everything happening across the platform — users, credits and the beta waitlist.</p>
      </div>

      {overview && (
        <section aria-label="Platform overview" className="space-y-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
            <StatCard icon={Users} label="Users" value={overview.users.total} />
            <StatCard icon={BadgeCheck} label="Verified" value={overview.users.verified} />
            <StatCard icon={UsersRound} label="Admins" value={overview.users.admins} />
            <StatCard icon={FolderKanban} label="Workspaces" value={overview.workspaces} />
            <StatCard icon={Database} label="Projects" value={overview.projects} />
            <StatCard icon={Server} label="Active sessions" value={overview.sessions} />
            <StatCard icon={Coins} label="Credit balance" value={overview.credits.balanceSum.toLocaleString()} />
            <StatCard icon={Coins} label="Lifetime credits" value={overview.credits.lifetimeSum.toLocaleString()} />
            <StatCard icon={ScrollText} label="Credit txns" value={overview.credits.transactions} />
            <StatCard icon={KeyRound} label="API keys" value={overview.apiKeys} />
            <StatCard icon={ScrollText} label="Audit logs" value={overview.auditLogs} />
            <StatCard icon={Clock} label="Waitlist" value={entries.length} />
          </div>

          <Card className="flex flex-wrap items-center gap-2 p-4">
            <span className="mr-1 text-[12px] font-semibold uppercase tracking-wide text-muted">Plans</span>
            {overview.plans.length === 0 && <span className="text-[13px] text-muted">No subscriptions yet.</span>}
            {overview.plans.map((p) => (
              <Badge key={p.plan} variant={p.plan === "FREE" ? "neutral" : "brand"}>
                {p.plan}: {p.count}
              </Badge>
            ))}
          </Card>
        </section>
      )}

      <section aria-label="Waitlist" className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Beta Waitlist{" "}
          <span className="ml-1 align-middle text-[13px] font-normal text-muted">
            ({entries.filter((e) => e.status === "PENDING").length} pending)
          </span>
        </h2>
        <Card className="overflow-x-auto p-0 liqui-clip-content">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="[box-shadow:inset_0_-1px_0_rgb(148_163_184/0.12)] text-[11px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted">
                    No waitlist signups yet.
                  </td>
                </tr>
              )}
              {entries.map((entry) => (
                <tr key={entry.id} className="[box-shadow:inset_0_-1px_0_rgb(148_163_184/0.08)] transition-colors hover:bg-surface-hover/40">
                  <td className="px-5 py-3.5 font-medium text-foreground">{entry.name}</td>
                  <td className="px-5 py-3.5 text-muted">{entry.email}</td>
                  <td className="px-5 py-3.5 text-muted">{formatDate(entry.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={entry.status === "GRANTED" ? "success" : "neutral"}>
                      {entry.status === "GRANTED" ? "Beta access" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {entry.status === "PENDING" ? (
                      <Button size="sm" disabled={busyId === entry.id} onClick={() => void setEntryStatus(entry, true)}>
                        Grant access
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" disabled={busyId === entry.id} onClick={() => void setEntryStatus(entry, false)}>
                        Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="text-[12.5px] text-muted">
          Granted emails become allowed to create an account during the private beta.
        </p>
      </section>

      <section aria-label="All users" className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          All Users <span className="ml-1 align-middle text-[13px] font-normal text-muted">({users.length})</span>
        </h2>
        <Card className="overflow-x-auto p-0 liqui-clip-content">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="[box-shadow:inset_0_-1px_0_rgb(148_163_184/0.12)] text-[11px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Credits</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="[box-shadow:inset_0_-1px_0_rgb(148_163_184/0.08)] transition-colors hover:bg-surface-hover/40">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{u.fullName}</p>
                    <p className="text-[12.5px] text-muted">{u.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={u.role === "ADMIN" ? "brand" : "neutral"}>{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{u.subscription?.plan ?? "—"}</td>
                  <td className="px-5 py-3.5 text-muted">{u.credits?.balance ?? 0}</td>
                  <td className="px-5 py-3.5 text-muted">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 text-[12.5px]", u.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                      {u.isActive ? <CheckCircle2 className="size-3.5" /> : <Ban className="size-3.5" />}
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {u.role !== "ADMIN" && (
                      <Button
                        size="sm"
                        variant={u.isActive ? "secondary" : "primary"}
                        disabled={busyId === u.id}
                        onClick={() => void toggleUserActive(u)}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
