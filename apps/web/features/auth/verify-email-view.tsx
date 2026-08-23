"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail, ShieldAlert } from "lucide-react";
import { authApi } from "@/services/api.endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Spinner } from "@/components/ui/spinner";
import { ApiClientError } from "@/types/api";

type State = "verifying" | "verified" | "invalid";

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, setState] = useState<State>("verifying");
  const [email, setEmail] = useState("");
  const [resendSent, setResendSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    let cancelled = false;
    authApi
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) setState("verified");
      })
      .catch(() => {
        if (!cancelled) setState("invalid");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleResend() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setResending(true);
    setError(undefined);
    try {
      await authApi.resendVerification(email.trim());
      setResendSent(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  }

  if (state === "verifying") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Spinner className="size-5 text-brand-600" />
        <p className="text-sm text-muted">Verifying your email…</p>
      </div>
    );
  }

  if (state === "verified") {
    return (
      <div className="animate-fade-up">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15">
            <CheckCircle2 className="size-5 text-emerald-600" />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Email verified</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Your email has been confirmed. You&apos;re all set to explore your workspace.
          </p>
          <div className="mt-6">
            <Link href="/dashboard" className="block">
              <Button className="w-full">Go to dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-500/15">
          <ShieldAlert className="size-5 text-red-600" />
        </span>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          {token ? "Link invalid or expired" : "Verify your email"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {token
            ? "This verification link is no longer valid. Enter your email and we'll send a fresh one."
            : "Enter your email and we'll send you a verification link."}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <FormField label="Email" htmlFor="verify-email" error={error}>
          <Input
            id="verify-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail />}
            autoFocus
          />
        </FormField>
        {resendSent ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-[13px] text-emerald-700 dark:text-emerald-400 animate-fade-in">
            Verification email sent. Check your inbox.
          </div>
        ) : (
          <Button onClick={handleResend} className="w-full" size="lg" loading={resending}>
            Resend verification email
          </Button>
        )}
      </div>
    </div>
  );
}
