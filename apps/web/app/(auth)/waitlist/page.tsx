import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/auth-shell";
import { WaitlistForm } from "@/features/auth/waitlist-form";

export const metadata: Metadata = { title: "Join the waitlist" };

export default function WaitlistPage() {
  return (
    <AuthShell
      heading="Sign up for the waitlist"
      subtitle="LiquiStudio is in private beta. Leave your details and we'll let you know once beta testing starts."
    >
      <WaitlistForm />
    </AuthShell>
  );
}
