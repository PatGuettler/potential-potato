import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { normalizeThemePreference } from "@shared/theme";

/** Applies the signed-in user's profile theme preference via next-themes. */
export function ThemeSync() {
  const { user, isAuthenticated } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    setTheme(normalizeThemePreference(user.themePreference));
  }, [isAuthenticated, user?.themePreference, setTheme, user]);

  return null;
}
