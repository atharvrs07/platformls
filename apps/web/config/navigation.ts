import {
  Bell,
  Bot,
  Brain,
  Braces,
  Cloud,
  CreditCard,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  Languages,
  Laptop,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Plug,
  Puzzle,
  Settings,
  Server,
  LifeBuoy,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  status?: "live" | "soon";
  badge?: string;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const dashboardNav: NavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, status: "live" }],
  },
  {
    label: "Workspace",
    items: [
      { label: "AI Chat", href: "/chat", icon: MessageSquare, status: "soon" },
      { label: "Flows", href: "/flows", icon: GitBranch, status: "soon" },
      { label: "Agents", href: "/agents", icon: Bot, status: "soon" },
      { label: "Voice Studio", href: "/voice", icon: Mic, status: "soon" },
      { label: "Apps", href: "/apps", icon: Puzzle, status: "soon" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Backend", href: "/backend", icon: Server, status: "soon" },
      { label: "Database", href: "/database", icon: Database, status: "soon" },
      { label: "Storage", href: "/storage", icon: Cloud, status: "soon" },
      { label: "Integrations", href: "/integrations", icon: Plug, status: "soon" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Billing", href: "/billing", icon: CreditCard, status: "live" },
      { label: "Settings", href: "/settings", icon: Settings, status: "live" },
    ],
  },
];

export const sidebarFooterItems: NavItem[] = [
  { label: "Help & Support", href: "/help", icon: LifeBuoy, status: "soon" },
];

export const adminNav: NavGroup[] = [
  {
    label: "Administration",
    items: [{ label: "Admin Panel", href: "/admin", icon: ShieldCheck }],
  },
];

export const settingsNav: NavGroup[] = [
  {
    items: [{ label: "Profile", href: "/settings", icon: UserRound }],
  },
  {
    label: "Preferences",
    items: [
      { label: "Appearance", href: "/settings/appearance", icon: Laptop },
      { label: "Notifications", href: "/settings/notifications", icon: Bell },
      { label: "Language", href: "/settings/language", icon: Languages },
    ],
  },
  {
    label: "Security",
    items: [
      { label: "Security", href: "/settings/security", icon: ShieldCheck },
      { label: "Sessions", href: "/settings/sessions", icon: Laptop },
    ],
  },
  {
    label: "Account",
    items: [{ label: "Billing", href: "/billing", icon: CreditCard }],
  },
];

export const comingSoonModules = [
  {
    href: "/chat",
    title: "AI Chat",
    description: "Conversational AI with context, memory and tool use.",
    icon: MessageSquare,
  },
  {
    href: "/flows",
    title: "Workflow Flows",
    description: "Visual automation to connect apps, data and logic.",
    icon: GitBranch,
  },
  {
    href: "/agents",
    title: "AI Agents",
    description: "Autonomous agents that plan, act and execute on your behalf.",
    icon: Bot,
  },
  {
    href: "/voice",
    title: "Voice Studio",
    description: "Generate and synthesize natural speech at scale.",
    icon: Mic,
  },
  {
    href: "/backend",
    title: "Backend Services",
    description: "Serverless functions, APIs and realtime infrastructure.",
    icon: Server,
  },
  {
    href: "/database",
    title: "Managed Database",
    description: "Postgres-powered databases with instant provisioning.",
    icon: Database,
  },
  {
    href: "/storage",
    title: "Object Storage",
    description: "Scalable storage with signed URLs and CDN edge delivery.",
    icon: Cloud,
  },
  {
    href: "/integrations",
    title: "Integrations",
    description: "Connect the tools you already use in a few clicks.",
    icon: Plug,
  },
] as const;

export const toolIcons = {
  chat: MessageSquare,
  flows: GitBranch,
  agents: Bot,
  voice: Mic,
  apps: Puzzle,
  backend: Server,
  database: Database,
  storage: Cloud,
  integrations: Plug,
  backendOther: Braces,
  docs: FileCode2,
  brain: Brain,
  globe: Globe,
  dashboard: LayoutDashboard,
  billing: CreditCard,
  settings: Settings,
} as const;

export type ToolKey = keyof typeof toolIcons;
