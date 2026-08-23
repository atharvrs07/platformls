import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/auth-shell";
import { LoginForm } from "@/features/auth/login-form";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell heading="Welcome back" subtitle="Sign in to continue to your workspace.">
      <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
