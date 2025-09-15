import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ProgressCard } from "@/components/ProgressCard";
import { LessonCard } from "@/components/LessonCard";
import { CategoryCard } from "@/components/CategoryCard";
import { CodeEditor } from "@/components/CodeEditor";
import { Calculator } from "@/components/Calculator";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const categoryData = [
  {
    name: "Science",
    icon: "fas fa-microscope", 
    description: "60 lessons across biology, chemistry, physics, and earth science",
    gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
    href: "/category/science",
    iconColor: "bg-blue-100"
  },
  {
    name: "Technology",
    icon: "fas fa-laptop-code",
    description: "60 lessons in programming, AI, cybersecurity, and data science", 
    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
    href: "/category/technology",
    iconColor: "bg-purple-100"
  },
  {
    name: "Engineering", 
    icon: "fas fa-cogs",
    description: "60 lessons in mechanical, electrical, civil, and software engineering",
    gradient: "bg-gradient-to-br from-green-500 to-teal-600",
    href: "/category/engineering", 
    iconColor: "bg-green-100"
  },
  {
    name: "Mathematics",
    icon: "fas fa-calculator",
    description: "60 lessons in algebra, calculus, statistics, and applied math",
    gradient: "bg-gradient-to-br from-orange-500 to-red-600", 
    href: "/category/mathematics",
    iconColor: "bg-orange-100"
  }
];

export default function Dashboard() {
  const [, navigate] = useLocation();

  const { data: progress = [] as any[] } = useQuery({
    queryKey: ["/api/progress"],
  });

  const { data: lessons = [] as any[] } = useQuery({
    queryKey: ["/api/lessons"], 
  });

  // Calculate progress for each category
  const getProgressForCategory = (categoryName: string) => {
    if (!progress || !lessons) return { completed: 0, total: 20, progress: 0 };
    
    const categoryLessons = lessons.filter((lesson: any) => 
      lesson.categoryId === categoryName.toLowerCase()
    );
    const completedLessons = progress.filter((p: any) => 
      p.isCompleted && categoryLessons.some((lesson: any) => lesson.id === p.lessonId)
    );
    
    const total = Math.max(categoryLessons.length, 20);
    const completed = completedLessons.length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, progress: progressPercent };
  };

  // Get featured lessons (in progress or recommended)
  const getFeaturedLessons = () => {
    if (!lessons || !progress) return [];
    
    // Get lessons with progress
    const lessonsWithProgress = lessons.map((lesson: any) => {
      const lessonProgress = progress.find((p: any) => p.lessonId === lesson.id);
      return {
        ...lesson,
        progress: lessonProgress?.score || 0,
        status: lessonProgress?.isCompleted ? 'completed' : 
                lessonProgress ? 'in-progress' : 'not-started'
      };
    });
    
    // Prioritize in-progress lessons, then not-started
    const inProgress = lessonsWithProgress.filter((l: any) => l.status === 'in-progress');
    const notStarted = lessonsWithProgress.filter((l: any) => l.status === 'not-started');
    
    return [...inProgress, ...notStarted].slice(0, 2);
  };

  const featuredLessons = getFeaturedLessons();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        
        <SidebarInset className="flex-1">
          <Header />
          
          <main className="flex-1 p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Progress Overview */}
          <section>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Your Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {categoryData.map((category) => {
                const progressData = getProgressForCategory(category.name);
                return (
                  <ProgressCard
                    key={category.name}
                    title={category.name}
                    icon={category.icon}
                    iconColor={category.iconColor}
                    completed={progressData.completed}
                    total={progressData.total}
                    progress={progressData.progress}
                  />
                );
              })}
            </div>
          </section>

          {/* Current Lessons */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">Continue Learning</h3>
              <button className="text-primary text-sm font-medium hover:underline" data-testid="view-all-lessons">
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {featuredLessons.map((lesson: any) => (
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
          </section>

          {/* Lesson Categories */}
          <section>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Explore Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {categoryData.map((category) => (
                <CategoryCard
                  key={category.name}
                  name={category.name}
                  icon={category.icon}
                  description={category.description}
                  gradient={category.gradient}
                  href={category.href}
                />
              ))}
            </div>
          </section>

          {/* Code Editor Demo */}
          <CodeEditor />

          {/* Math Calculator Demo */}
          <Calculator />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
