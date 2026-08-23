import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/auth-shell";
import { VerifyEmailView } from "@/features/auth/verify-email-view";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <AuthShell heading="Verify your email" subtitle="One quick step and you're in.">
      <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
        <VerifyEmailView />
      </Suspense>
    </AuthShell>
  );
}
