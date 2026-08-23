import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell heading="Reset your password" subtitle="We'll email you a secure link to set a new one.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
