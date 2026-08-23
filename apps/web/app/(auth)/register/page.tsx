import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/auth-shell";
import { RegisterForm } from "@/features/auth/register-form";
export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell heading="Create your account" subtitle="Registration is currently invite-only. Continue if you've been granted beta access.">
      <RegisterForm />
    </AuthShell>
  );
}
