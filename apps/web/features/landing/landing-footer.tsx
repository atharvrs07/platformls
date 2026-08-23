import Link from "next/link";
import { brand } from "@/config/brand";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/reveal";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface-subtle/40">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <Reveal className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">{brand.longDescription}</p>
            <div className="mt-5 flex gap-1.5 text-[12px] text-muted">
              {["JWT Auth", "PostgreSQL", "Scale-ready"].map((tag) => (
                <span
                  key={tag}
                  className="liqui-minimal rounded-full px-2 py-1 transition-colors duration-300 hover:text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <FooterColumn title="Product" links={brand.footer.product} />
          <FooterColumn title="Resources" links={brand.footer.resources} />
          <FooterColumn title="Company" links={brand.footer.company} />
        </Reveal>

        <Reveal>
          <Separator className="my-10" />

          <div className="flex flex-col items-center justify-between gap-4 text-[13px] text-muted sm:flex-row">
            <p>
              © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link href={brand.urls.status} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                <span className="size-1.5 animate-ping-slow rounded-full bg-emerald-500" />
                All systems operational
              </Link>
              <Link href={brand.urls.twitter} className="transition-colors hover:text-foreground">
                X / Twitter
              </Link>
              <Link href={brand.urls.github} className="transition-colors hover:text-foreground">
                GitHub
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[13px] font-semibold uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1 text-sm text-muted transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
              <span className="h-px w-0 bg-brand-500 transition-all duration-300 group-hover:w-3" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
