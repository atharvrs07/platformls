"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, PartyPopper, User } from "lucide-react";
import { waitlistApi } from "@/services/api.endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { ApiClientError } from "@/types/api";
import { cn } from "@/utils/cn";

const STEPS = ["Email", "Name", "Done"];

export function WaitlistForm() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!emailValid) {
      setError("Enter a valid email address");
      return;
    }
    if (name.trim().length < 2) {
      setError("Enter your name");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await waitlistApi.join({ email: email.trim(), name: name.trim() });
      setStep(2);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 409) {
        setStep(2);
      } else {
        setError(err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-2" aria-label={`Step ${Math.min(step + 1, 3)} of 3`}>
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                  i < step ? "bg-brand-600 text-white" : i === step ? "bg-brand-600/15 text-brand-600" : "bg-surface-hover text-muted"
                )}
              >
                {i < step ? <CheckCircle2 className="size-3.5" /> : i + 1}
              </span>
              <span className={cn("hidden text-[12px] font-medium sm:block", i <= step ? "text-foreground" : "text-muted")}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border-subtle" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-700 dark:text-red-400 animate-fade-in">
          {error}
        </div>
      )}

      {step === 0 && (
        <form
          className="space-y-4 animate-fade-in"
          onSubmit={(e) => {
            e.preventDefault();
            if (emailValid) {
              setError(null);
              setStep(1);
            } else {
              setError("Enter a valid email address");
            }
          }}
        >
          <FormField label="Your email" htmlFor="waitlist-email">
            <Input
              id="waitlist-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail />}
              autoFocus
            />
          </FormField>
          <Button type="submit" size="lg" className="w-full">
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <FormField label="Your name" htmlFor="waitlist-name">
            <Input
              id="waitlist-name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User />}
              autoFocus
            />
          </FormField>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="lg" onClick={() => setStep(0)}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button type="submit" size="lg" className="flex-1" loading={loading}>
              Join the Waitlist
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="animate-fade-in text-center">
          <span className="liqui-minimal mx-auto flex size-14 items-center justify-center rounded-g2">
            <PartyPopper className="size-6 text-brand-600" strokeWidth={1.75} />
          </span>
          <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">You&apos;re on the list!</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We&apos;ll let you know once the beta testing starts! Keep an eye on{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
