export const themes = ["light", "dark", "device"] as const;

export type Theme = (typeof themes)[number];

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "device";
}
