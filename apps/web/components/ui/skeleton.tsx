import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer shimmer-bg rounded-md", className)} />;
}
