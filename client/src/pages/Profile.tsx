import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import {
  themePreferenceLabels,
  themePreferences,
  type ThemePreference,
} from "@shared/theme";
import { Monitor, Moon, Sun } from "lucide-react";

const themeIcons: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();
  const { user } = useAuth() as {
    user: {
      username: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      role: string;
      themePreference?: ThemePreference;
    } | null;
  };

  const [themePreference, setThemePreference] = useState<ThemePreference>("system");

  useEffect(() => {
    if (user?.themePreference) {
      setThemePreference(user.themePreference);
    }
  }, [user?.themePreference]);

  const saveMutation = useMutation({
    mutationFn: async (preference: ThemePreference) => {
      const res = await apiRequest("PATCH", "/api/auth/profile", { themePreference: preference });
      return res.json();
    },
    onSuccess: (data: { themePreference: ThemePreference }) => {
      setTheme(data.themePreference);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile updated",
        description: "Your appearance preference has been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not save",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return null;
  }

  const hasChanges = themePreference !== (user.themePreference ?? "system");

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="profile-title">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account and appearance settings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your sign-in details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Username</span>
              <span className="font-medium" data-testid="profile-username">
                {user.username}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Name</span>
              <span data-testid="profile-name">
                {[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span data-testid="profile-email">{user.email || "—"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Role</span>
              <span className="capitalize" data-testid="profile-role">
                {user.role}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Choose light, dark, or match your device&apos;s system setting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={themePreference}
              onValueChange={(value) => {
                const pref = value as ThemePreference;
                setThemePreference(pref);
                setTheme(pref);
              }}
              className="grid gap-3"
              data-testid="theme-preference-group"
            >
              {themePreferences.map((pref) => {
                const Icon = themeIcons[pref];
                return (
                  <div
                    key={pref}
                    className="flex items-center space-x-3 rounded-lg border border-border p-3 hover:bg-accent/50"
                  >
                    <RadioGroupItem value={pref} id={`theme-${pref}`} data-testid={`theme-${pref}`} />
                    <Label
                      htmlFor={`theme-${pref}`}
                      className="flex flex-1 cursor-pointer items-center gap-3 font-normal"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{themePreferenceLabels[pref]}</span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            <Button
              onClick={() => saveMutation.mutate(themePreference)}
              disabled={!hasChanges || saveMutation.isPending}
              data-testid="save-profile-button"
            >
              {saveMutation.isPending ? "Saving..." : "Save appearance"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
