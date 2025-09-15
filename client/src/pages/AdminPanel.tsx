import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function AdminPanel() {
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth() as { user: User | null, isLoading: boolean, isAuthenticated: boolean };

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [user, toast]);

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    enabled: !!user && user.role === 'admin',
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["/api/lessons"],
    enabled: !!user && user.role === 'admin',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Calculate statistics
  const totalLessons = lessons.length;
  const lessonsByDifficulty = {
    easy: lessons.filter((l: any) => l.difficulty === 'easy').length,
    medium: lessons.filter((l: any) => l.difficulty === 'medium').length,
    hard: lessons.filter((l: any) => l.difficulty === 'hard').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" data-testid="admin-panel-title">Admin Panel</h1>
              <p className="text-muted-foreground">
                System administration and content management
              </p>
            </div>
            <Button onClick={() => window.location.href = "/"} data-testid="back-to-main">
              Back to Main
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stats-total-lessons">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLessons}</div>
            </CardContent>
          </Card>

          <Card data-testid="stats-easy-lessons">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Easy Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{lessonsByDifficulty.easy}</div>
            </CardContent>
          </Card>

          <Card data-testid="stats-medium-lessons">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Medium Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lessonsByDifficulty.medium}</div>
            </CardContent>
          </Card>

          <Card data-testid="stats-hard-lessons">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hard Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lessonsByDifficulty.hard}</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">STEM Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category: any) => {
              const categoryLessons = lessons.filter((l: any) => l.categoryId === category.name.toLowerCase());
              return (
                <Card key={category.id} data-testid={`category-${category.name.toLowerCase()}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <i className={category.icon}></i>
                      <span>{category.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>Total Lessons: {categoryLessons.length}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-center">
                          E: {categoryLessons.filter((l: any) => l.difficulty === 'easy').length}
                        </div>
                        <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-center">
                          M: {categoryLessons.filter((l: any) => l.difficulty === 'medium').length}
                        </div>
                        <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-center">
                          H: {categoryLessons.filter((l: any) => l.difficulty === 'hard').length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }) || (
              <Card className="col-span-full" data-testid="no-categories">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No categories found. Please check the database setup.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Management Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Content Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/lesson-creation">
              <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="create-lesson">
                <i className="fas fa-plus text-xl"></i>
                <span>Create Lesson</span>
              </Button>
            </Link>
            
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="manage-users">
              <i className="fas fa-users text-xl"></i>
              <span>Manage Users</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="system-settings">
              <i className="fas fa-cogs text-xl"></i>
              <span>System Settings</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="view-analytics">
              <i className="fas fa-chart-bar text-xl"></i>
              <span>Analytics</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="backup-data">
              <i className="fas fa-download text-xl"></i>
              <span>Backup Data</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="system-logs">
              <i className="fas fa-file-alt text-xl"></i>
              <span>System Logs</span>
            </Button>
          </div>
        </div>

        {/* Recent Lessons */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Recent Lessons</h2>
          {lessons.length === 0 ? (
            <Card data-testid="no-lessons">
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <i className="fas fa-book text-4xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">No lessons created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first lesson to get started with the platform.
                </p>
                <Button data-testid="create-first-lesson">
                  <i className="fas fa-plus mr-2"></i>
                  Create First Lesson
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.slice(0, 6).map((lesson: any) => (
                <Card key={lesson.id} data-testid={`lesson-${lesson.id}`}>
                  <CardHeader>
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>Category: {lesson.categoryId}</div>
                      <div>Difficulty: {lesson.difficulty}</div>
                      <div>Duration: {lesson.estimatedDuration} min</div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" data-testid={`edit-lesson-${lesson.id}`}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`view-lesson-${lesson.id}`}>
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
