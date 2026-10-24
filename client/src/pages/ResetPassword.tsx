import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, setSignedInUser } from "@/lib/queryClient";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const reset = useMutation({
    mutationFn: () => apiRequest("POST", "/api/password/reset", { token, password }),
    onSuccess: (user) => {
      toast({ title: "Password updated", description: "You're signed in. Other devices were signed out." });
      setSignedInUser(user);
      navigate("/");
    },
    onError: (e: Error) => toast({ title: "Couldn't reset password", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Choose a new password</CardTitle>
          <CardDescription>At least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (password !== confirm) {
                toast({ title: "Passwords don't match", variant: "destructive" });
                return;
              }
              reset.mutate();
            }}
          >
            <FormField id="new-password" label="New password" type="password" value={password} onChange={setPassword} required dataTestId="reset-password" />
            <FormField id="confirm-password" label="Confirm password" type="password" value={confirm} onChange={setConfirm} required dataTestId="reset-confirm" />
            <Button type="submit" className="w-full" disabled={reset.isPending} data-testid="reset-submit">Set password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
