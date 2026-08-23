"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api.endpoints";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/utils/cn";
import type { Theme } from "@/types";

const themeOptions: { value: Theme; label: string; description: string; icon: typeof Sun }[] = [
  { value: "LIGHT", label: "Light", description: "Bright and airy", icon: Sun },
  { value: "DARK", label: "Dark", description: "Easy on the eyes", icon: Moon },
  { value: "SYSTEM", label: "System", description: "Match your device", icon: Monitor },
];

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const { bundle, refreshUser } = useAuth();
  const { toast } = useToast();

  const preferences = bundle?.preferences;

  async function persist(patch: Record<string, unknown>, message: string) {
    try {
      await userApi.updatePreferences(patch);
      await refreshUser();
      toast({ title: message, variant: "success" });
    } catch {
      toast({ title: "Couldn't save preference", variant: "error" });
    }
  }

  function selectTheme(value: Theme) {
    setTheme(value);
    void persist({ theme: value }, "Theme updated");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how the workspace looks for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const selected = theme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectTheme(option.value)}
                  className={cn(
                    "group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-200",
                    selected
                      ? "border-brand-600/50 ring-2 ring-brand-600/20 shadow-card"
                      : "border-border hover:border-border hover:bg-surface-subtle/60"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-20 w-full items-center justify-center rounded-xl border",
                      option.value === "LIGHT" && "border-border bg-white",
                      option.value === "DARK" && "border-zinc-700 bg-zinc-900",
                      option.value === "SYSTEM" && "border-border bg-gradient-to-br from-white via-white to-zinc-900"
                    )}
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 shadow-sm">
                      <option.icon className="size-4 text-white" />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{option.label}</p>
                    <p className="text-[12px] text-muted">{option.description}</p>
                  </div>
                  {selected && (
                    <span className="absolute right-4 top-4 flex size-5 items-center justify-center rounded-full bg-brand-600">
                      <Check className="size-3 text-white" strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Motion</CardTitle>
          <CardDescription>Reduce the amount of animation across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-subtle/50 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-foreground">Reduce motion</p>
              <p className="text-[12px] text-muted">Minimize transitions and hover effects.</p>
            </div>
            <Switch
              checked={preferences?.reducedMotion ?? false}
              onCheckedChange={(checked) => void persist({ reducedMotion: checked }, "Motion preference updated")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
