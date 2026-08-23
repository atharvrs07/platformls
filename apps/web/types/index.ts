export type Theme = "LIGHT" | "DARK" | "SYSTEM";
export type Plan = "FREE" | "PRO" | "TEAM" | "ENTERPRISE";
export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE";
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  timezone: string;
  role: "USER" | "ADMIN" | "OWNER";
  createdAt: string;
  lastLoginAt: string | null;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  company: string | null;
  title: string | null;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: Theme;
  language: string;
  emailNotifications: boolean;
  productUpdates: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  reducedMotion: boolean;
}

export interface Subscription {
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface Credits {
  balance: number;
  lifetime: number;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isPersonal: boolean;
  role?: WorkspaceRole;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionInfo {
  id: string;
  isCurrent: boolean;
  userAgent: string | null;
  ipAddress: string | null;
  lastActiveAt: string;
  createdAt: string;
  expiresAt: string;
}

export interface UserBundle {
  user: User;
  profile: Profile | null;
  preferences: UserPreferences | null;
  subscription: Subscription | null;
  credits: Credits | null;
  workspace: { id: string; name: string; slug: string; isPersonal: boolean } | null;
}

export interface WorkspaceDetail {
  workspace: Workspace;
  projects: Project[];
  memberCount: number;
}

export type WaitlistStatus = "PENDING" | "GRANTED";

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  status: WaitlistStatus;
  grantedAt: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: User["role"];
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  subscription: { plan: Plan; status: SubscriptionStatus } | null;
  credits: { balance: number; lifetime: number } | null;
}

export interface AdminOverview {
  users: { total: number; verified: number; admins: number };
  workspaces: number;
  projects: number;
  sessions: number;
  apiKeys: number;
  auditLogs: number;
  credits: { balanceSum: number; lifetimeSum: number; transactions: number };
  plans: { plan: Plan; count: number }[];
  recentUsers: Pick<User, "id" | "fullName" | "email" | "role" | "createdAt">[];
  recentTxns: {
    id: string;
    amount: number;
    reason: string;
    description: string | null;
    createdAt: string;
    user: { fullName: string; email: string } | null;
  }[];
}
