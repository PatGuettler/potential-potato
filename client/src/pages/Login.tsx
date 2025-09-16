import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { LoginHeader } from "@/components/LoginHeader";
import { CreateUser } from "@/components/CreateUser";
import { FormField } from "@/components/ui/FormField";

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "student" as "student" | "teacher" | "admin"
  });

  // Check if setup is needed (no users exist)
  type SetupInfo = { setupNeeded: boolean };
  const { data: setupInfo, isLoading } = useQuery<SetupInfo>({
    queryKey: ["/api/auth/setup-needed"],
  });

  useEffect(() => {
    if (setupInfo?.setupNeeded) {
      setIsRegistering(true);
    }
  }, [setupInfo]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return await apiRequest("POST", "/api/login", credentials);
    },
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      // Refresh authentication state
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
      return await apiRequest("POST", "/api/register", userData);
    },
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      // Refresh authentication state
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast({
        title: "Error",
        description: "Username and password are required.",
        variant: "destructive",
      });
      return;
    }

    if (isRegistering) {
      registerMutation.mutate(formData);
    } else {
      loginMutation.mutate({
        username: formData.username,
        password: formData.password,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  type FieldProps = {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    dataTestId?: string;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <LoginHeader setupNeeded={!!setupInfo?.setupNeeded} isRegistering={isRegistering} />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="username"
              label="Username"
              value={formData.username}
              onChange={(value) => handleInputChange("username", value)}
              placeholder="Enter your username"
              required
              dataTestId="input-username"
            />
            
            <FormField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Enter your password"
              required
              dataTestId="input-password"
            />
            <CreateUser 
              isRegistering={isRegistering}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending || registerMutation.isPending}
              data-testid="button-submit"
            >
              {(loginMutation.isPending || registerMutation.isPending) ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isRegistering ? "Creating Account..." : "Signing In..."}
                </div>
              ) : (
                isRegistering ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          {!setupInfo?.setupNeeded && (
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setIsRegistering(!isRegistering)}
                data-testid="button-toggle-mode"
              >
                {isRegistering 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Create one"
                }
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}