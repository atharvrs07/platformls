import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <AuthShell heading="Set a new password" subtitle="Choose something strong and unique.">
      <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
