import type { Metadata } from "next";
import { buildMetadata } from "@/config/site";
import { LandingHeader } from "@/features/landing/landing-header";
import { LandingFooter } from "@/features/landing/landing-footer";

export const metadata: Metadata = buildMetadata({
  title: `${"AI"} workspace for builders`,
});

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
