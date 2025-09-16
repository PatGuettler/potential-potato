import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

type Props = {
  setupNeeded: boolean;
  isRegistering: boolean;
};

export function LoginHeader({ setupNeeded, isRegistering }: Props) {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
      <CardTitle className="text-2xl">
        {setupNeeded ? "Welcome to STEM Academy" : "STEM Academy"}
      </CardTitle>
      <CardDescription>
        {setupNeeded
          ? "Create your first account to get started"
          : isRegistering
            ? "Create a new account"
            : "Sign in to your account"
        }
      </CardDescription>
    </CardHeader>
  );
}