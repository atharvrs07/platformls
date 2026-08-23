"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { authApi } from "@/services/api.endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { ApiClientError } from "@/types/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="animate-fade-up">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15">
            <Mail className="size-5 text-emerald-600" />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Check your inbox</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, we&apos;ve sent a
            password reset link. It expires in 1 hour.
          </p>
          <div className="mt-6">
            <Button variant="secondary" className="w-full" onClick={() => setSent(false)}>
              Resend email
            </Button>
          </div>
        </div>
        <Link href="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className="text-sm leading-relaxed text-muted">
        Enter the email associated with your account and we&apos;ll send you a link to reset your password.
      </p>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-700 dark:text-red-400 animate-fade-in">
          {error}
        </div>
      )}
      <FormField label="Email" htmlFor="email" error={error}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail />}
          autoFocus
        />
      </FormField>
      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Send reset link
      </Button>
      <Link href="/login" className="flex items-center justify-center gap-1.5 pt-2 text-sm font-medium text-muted transition-colors hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
    </form>
  );
}
