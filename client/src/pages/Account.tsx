import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { fullName } from "@/lib/format";

export default function Account() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const change = useMutation({
    mutationFn: () => apiRequest("POST", "/api/me/password", { currentPassword: form.currentPassword, newPassword: form.newPassword }),
    onSuccess: () => {
      toast({ title: "Password changed", description: "You've been signed out on every other device." });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    },
    onError: (e: Error) => toast({ title: "Couldn't change password", description: e.message, variant: "destructive" }),
  });

  return (
    <AppShell title="My account" subtitle={`${fullName(user ?? undefined)} · @${user?.username}`}>
      <Card className="max-w-lg">
        <CardHeader className="pb-2"><CardTitle className="text-base">Change password</CardTitle></CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (form.newPassword !== form.confirm) {
                toast({ title: "New passwords don't match", variant: "destructive" });
                return;
              }
              change.mutate();
            }}
          >
            <FormField id="current" label="Current password" type="password" value={form.currentPassword} onChange={set("currentPassword")} required />
            <FormField id="next" label="New password (8+ characters)" type="password" value={form.newPassword} onChange={set("newPassword")} required />
            <FormField id="confirm" label="Confirm new password" type="password" value={form.confirm} onChange={set("confirm")} required />
            <Button type="submit" disabled={change.isPending}>Change password</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
