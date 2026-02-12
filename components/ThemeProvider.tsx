"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "device";

function useSystemDark() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false,
  );
}

function setThemeCookie(theme: Theme) {
  if (theme === "device") {
    document.cookie = "theme=; path=/; max-age=0";
  } else {
    document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }
}

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const systemDark = useSystemDark();
  const isDark = theme === "dark" || (theme === "device" && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const cycleTheme = useCallback(() => {
    setTheme((curr) => {
      const order: Theme[] = systemDark
        ? ["device", "light", "dark"]
        : ["device", "dark", "light"];
      const next = order[(order.indexOf(curr) + 1) % order.length];
      setThemeCookie(next);
      return next;
    });
  }, [systemDark]);

  const value = useMemo(
    () => ({ theme, isDark, cycleTheme }),
    [theme, isDark, cycleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
