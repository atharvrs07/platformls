/**
 * BRANDING — single source of truth.
 *
 * Rebrand the entire platform by editing this one file:
 * company name, domains, links, tagline, accent color and logo mark.
 * No hardcoded brand strings should exist anywhere else in the app.
 */

export const brand = {
  name: "LiquiLink",
  legalName: "LiquiLink",
  tagline: "Build. Automate. Create.",
  description: "The all-in-one AI workspace.",
  longDescription:
    "LiquiLink combines AI, workflows, automation, backend tools and developer utilities into one seamless platform.",

  domains: {
    website: "liquilink.in",
    platform: "platform.liquilink.in",
  },

  urls: {
    website: "https://liquilink.in",
    platform: "https://platform.liquilink.in",
    docs: "https://liquilink.in/docs",
    blog: "https://liquilink.in/blog",
    status: "https://status.liquilink.in",
    twitter: "https://x.com/liquilink",
    github: "https://github.com/liquilink",
  },

  emails: {
    support: "support@liquilink.in",
    hello: "hello@liquilink.in",
    security: "security@liquilink.in",
  },

  /** Logo accent — used by the <Logo /> mark and inline brand moments. */
  accent: {
    from: "#6366f1",
    to: "#4338ca",
    soft: "#eef2ff",
  },

  /** Legal */
  company: {
    foundedYear: 2025,
    headquarters: "India",
  },

  nav: [
    { label: "Features", href: "/#features" },
    { label: "Platform", href: "/#platform" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
  ],

  footer: {
    product: [
      { label: "Features", href: "/#features" },
      { label: "Platform", href: "/#platform" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Changelog", href: "/docs/changelog" },
      { label: "Roadmap", href: "/docs/roadmap" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/docs/guides" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Status", href: "/status" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
} as const;

export type Brand = typeof brand;

/** Helper for the current platform URL (e.g. used by auth redirects). */
export function platformUrl(path = "/") {
  return `${brand.urls.platform}${path}`;
}
