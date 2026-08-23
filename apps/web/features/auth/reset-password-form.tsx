"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { authApi } from "@/services/api.endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { ApiClientError } from "@/types/api";

const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /[0-9]/;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; form?: string }>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    } else if (!HAS_LETTER.test(password) || !HAS_NUMBER.test(password)) {
      nextErrors.password = "Password needs at least one letter and one number";
    }
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords don't match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (error) {
      setErrors({
        form: error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-500/15">
          <ShieldAlert className="size-5 text-red-600" />
        </span>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Invalid reset link</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          This link is missing or malformed. Request a new password reset to continue.
        </p>
        <div className="mt-6">
          <Link href="/forgot-password" className="block">
            <Button variant="secondary" className="w-full">
              Request new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="animate-fade-up">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15">
            <CheckCircle2 className="size-5 text-emerald-600" />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">Password updated</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Your password has been reset. All other sessions have been signed out.
          </p>
          <div className="mt-6">
            <Link href="/login" className="block">
              <Button className="w-full">Sign in with new password</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className="text-sm leading-relaxed text-muted">Choose a new password for your account.</p>
      {errors.form && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-700 dark:text-red-400 animate-fade-in">
          {errors.form}
        </div>
      )}
      <FormField label="New password" htmlFor="password" error={errors.password}>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="8+ characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          }
          autoFocus
        />
      </FormField>
      <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
      </FormField>
      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Reset password
      </Button>
    </form>
  );
}
