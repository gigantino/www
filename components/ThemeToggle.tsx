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
      className={`neo-button ${className}`}
      style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon size={18} />
    </button>
  );
}
