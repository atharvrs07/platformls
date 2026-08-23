import { brand } from "./brand";
import type { Metadata } from "next";

export const siteConfig = {
  appVersion: "1.0.0",
  phase: "Phase 1 — Foundation",
};

export function buildMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(brand.urls.website),
    title: {
      default: `${brand.name} — ${brand.description}`,
      template: `%s · ${brand.name}`,
    },
    description: brand.longDescription,
    keywords: [
      "AI workspace",
      "workflow automation",
      "AI agents",
      "backend services",
      "database",
      "storage",
      "developer tools",
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: brand.urls.website,
      siteName: brand.name,
      title: `${brand.name} — ${brand.tagline}`,
      description: brand.longDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} — ${brand.tagline}`,
      description: brand.longDescription,
    },
    ...overrides,
  };
}
