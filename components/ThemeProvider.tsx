"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

  const prevIsDark = useRef(isDark);
  useEffect(() => {
    if (prevIsDark.current === isDark) return;
    prevIsDark.current = isDark;
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  const cycleTheme = useCallback(() => {
    const order: Theme[] = systemDark
      ? ["device", "light", "dark"]
      : ["device", "dark", "light"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    const nextIsDark = next === "dark" || (next === "device" && systemDark);

    setTheme(next);
    setThemeCookie(next);
    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.style.colorScheme = nextIsDark ? "dark" : "light";
    prevIsDark.current = nextIsDark;
  }, [theme, systemDark]);

  const value = useMemo(
    () => ({ theme, isDark, cycleTheme }),
    [theme, isDark, cycleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
