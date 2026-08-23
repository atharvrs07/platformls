import type { LucideIcon } from "lucide-react";
import {
  MessageSquare,
  GitBranch,
  Bot,
  Mic,
  Puzzle,
  Server,
  Database,
  Cloud,
  Plug,
  LifeBuoy,
} from "lucide-react";

export interface ModuleInfo {
  key: string;
  href: string;
  title: string;
  icon: LucideIcon;
  short: string;
  description: string;
  features: string[];
  phase: string;
  availability: string;
}

export const modules: Record<string, ModuleInfo> = {
  chat: {
    key: "chat",
    href: "/chat",
    title: "AI Chat",
    icon: MessageSquare,
    short: "Conversational AI",
    description:
      "A single AI assistant that understands your workspace, remembers context and answers with your data.",
    features: [
      "Multi-model conversations",
      "Workspace-wide context and memory",
      "Tool use — search, compute and act",
      "Share conversations with your team",
    ],
    phase: "Phase 2",
    availability: "Next up",
  },
  flows: {
    key: "flows",
    href: "/flows",
    title: "Workflow Flows",
    icon: GitBranch,
    short: "Visual automation",
    description:
      "Build automation visually. Connect triggers, logic and actions across apps without writing glue code.",
    features: [
      "Visual drag-and-drop builder",
      "100+ triggers and actions",
      "Conditional logic and branching",
      "Error handling and retries",
    ],
    phase: "Phase 2",
    availability: "Next up",
  },
  agents: {
    key: "agents",
    href: "/agents",
    title: "AI Agents",
    icon: Bot,
    short: "Autonomous agents",
    description:
      "Deploy autonomous agents that plan multi-step tasks, use tools and report back — with full oversight.",
    features: [
      "Goal-driven task execution",
      "Tool and function calling",
      "Human-in-the-loop approvals",
      "Usage analytics and logs",
    ],
    phase: "Phase 3",
    availability: "In development",
  },
  voice: {
    key: "voice",
    href: "/voice",
    title: "Voice Studio",
    icon: Mic,
    short: "Speech synthesis",
    description:
      "Generate natural, expressive speech for assistants, products and content — from a few lines of text.",
    features: [
      "Ultra-realistic voices",
      "Voice cloning (consented)",
      "SSML and timestamps",
      "Batch generation pipeline",
    ],
    phase: "Phase 3",
    availability: "In development",
  },
  apps: {
    key: "apps",
    href: "/apps",
    title: "Apps",
    icon: Puzzle,
    short: "Connected apps",
    description:
      "Discover and install apps that extend your workspace — from internal tools to public integrations.",
    features: [
      "App directory and marketplace",
      "One-click installs",
      "Scoped permissions per app",
      "Internal app publishing",
    ],
    phase: "Phase 4",
    availability: "Planned",
  },
  backend: {
    key: "backend",
    href: "/backend",
    title: "Backend Services",
    icon: Server,
    short: "Serverless infrastructure",
    description:
      "Deploy serverless functions, APIs and realtime infrastructure with edge deployment and instant scaling.",
    features: [
      "Functions and endpoints",
      "Realtime and WebSockets",
      "Edge regions worldwide",
      "Built-in observability",
    ],
    phase: "Phase 4",
    availability: "Planned",
  },
  database: {
    key: "database",
    href: "/database",
    title: "Managed Database",
    icon: Database,
    short: "Postgres, managed",
    description:
      "Provision production Postgres in seconds — with backups, monitoring and point-in-time recovery included.",
    features: [
      "Provision in seconds",
      "Automatic backups",
      "Query insights and monitoring",
      "Connection pooling",
    ],
    phase: "Phase 4",
    availability: "Planned",
  },
  storage: {
    key: "storage",
    href: "/storage",
    title: "Object Storage",
    icon: Cloud,
    short: "Scalable file storage",
    description:
      "Store and serve files of any size with signed URLs, CDN edge delivery and fine-grained access rules.",
    features: [
      "Durable object storage",
      "Signed URLs and CDN",
      "Resumable uploads",
      "Fine-grained access rules",
    ],
    phase: "Phase 4",
    availability: "Planned",
  },
  integrations: {
    key: "integrations",
    href: "/integrations",
    title: "Integrations",
    icon: Plug,
    short: "Connect your stack",
    description:
      "Connect the tools you already use — Slack, GitHub, Stripe and more — with secure, reversible connections.",
    features: [
      "One-click OAuth connections",
      "Popular providers out of the box",
      "Secure, scoped credentials",
      "Webhooks both ways",
    ],
    phase: "Phase 4",
    availability: "Planned",
  },
  help: {
    key: "help",
    href: "/help",
    title: "Help & Support",
    icon: LifeBuoy,
    short: "Documentation and support",
    description:
      "Guides, documentation and support resources — everything you need to get the most from your workspace.",
    features: [
      "Product documentation",
      "Guides and tutorials",
      "API reference",
      "Contact the team",
    ],
    phase: "Live",
    availability: "Available now",
  },
};
