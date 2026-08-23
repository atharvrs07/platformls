"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Eye, EyeOff, Mail, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Separator } from "@/components/ui/separator";
import { SocialButton } from "./social-button";
import { ApiClientError } from "@/types/api";

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,24}$/;
const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /[0-9]/;

interface FormErrors {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  form?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: FormErrors = {};

    if (form.fullName.trim().length < 2) nextErrors.fullName = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address";
    if (!USERNAME_RE.test(form.username)) nextErrors.username = "3–24 characters: letters, numbers, . - _";
    if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    } else if (!HAS_LETTER.test(form.password) || !HAS_NUMBER.test(form.password)) {
      nextErrors.password = "Password needs at least one letter and one number";
    }
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = "Passwords don't match";
    if (!acceptedTerms) nextErrors.terms = "Please accept the terms to continue";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
      });
      router.push("/dashboard");
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

        <FormField label="Full name" htmlFor="fullName" error={errors.fullName}>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={form.fullName}
            onChange={update("fullName")}
            leftIcon={<User />}
            error={errors.fullName}
            autoFocus
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={update("email")}
              leftIcon={<Mail />}
              error={errors.email}
            />
          </FormField>

          <FormField label="Username" htmlFor="username" error={errors.username}>
            <Input
              id="username"
              autoComplete="username"
              placeholder="ada"
              value={form.username}
              onChange={update("username")}
              leftIcon={<AtSign />}
              error={errors.username}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Password" htmlFor="password" error={errors.password}>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="8+ characters"
              value={form.password}
              onChange={update("password")}
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

          <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              error={errors.confirmPassword}
            />
          </FormField>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-border accent-brand-600"
            />
            <label htmlFor="terms" className="text-[13px] leading-relaxed text-muted select-none">
              I agree to the{" "}
              <a href="/terms" className="font-medium text-brand-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="font-medium text-brand-600 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && <p className="text-[13px] text-red-600">{errors.terms}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create account
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
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
