import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { brand } from "@/config/brand";
import { LogoMark } from "@/components/ui/logo";

const highlights = [
  "Secure JWT session management",
  "One workspace for your entire team",
  "Built for the next generation of builders",
];

export function AuthShell({
  children,
  heading,
  subtitle,
}: {
  children: React.ReactNode;
  heading: string;
  subtitle: string;
}) {
  return (
    <div className="bg-liqui-canvas flex min-h-screen">
      {/* Deep-water brand slab — the Liqui sample card, at architectural scale */}
      <div className="hidden w-[46%] p-4 lg:block lg:p-6">
        <div className="liqui-deep liqui-clip-content relative flex h-full flex-col justify-between rounded-g3 p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(42% 34% at 22% 6%, rgba(148,222,255,0.14), transparent 70%), radial-gradient(50% 40% at 96% 96%, rgba(167,139,250,0.1), transparent 70%)",
            }}
          />
          {/* Faint internal highlight — light held within still water */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-10 h-24 opacity-[0.35]"
            style={{
              background: "radial-gradient(60% 100% at 30% 0%, rgba(255,255,255,0.16), transparent 75%)",
            }}
          />
          <Link href="/" className="relative inline-flex items-center gap-2.5" aria-label={`${brand.name} home`}>
            <LogoMark size={34} />
            <span className="text-lg font-semibold tracking-tight text-white">{brand.name}</span>
          </Link>

          <div className="relative">
            <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight text-white">
              {brand.tagline}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">{brand.longDescription}</p>

            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/12 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)]">
                    <Check className="size-3 text-white" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-[13px] text-white/45">
            © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-muted transition-colors hover:text-foreground lg:hidden">
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
          <Link href="/" className="ml-auto lg:hidden">
            <LogoMark size={30} />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px]">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{heading}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
