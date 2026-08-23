import { api } from "./api";
import type { SessionInfo, User, UserBundle, UserPreferences, Profile, Workspace, WorkspaceDetail, Project, WaitlistEntry, AdminUser, AdminOverview } from "@/types";

export const waitlistApi = {
  join: (body: { email: string; name: string }) =>
    api.post<null>("/api/waitlist/join", body),
};

export const adminApi = {
  overview: () => api.get<AdminOverview>("/api/admin/overview"),
  users: () => api.get<{ users: AdminUser[] }>("/api/admin/users"),
  setUserActive: (userId: string, isActive: boolean) =>
    api.patch<null>(`/api/admin/users/${userId}/active`, { isActive }),
  waitlist: () => api.get<{ entries: WaitlistEntry[] }>("/api/admin/waitlist"),
  grant: (entryId: string) => api.post<null>(`/api/admin/waitlist/${entryId}/grant`),
  revoke: (entryId: string) => api.post<null>(`/api/admin/waitlist/${entryId}/revoke`),
};

export const authApi = {
  login: (body: { identifier: string; password: string; rememberMe?: boolean }) =>
    api.post<{ user: User; sessionId: string; pendingVerification: boolean }>("/api/auth/login", body),

  register: (body: { email: string; username: string; fullName: string; password: string }) =>
    api.post<{ user: User; sessionId: string }>("/api/auth/register", body),

  logout: () => api.post<null>("/api/auth/logout"),
  logoutAll: () => api.post<null>("/api/auth/logout-all"),

  verifyEmail: (token: string) => api.post<{ verified: boolean }>("/api/auth/verify-email", { token }),
  resendVerification: (email: string) =>
    api.post<{ sent: boolean }>("/api/auth/resend-verification", { email }),

  forgotPassword: (email: string) => api.post<{ sent: boolean }>("/api/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post<{ reset: boolean }>("/api/auth/reset-password", { token, password }),
};

export const userApi = {
  me: () => api.get<UserBundle>("/api/user/me"),

  updateProfile: (body: Partial<Profile> & { fullName?: string; timezone?: string; avatarUrl?: string | null }) =>
    api.patch<{ user: User; profile: Profile }>("/api/user/profile", body),

  updatePreferences: (body: Partial<UserPreferences>) =>
    api.patch<{ preferences: UserPreferences }>("/api/user/preferences", body),

  changeEmail: (email: string) => api.patch<{ changed: boolean }>("/api/user/email", { email }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch<{ changed: boolean }>("/api/user/password", { currentPassword, newPassword }),

  getSessions: () => api.get<{ sessions: SessionInfo[] }>("/api/user/sessions"),
  revokeSession: (sessionId: string) => api.delete<{ revoked: boolean }>(`/api/user/sessions/${sessionId}`),

  deleteAccount: (password: string) => api.delete<{ deleted: boolean }>("/api/user/account", { password }),
};

export const workspaceApi = {
  list: () => api.get<{ workspaces: Workspace[] }>("/api/workspace"),
  get: (workspaceId: string) => api.get<WorkspaceDetail>(`/api/workspace/${workspaceId}`),
  projects: (workspaceId: string) => api.get<{ projects: Project[] }>(`/api/workspace/${workspaceId}/projects`),
  createProject: (workspaceId: string, body: { name: string; description?: string; icon?: string; color?: string }) =>
    api.post<{ project: Project }>(`/api/workspace/${workspaceId}/projects`, body),
};
