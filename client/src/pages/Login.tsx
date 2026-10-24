import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, setSignedInUser } from "@/lib/queryClient";
import { isDemo } from "@/demo/backend";
import { DEMO_PASSWORD, demoAccounts } from "@shared/core/seed";
import type { PublicUser, Role } from "@shared/core/types";

const roleIcon: Record<Role, string> = {
  admin: "fas fa-user-shield text-rose-600",
  teacher: "fas fa-chalkboard-teacher text-blue-600",
  parent: "fas fa-people-roof text-emerald-600",
  student: "fas fa-user-graduate text-violet-600",
};

export default function Login() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [forgot, setForgot] = useState<{ message: string; demoLink?: string } | null>(null);
  const [form, setForm] = useState({ username: "", password: "", firstName: "", lastName: "", email: "" });
  const set = (field: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  const { data: setup } = useQuery<{ setupNeeded: boolean }>({ queryKey: ["/api/auth/setup-needed"] });
  const { data: org } = useQuery<{ organizationName: string }>({ queryKey: ["/api/org"] });
  const registering = mode === "register" || !!setup?.setupNeeded;

  const auth = useMutation({
    mutationFn: (payload: { path: string; body: object }) => apiRequest<PublicUser>("POST", payload.path, payload.body),
    onSuccess: (user) => {
      setSignedInUser(user);
      navigate("/");
    },
    onError: (error: Error) => toast({ title: "Couldn't sign in", description: error.message, variant: "destructive" }),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registering) auth.mutate({ path: "/api/register", body: form });
    else auth.mutate({ path: "/api/login", body: { username: form.username, password: form.password } });
  };

  const requestReset = useMutation({
    mutationFn: () => apiRequest<{ message: string; demoLink?: string }>("POST", "/api/password/forgot", { login: form.username }),
    onSuccess: setForgot,
    onError: (error: Error) => toast({ title: "Couldn't send reset link", description: error.message, variant: "destructive" }),
  });

  const quickLogin = (username: string) => auth.mutate({ path: "/api/login", body: { username, password: DEMO_PASSWORD } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-violet-50 dark:from-slate-950 dark:via-background dark:to-slate-900 flex items-center justify-center px-4 py-10">
      <div className={`w-full ${isDemo ? "max-w-4xl grid md:grid-cols-2 gap-6" : "max-w-md"}`}>
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-atom text-primary-foreground text-xl" />
            </div>
            <CardTitle className="text-2xl">{org?.organizationName ?? "STEM Academy"}</CardTitle>
            <CardDescription>
              {setup?.setupNeeded
                ? "Welcome! Create the administrator account to get started."
                : mode === "forgot"
                  ? "Reset your password"
                  : registering
                  ? "Create a student account"
                  : "Sign in to continue learning"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "forgot" && !setup?.setupNeeded ? (
              <div className="space-y-4">
                {forgot ? (
                  <div className="rounded-md bg-muted px-3 py-3 text-sm space-y-2" data-testid="forgot-result">
                    <p>{forgot.message}</p>
                    {forgot.demoLink && (
                      <a href={forgot.demoLink} className="text-primary underline font-medium" data-testid="demo-reset-link">
                        Demo: open the link that would have been emailed
                      </a>
                    )}
                  </div>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      requestReset.mutate();
                    }}
                  >
                    <FormField id="login" label="Username or email" value={form.username} onChange={set("username")} required dataTestId="input-forgot" />
                    <Button type="submit" className="w-full" disabled={requestReset.isPending} data-testid="forgot-submit">Send reset link</Button>
                  </form>
                )}
                <Button variant="link" className="w-full" onClick={() => { setMode("login"); setForgot(null); }}>Back to sign in</Button>
              </div>
            ) : (
            <>
            <form onSubmit={submit} className="space-y-4">
              <FormField id="username" label="Username" value={form.username} onChange={set("username")} required dataTestId="input-username" />
              <FormField id="password" label="Password" type="password" value={form.password} onChange={set("password")} required dataTestId="input-password" />
              {registering && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField id="firstName" label="First name" value={form.firstName} onChange={set("firstName")} />
                    <FormField id="lastName" label="Last name" value={form.lastName} onChange={set("lastName")} />
                  </div>
                  <FormField id="email" label="Email (optional)" type="email" value={form.email} onChange={set("email")} />
                  <p className="text-xs text-muted-foreground">Passwords need at least 8 characters.</p>
                </>
              )}
              <Button type="submit" className="w-full" disabled={auth.isPending} data-testid="button-submit">
                {auth.isPending ? "Please wait…" : registering ? "Create account" : "Sign in"}
              </Button>
            </form>
            {!setup?.setupNeeded && (
              <div className="mt-4 flex flex-col items-center">
                {!registering && (
                  <Button variant="link" size="sm" onClick={() => setMode("forgot")} data-testid="forgot-link">Forgot your password?</Button>
                )}
                <Button variant="link" size="sm" onClick={() => setMode(registering ? "login" : "register")} data-testid="button-toggle-mode">
                  {registering ? "Already have an account? Sign in" : "New student? Create an account"}
                </Button>
              </div>
            )}
            </>
            )}
          </CardContent>
        </Card>

        {isDemo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Try a demo account</CardTitle>
              <CardDescription>
                One click signs you in. Every account uses the password <code className="px-1 rounded bg-muted">{DEMO_PASSWORD}</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {demoAccounts.map((a) => (
                <button
                  key={a.username}
                  onClick={() => quickLogin(a.username)}
                  disabled={auth.isPending}
                  className="w-full flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted/60 transition-colors disabled:opacity-60"
                  data-testid={`demo-login-${a.username}`}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <i className={roleIcon[a.role]} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">
                      {a.label} <span className="text-xs text-muted-foreground font-normal">@{a.username}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{a.blurb}</div>
                  </div>
                  <i className="fas fa-arrow-right text-muted-foreground" />
                </button>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                Everything runs in your browser and is saved locally. Use “Reset demo data” in the banner to start over.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
