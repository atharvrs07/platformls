"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/ui/form-field";
import { Separator } from "@/components/ui/separator";
import { SocialButton } from "./social-button";
import { ApiClientError } from "@/types/api";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; form?: string }>({});

  const next = searchParams.get("next") ?? "/dashboard";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    const nextErrors: typeof errors = {};
    if (!identifier.trim()) nextErrors.identifier = "Enter your email or username";
    if (!password) nextErrors.password = "Enter your password";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await login(identifier.trim(), password, rememberMe);
      if (result.pendingVerification) {
        toast({
          title: "Please verify your email",
          description: "We sent a verification link to your inbox.",
          variant: "info",
        });
      }
      router.push(next);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrors({ form: error.message });
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errors.form && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-700 dark:text-red-400 animate-fade-in">
            {errors.form}
          </div>
        )}

        <FormField label="Email or username" htmlFor="identifier" error={errors.identifier}>
          <Input
            id="identifier"
            autoComplete="username"
            placeholder="you@company.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            leftIcon={<Mail />}
            error={errors.identifier}
            autoFocus
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password}
          hint={
            <Link href="/forgot-password" className="text-[12px] font-medium text-brand-600 hover:underline">
              Forgot?
            </Link>
          }
        >
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
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
          />
        </FormField>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
            <label htmlFor="remember" className="text-[13px] text-muted select-none">
              Remember me
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-[12px] uppercase tracking-wider text-muted">or</span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-2.5">
        <SocialButton provider="Google" />
        <SocialButton provider="GitHub" />
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-brand-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
