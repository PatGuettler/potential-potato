import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { BookOpen, Users, GraduationCap } from "lucide-react";

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "student" as "student" | "teacher" | "admin"
  });

  // Check if setup is needed (no users exist)
  const { data: setupInfo, isLoading } = useQuery({
    queryKey: ["/api/auth/setup-needed"],
  });

  useEffect(() => {
    if (setupInfo?.setupNeeded) {
      setIsRegistering(true);
      setShowRoleSelection(true);
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
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {setupInfo?.setupNeeded ? "Welcome to STEM Academy" : "STEM Academy"}
          </CardTitle>
          <CardDescription>
            {setupInfo?.setupNeeded 
              ? "Create your first account to get started"
              : isRegistering 
                ? "Create a new account" 
                : "Sign in to your account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Enter your username"
                required
                data-testid="input-username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                required
                data-testid="input-password"
              />
            </div>

            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    data-testid="input-email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name (optional)</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="First name"
                      data-testid="input-firstName"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name (optional)</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Last name"
                      data-testid="input-lastName"
                    />
                  </div>
                </div>

                {isRegistering && (
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => handleInputChange("role", value)}
                    >
                      <SelectTrigger data-testid="select-role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student" data-testid="role-student">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Student</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher" data-testid="role-teacher">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Teacher</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin" data-testid="role-admin">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4" />
                            <span>Administrator</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

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