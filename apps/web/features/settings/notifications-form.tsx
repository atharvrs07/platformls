"use client";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api.endpoints";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function NotificationsForm() {
  const { bundle, refreshUser } = useAuth();
  const { toast } = useToast();
  const prefs = bundle?.preferences;

  async function persist(key: string, value: boolean, label: string) {
    try {
      await userApi.updatePreferences({ [key]: value });
      await refreshUser();
      toast({ title: `${label} ${value ? "enabled" : "disabled"}`, variant: "success" });
    } catch {
      toast({ title: "Couldn't save preference", variant: "error" });
    }
  }

  const rows = [
    {
      key: "emailNotifications",
      title: "Email notifications",
      description: "Important updates about your account and workspace.",
    },
    {
      key: "productUpdates",
      title: "Product updates",
      description: "New features, improvements and module launches.",
    },
    {
      key: "weeklyDigest",
      title: "Weekly digest",
      description: "A summary of your workspace activity every Monday.",
    },
    {
      key: "marketingEmails",
      title: "Marketing emails",
      description: "Tips, stories and occasional offers. Only when they matter.",
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Control what you receive and where.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((row) => {
          const checked = Boolean(prefs?.[row.key]);
          return (
            <div
              key={row.key}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-subtle/50 px-4 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <p className="text-[12px] text-muted">{row.description}</p>
              </div>
              <Switch
                checked={checked}
                onCheckedChange={(value) => void persist(row.key, value, row.title)}
              />
            </div>
          );
        })}
        <p className="pt-2 text-[12px] text-muted">
          In-app and browser notifications are coming in a future phase.
        </p>
      </CardContent>
    </Card>
  );
}
