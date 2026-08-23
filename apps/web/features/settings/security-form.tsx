"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api.endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ApiClientError } from "@/types/api";

function Section({ icon: Icon, title, description, children }: { icon: React.ElementType; title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
            <Icon className="size-4 text-muted" strokeWidth={1.75} />
          </span>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function SecurityForm() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  function updatePassword(field: keyof typeof passwordForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "New passwords don't match", variant: "error" });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "error" });
      return;
    }
    setPasswordLoading(true);
    try {
      await userApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast({ title: "Password changed", description: "You've been signed out of other sessions.", variant: "success" });
      router.push("/login");
    } catch (error) {
      toast({
        title: "Couldn't change password",
        description: error instanceof ApiClientError ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleChangeEmail(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Enter a valid email address", variant: "error" });
      return;
    }
    setEmailLoading(true);
    try {
      await userApi.changeEmail(email.trim());
      await refreshUser();
      toast({
        title: "Email updated",
        description: "You'll need to verify your new email address.",
        variant: "success",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Couldn't update email",
        description: error instanceof ApiClientError ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setEmailLoading(false);
    }
  }

  async function handleDelete(e: FormEvent) {
    e.preventDefault();
    if (!confirmPassword) {
      toast({ title: "Enter your password to confirm", variant: "error" });
      return;
    }
    setDeleteLoading(true);
    try {
      await userApi.deleteAccount(confirmPassword);
      router.push("/");
    } catch (error) {
      toast({
        title: "Couldn't delete account",
        description: error instanceof ApiClientError ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Section icon={KeyRound} title="Change password" description="Use at least 8 characters with a mix of letters and numbers.">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Current password" htmlFor="currentPassword">
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={passwordForm.currentPassword}
                onChange={updatePassword("currentPassword")}
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="New password" htmlFor="newPassword">
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={updatePassword("newPassword")}
              />
            </FormField>
            <FormField label="Confirm new password" htmlFor="confirmPassword">
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={passwordForm.confirmPassword}
                onChange={updatePassword("confirmPassword")}
              />
            </FormField>
          </div>
          <Button type="submit" loading={passwordLoading}>
            Update password
          </Button>
        </form>
      </Section>

      <Section icon={Mail} title="Email address" description={`You're currently signed in as ${user?.email}.`}>
        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div className="max-w-sm space-y-1.5">
            <FormField label="New email address" htmlFor="newEmail">
              <Input
                id="newEmail"
                type="email"
                placeholder="new@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
          </div>
          <Button type="submit" loading={emailLoading}>
            Update email
          </Button>
        </form>
      </Section>

      <Section icon={ShieldCheck} title="Two-factor authentication" description="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-subtle/50 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-foreground">Authenticator app</p>
            <p className="text-[12px] text-muted">Coming in a future phase.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Badge variant="neutral" className="text-[11px]">
              Soon
            </Badge>
            <Switch checked={false} onCheckedChange={() => {}} disabled />
          </div>
        </div>
      </Section>

      <Card className="border-red-500/30">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="size-4 text-red-600" strokeWidth={1.75} />
            </span>
            <div>
              <CardTitle className="text-red-700 dark:text-red-400">Danger zone</CardTitle>
              <CardDescription>
                Permanently delete your account, projects, and all associated data. This cannot be undone.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete account
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your account?"
        description="This will permanently erase your profile, projects and workspace. This action cannot be undone."
      >
        <form onSubmit={handleDelete} className="space-y-4 px-6 pb-6">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] leading-relaxed text-red-700 dark:text-red-400">
            Before you go — consider exporting your data. Account deletion is immediate and permanent.
          </div>
          <FormField label="Enter your password to confirm" htmlFor="confirm-delete">
            <Input
              id="confirm-delete"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoFocus
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" loading={deleteLoading}>
              Delete account
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
