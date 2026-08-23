"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Laptop, MonitorSmartphone, ShieldAlert, Smartphone } from "lucide-react";
import { userApi, authApi } from "@/services/api.endpoints";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { formatRelativeTime } from "@/utils/format";
import type { SessionInfo } from "@/types";
import { ApiClientError } from "@/types/api";

function parseUserAgent(ua: string | null): { browser: string; os: string; device: "desktop" | "mobile" | "tablet" } {
  if (!ua) return { browser: "Unknown browser", os: "Unknown OS", device: "desktop" };
  const browser = /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : /Edge\//.test(ua) ? "Edge" : "Browser";
  const os = /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : "Other";
  const device = /Mobi|Android/.test(ua) ? "mobile" : /iPad|Tablet/.test(ua) ? "tablet" : "desktop";
  return { browser, os, device };
}

export function SessionsView() {
  const { toast } = useToast();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionInfo[] | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await userApi.getSessions();
      setSessions(data.sessions);
    } catch {
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function revoke(sessionId: string) {
    setRevoking(sessionId);
    try {
      await userApi.revokeSession(sessionId);
      toast({ title: "Session revoked", variant: "success" });
      await load();
    } catch (error) {
      toast({
        title: "Couldn't revoke session",
        description: error instanceof ApiClientError ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setRevoking(null);
    }
  }

  async function logoutAll() {
    setLoggingOutAll(true);
    try {
      await authApi.logoutAll();
      toast({ title: "Signed out everywhere else", variant: "success" });
      router.push("/login");
    } catch {
      setLoggingOutAll(false);
      toast({ title: "Something went wrong", variant: "error" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              Devices currently signed in to your account. Revoke any you don&apos;t recognize.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAllOpen(true)}
            disabled={!sessions || sessions.length <= 1}
          >
            Sign out all others
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sessions === null ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-surface-subtle/40 p-4">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No active sessions.</p>
        ) : (
          <ul className="space-y-2.5">
            {sessions.map((session) => {
              const info = parseUserAgent(session.userAgent);
              const DeviceIcon = info.device === "mobile" ? Smartphone : info.device === "tablet" ? MonitorSmartphone : Laptop;
              return (
                <li
                  key={session.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface-subtle/40 p-4 transition-colors hover:bg-surface-subtle"
                >
                  <span className="liqui-minimal flex size-10 shrink-0 items-center justify-center rounded-g1">
                    <DeviceIcon className="size-4.5 text-muted" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {info.browser} · {info.os}
                      </p>
                      {session.isCurrent && (
                        <Badge variant="success" className="text-[10px]">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[12.5px] text-muted">
                      {session.ipAddress ? `${session.ipAddress} · ` : ""}
                      Active {formatRelativeTime(session.lastActiveAt)}
                    </p>
                  </div>
                  {!session.isCurrent && (
                    <Button variant="ghost" size="sm" loading={revoking === session.id} onClick={() => void revoke(session.id)}>
                      Revoke
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <Dialog
        open={confirmAllOpen}
        onOpenChange={setConfirmAllOpen}
        title="Sign out of all other sessions?"
        description="You'll stay signed in here, but every other device will be signed out."
      >
        <div className="px-6 pb-6">
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-700 dark:text-amber-400">
            <ShieldAlert className="size-4 shrink-0" />
            Use this if you suspect someone else has access to your account.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmAllOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" loading={loggingOutAll} onClick={() => void logoutAll()}>
              Sign out all others
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  );
}
