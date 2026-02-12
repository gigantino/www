"use client";

import { useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export function HomeShell({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  useEffect(() => {
    document.body.classList.toggle("home-dark", isDark);
    document.body.classList.toggle("home-light", !isDark);
    return () => {
      document.body.classList.remove("home-dark", "home-light");
    };
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[var(--neo-cream)] dark:bg-gray-950 px-4 py-8 font-sans sm:px-6 overflow-x-hidden">
      {children}
    </div>
  );
}
