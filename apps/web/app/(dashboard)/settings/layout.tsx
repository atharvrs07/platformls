import type { Metadata } from "next";
import { SettingsNav } from "@/features/settings/settings-nav";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your account, preferences and security.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <div className="lg:border-r lg:border-border lg:pr-6">
          <SettingsNav />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
