import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/auth-shell";
import { RegisterForm } from "@/features/auth/register-form";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell heading="Create your account" subtitle={`Start building with ${brand.name} in minutes.`}>
      <RegisterForm />
    </AuthShell>
  );
}
