import { MessageSquare, GitBranch, Bot, Mic, Puzzle, Server, Database, Cloud, Plug } from "lucide-react";

const items = [
  { name: "AI Chat", icon: MessageSquare },
  { name: "Flows", icon: GitBranch },
  { name: "Agents", icon: Bot },
  { name: "Voice Studio", icon: Mic },
  { name: "Apps", icon: Puzzle },
  { name: "Backend", icon: Server },
  { name: "Database", icon: Database },
  { name: "Storage", icon: Cloud },
  { name: "Integrations", icon: Plug },
];

export function ModuleMarquee() {
  const row = [...items, ...items];
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-subtle/40 py-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="group flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <div
            key={i}
            className="liqui-minimal flex items-center gap-2.5 rounded-full px-4 py-2 transition-colors duration-300 hover:bg-surface-hover"
          >
            <item.icon className="size-4 text-brand-600" strokeWidth={1.75} />
            <span className="whitespace-nowrap text-[13px] font-medium text-muted">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
