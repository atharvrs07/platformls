"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandMenu } from "./command-menu";
import { useAuth } from "@/hooks/use-auth";
import { FullPageLoader } from "@/components/ui/spinner";

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (status === "loading") {
    return <FullPageLoader label="Loading your workspace…" />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="bg-liqui-canvas flex h-dvh overflow-hidden">
      <div className="hidden shrink-0 lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px] animate-fade-in" onClick={() => setMobileOpen(false)} aria-hidden />
           <div className="absolute inset-y-0 left-0 animate-slide-in-right">
            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="liqui-primary absolute right-[-42px] top-4 rounded-r-g2 p-2 text-muted transition-colors hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMobileOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
