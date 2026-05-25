export const themePreferences = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof themePreferences)[number];

export const themePreferenceLabels: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "Follow system setting",
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    themePreferences.includes(value as ThemePreference)
  );
}

export function normalizeThemePreference(
  value: unknown,
  fallback: ThemePreference = "system",
): ThemePreference {
  return isThemePreference(value) ? value : fallback;
}
