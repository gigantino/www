"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const themeIcons = {
  device: Monitor,
  light: Sun,
  dark: Moon,
} as const;

const themeLabels = {
  device: "System theme",
  light: "Light mode",
  dark: "Dark mode",
} as const;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, cycleTheme } = useTheme();
  const Icon = themeIcons[theme];

  return (
    <button
      onClick={cycleTheme}
      aria-label={themeLabels[theme]}
      title={themeLabels[theme]}
      className={`cursor-pointer rounded-xl border-2 border-gray-800 p-1.5 shadow-[2px_2px_0_theme(colors.gray.800)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_theme(colors.gray.800)] dark:border-gray-500 dark:shadow-[2px_2px_0_theme(colors.gray.600)] dark:bg-gray-700 dark:text-gray-100 ${className}`}
    >
      <Icon size={18} />
    </button>
  );
}
