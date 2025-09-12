import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MonacoEditor } from "@/components/ui/monaco-editor";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Lesson } from "@shared/schema";

export default function LessonView() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [code, setCode] = useState("");
  const [userProgress, setUserProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", id],
    enabled: !!id,
  }) as { data: any, isLoading: boolean };

  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
        credentials: "include",
      });
      
      if (!response.ok) {
        const text = await response.text() || response.statusText;
        throw new Error(`${response.status}: ${text}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Progress Updated",
        description: "Your lesson progress has been saved.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "Error",
        description: "Failed to update progress.",
        variant: "destructive",
      });
    },
  });

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCompleteLesson = () => {
    if (!lesson) return;

    updateProgressMutation.mutate({
      lessonId: lesson.id,
      isCompleted: true,
      score: 100,
      timeSpent: timeSpent,
    });
  };

  const handleSaveProgress = () => {
    if (!lesson) return;

    updateProgressMutation.mutate({
      lessonId: lesson.id,
      isCompleted: false,
      score: userProgress,
      timeSpent: timeSpent,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                data-testid="back-button"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold" data-testid="lesson-title">{lesson.title}</h1>
                <p className="text-muted-foreground" data-testid="lesson-meta">
                  {lesson.categoryId} • {lesson.difficulty} • {lesson.estimatedDuration} min
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Progress: {userProgress}%
              </div>
              <Progress value={userProgress} className="w-32" data-testid="lesson-progress" />
              <Button 
                onClick={handleSaveProgress}
                variant="outline"
                disabled={updateProgressMutation.isPending}
                data-testid="save-progress-button"
              >
                Save Progress
              </Button>
              <Button 
                onClick={handleCompleteLesson}
                disabled={updateProgressMutation.isPending}
                data-testid="complete-lesson-button"
              >
                Complete Lesson
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border" data-testid="lesson-content">
              <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
              <div className="prose max-w-none" data-testid="lesson-description">
                <p>{lesson.description}</p>
                {lesson.content && (
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                )}
              </div>
            </div>

            {/* Code Editor for Programming Lessons */}
            {lesson.programmingLanguage && (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold">Code Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Language: {lesson.programmingLanguage}
                  </p>
                </div>
                <div className="p-6">
                  <MonacoEditor
                    value={code}
                    onChange={setCode}
                    language={lesson.programmingLanguage.toLowerCase()}
                    height="400px"
                  />
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      onClick={() => setUserProgress(Math.min(100, userProgress + 25))}
                      data-testid="run-code-button"
                    >
                      <i className="fas fa-play mr-2"></i>
                      Run Code
                    </Button>
                    <Button 
                      variant="outline"
                      data-testid="reset-code-button"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-card rounded-xl p-6 border border-border" data-testid="progress-sidebar">
              <h3 className="font-semibold mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion</span>
                    <span>{userProgress}%</span>
                  </div>
                  <Progress value={userProgress} />
                </div>
                <div className="text-sm text-muted-foreground">
                  Time spent: {timeSpent} minutes
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-card rounded-xl p-6 border border-border" data-testid="learning-objectives">
              <h3 className="font-semibold mb-4">Learning Objectives</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                  <span>Understand the core concepts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                  <span>Apply knowledge to real problems</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-circle text-muted-foreground mt-0.5"></i>
                  <span>Complete practical exercises</span>
                </li>
              </ul>
            </div>

            {/* Lesson Resources */}
            <div className="bg-card rounded-xl p-6 border border-border" data-testid="lesson-resources">
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" data-testid="resource-documentation">
                  <i className="fas fa-book mr-2"></i>
                  Documentation
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="resource-examples">
                  <i className="fas fa-code mr-2"></i>
                  Code Examples
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="resource-help">
                  <i className="fas fa-question-circle mr-2"></i>
                  Get Help
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
