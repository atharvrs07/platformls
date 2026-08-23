"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { userApi, authApi } from "@/services/api.endpoints";
import type { User, UserBundle } from "@/types";
import { ApiClientError } from "@/types/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface LoginResult {
  user: User;
  sessionId: string;
  pendingVerification: boolean;
}

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  bundle: UserBundle | null;
  refreshUser: () => Promise<void>;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<LoginResult>;
  register: (input: { email: string; username: string; fullName: string; password: string }) => Promise<{ user: User; sessionId: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [bundle, setBundle] = useState<UserBundle | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const data = await userApi.me();
      setBundle(data);
      setStatus("authenticated");
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        setBundle(null);
        setStatus("unauthenticated");
        return;
      }
      setBundle(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (identifier: string, password: string, rememberMe = false) => {
      const result = await authApi.login({ identifier, password, rememberMe });
      await refreshUser();
      return result;
    },
    [refreshUser]
  );

  const register = useCallback(
    async (input: { email: string; username: string; fullName: string; password: string }) => {
      const result = await authApi.register(input);
      await refreshUser();
      return result;
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setBundle(null);
      setStatus("unauthenticated");
      router.push("/login");
    }
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: bundle?.user ?? null,
      bundle,
      refreshUser,
      login,
      register,
      logout,
    }),
    [status, bundle, refreshUser, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
