import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function CtaBanner() {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <Reveal variant="zoom" className="mx-auto max-w-5xl">
        <div className="liqui-deep relative overflow-hidden rounded-g3 px-8 py-16 text-center sm:px-16">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-24 size-80 rounded-full bg-sky-400/15 blur-[100px]" />
            <div className="absolute -bottom-32 -right-16 size-96 rounded-full bg-indigo-400/12 blur-[110px]" />
            <div
              className="absolute inset-x-10 top-6 h-24 opacity-40"
              style={{ background: "radial-gradient(60% 100% at 40% 0%, rgba(255,255,255,0.14), transparent 75%)" }}
            />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-medium text-white/90 backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              Launching in phases
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to build something extraordinary?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
              Join the workspace where AI, automation and infrastructure finally come together.
              Seats are limited — sign up for the waitlist and be first in line.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/waitlist">
                <Button
                  size="lg"
                  className="group relative w-full overflow-hidden bg-white text-brand-700 shadow-none hover:bg-white/90 sm:w-auto"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-brand-200/50 to-transparent"
                  />
                  <span className="relative">Sign up for the waitlist</span>
                  <ArrowRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href={brand.urls.docs}>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full border border-white/25 text-white transition-colors duration-300 hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  Read the docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
