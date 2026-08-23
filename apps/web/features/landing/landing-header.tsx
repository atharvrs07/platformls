"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, ArrowRight } from "lucide-react";
import { brand } from "@/config/brand";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/utils/cn";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useMounted();
  const { isDark, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
      <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 animate-fade-down transition-all duration-300",
        scrolled ? "glass [box-shadow:inset_0_-1px_0_rgb(148_163_184/0.12)]" : ""
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label={`${brand.name} home`} className="transition-opacity duration-300 hover:opacity-80">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {brand.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative rounded-g1 px-3 py-2 text-[13.5px] font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "LIGHT" : "DARK")}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          )}

          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-[13px]">
              Login
            </Button>
          </Link>

          <Link href="/waitlist">
            <Button size="sm" className="text-[13px]">
              Sign up for the waitlist
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Open menu">
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass px-5 pb-6 pt-2 animate-fade-in lg:hidden [box-shadow:inset_0_1px_0_rgb(148_163_184/0.12)]">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {brand.nav.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="animate-fade-in rounded-g1 px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="animate-fade-in rounded-g1 px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-hover hover:text-foreground"
              style={{ animationDelay: `${brand.nav.length * 40}ms` }}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
