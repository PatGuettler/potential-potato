import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LessonCard } from "@/components/LessonCard";
import type { Lesson, DifficultyLevel } from "@shared/schema";

const categoryInfo = {
  science: {
    title: "Science",
    icon: "fas fa-microscope",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Explore the natural world through biology, chemistry, physics, and earth science.",
  },
  technology: {
    title: "Technology", 
    icon: "fas fa-laptop-code",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Master programming, AI, cybersecurity, and data science fundamentals.",
  },
  engineering: {
    title: "Engineering",
    icon: "fas fa-cogs", 
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Learn mechanical, electrical, civil, and software engineering principles.",
  },
  mathematics: {
    title: "Mathematics",
    icon: "fas fa-calculator",
    color: "text-orange-600", 
    bgColor: "bg-orange-100",
    description: "Build strong foundations in algebra, calculus, statistics, and applied math.",
  },
};

export default function CategoryView() {
  const { category } = useParams();
  const [, navigate] = useLocation();
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | "all">("all");

  const categoryData = categoryInfo[category as keyof typeof categoryInfo];

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["/api/lessons/category", category],
    enabled: !!category,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/progress/category", category],
    enabled: !!category,
  });

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading lessons...</p>
        </div>
      </div>
    );
  }

  // Filter lessons by difficulty
  const filteredLessons = lessons.filter((lesson: Lesson) => 
    difficultyFilter === "all" || lesson.difficulty === difficultyFilter
  );

  // Combine lessons with progress data
  const lessonsWithProgress = filteredLessons.map((lesson: Lesson) => {
    const lessonProgress = progress.find((p: any) => p.lessonId === lesson.id);
    return {
      ...lesson,
      progress: lessonProgress?.score || 0,
      status: lessonProgress?.isCompleted ? 'completed' : 
              lessonProgress ? 'in-progress' : 'not-started'
    };
  });

  // Calculate category stats
  const totalLessons = lessons.length;
  const completedLessons = progress.filter((p: any) => p.isCompleted).length;
  const categoryProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const easyLessons = lessons.filter((l: Lesson) => l.difficulty === 'easy').length;
  const mediumLessons = lessons.filter((l: Lesson) => l.difficulty === 'medium').length;
  const hardLessons = lessons.filter((l: Lesson) => l.difficulty === 'hard').length;

  return (
    <AppShell>
      <div className="space-y-8">
      <div className="border border-border bg-card rounded-xl">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              data-testid="back-to-dashboard"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className={`w-16 h-16 ${categoryData.bgColor} rounded-2xl flex items-center justify-center`}>
              <i className={`${categoryData.icon} ${categoryData.color} text-2xl`}></i>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" data-testid="category-title">{categoryData.title}</h1>
              <p className="text-muted-foreground mb-4" data-testid="category-description">
                {categoryData.description}
              </p>
              
              {/* Progress Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="font-semibold" data-testid="category-progress">{categoryProgress}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-semibold" data-testid="completed-lessons">{completedLessons}/{totalLessons}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 border border-border" data-testid="stats-total">
            <div className="text-2xl font-bold">{totalLessons}</div>
            <div className="text-sm text-muted-foreground">Total Lessons</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border" data-testid="stats-easy">
            <div className="text-2xl font-bold text-green-600">{easyLessons}</div>
            <div className="text-sm text-muted-foreground">Easy</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border" data-testid="stats-medium">
            <div className="text-2xl font-bold text-yellow-600">{mediumLessons}</div>
            <div className="text-sm text-muted-foreground">Medium</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border" data-testid="stats-hard">
            <div className="text-2xl font-bold text-red-600">{hardLessons}</div>
            <div className="text-sm text-muted-foreground">Hard</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Lessons</h2>
          <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value as any)}>
            <SelectTrigger className="w-48" data-testid="difficulty-filter">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12" data-testid="no-lessons">
            <div className="text-muted-foreground mb-4">
              <i className="fas fa-book text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">No lessons available</h3>
            <p className="text-muted-foreground">
              {difficultyFilter === "all" 
                ? "No lessons have been created for this category yet."
                : `No ${difficultyFilter} lessons are available in this category.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessonsWithProgress.map((lesson: any) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={lesson.progress}
                status={lesson.status}
                onContinue={() => navigate(`/lesson/${lesson.id}`)}
                onStart={() => navigate(`/lesson/${lesson.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </AppShell>
  );
}
