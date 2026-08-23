import { Hero } from "@/features/landing/hero";
import { ModuleMarquee } from "@/features/landing/module-marquee";
import { Features } from "@/features/landing/features";
import { PlatformOverview } from "@/features/landing/platform-overview";
import { WhyLiquiLink } from "@/features/landing/why";
import { Pricing } from "@/features/landing/pricing";
import { Faq } from "@/features/landing/faq";
import { CtaBanner } from "@/features/landing/cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ModuleMarquee />
      <Features />
      <PlatformOverview />
      <WhyLiquiLink />
      <Pricing />
      <Faq />
      <CtaBanner />
    </>
  );
}
