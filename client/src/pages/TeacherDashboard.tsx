import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherDashboard() {
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

  // Redirect if not teacher
  useEffect(() => {
    if (user && user.role !== 'teacher') {
      toast({
        title: "Access Denied", 
        description: "You don't have permission to access the teacher dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [user, toast]);

  const { data: classrooms = [], isLoading: classroomsLoading } = useQuery({
    queryKey: ["/api/teacher/classrooms"],
    enabled: !!user && user.role === 'teacher',
  });

  if (isLoading || classroomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'teacher') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" data-testid="teacher-dashboard-title">Teacher Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome, {user.firstName} {user.lastName}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="stats-classrooms">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Classrooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classrooms.length}</div>
            </CardContent>
          </Card>

          <Card data-testid="stats-students">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Across all classrooms</p>
            </CardContent>
          </Card>

          <Card data-testid="stats-lessons">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Currently assigned</p>
            </CardContent>
          </Card>
        </div>

        {/* Classrooms Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">My Classrooms</h2>
            <Button data-testid="create-classroom-button">
              <i className="fas fa-plus mr-2"></i>
              Create Classroom
            </Button>
          </div>

          {classrooms.length === 0 ? (
            <Card data-testid="no-classrooms">
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <i className="fas fa-chalkboard text-4xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">No classrooms yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first classroom to start managing students and lessons.
                </p>
                <Button data-testid="create-first-classroom">
                  <i className="fas fa-plus mr-2"></i>
                  Create Your First Classroom
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classrooms.map((classroom: any) => (
                <Card key={classroom.id} className="hover:shadow-md transition-shadow" data-testid={`classroom-${classroom.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{classroom.name}</span>
                      <i className="fas fa-users text-muted-foreground"></i>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>Students: -- enrolled</div>
                      <div>Created: {new Date(classroom.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="mt-4 space-x-2">
                      <Button size="sm" variant="outline" data-testid={`view-classroom-${classroom.id}`}>
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" data-testid={`manage-students-${classroom.id}`}>
                        Manage Students
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="assign-lessons">
              <i className="fas fa-book text-xl"></i>
              <span>Assign Lessons</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="view-progress">
              <i className="fas fa-chart-line text-xl"></i>
              <span>View Progress</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="manage-permissions">
              <i className="fas fa-key text-xl"></i>
              <span>Manage Permissions</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex-col space-y-2" data-testid="create-report">
              <i className="fas fa-file-alt text-xl"></i>
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <Card data-testid="recent-activity">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <i className="fas fa-clock text-4xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
              <p className="text-muted-foreground">
                Student activity and progress updates will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
