"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useTheme as useNextTheme } from "next-themes";
import type { Theme } from "@/types";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const VALID: Theme[] = ["LIGHT", "DARK", "SYSTEM"];

export function ThemeProviderBridge({ children }: { children: ReactNode }) {
  const nextTheme = useNextTheme();
  const [theme, setThemeState] = useState<Theme>("SYSTEM");

  const setTheme = useCallback(
    (value: Theme) => {
      setThemeState(value);
      const mapped = value === "SYSTEM" ? "system" : value.toLowerCase();
      nextTheme.setTheme(mapped);
    },
    [nextTheme]
  );

  const value = useMemo<ThemeContextValue>(() => {
    const resolved = nextTheme.resolvedTheme === "dark" ? "dark" : "light";
    return {
      theme,
      resolvedTheme: resolved,
      isDark: resolved === "dark",
      setTheme,
    };
  }, [theme, nextTheme.resolvedTheme, setTheme]);

  if (!VALID.includes(theme)) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProviderBridge");
  }
  return context;
}
