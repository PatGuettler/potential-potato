import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { ProgressCard } from "@/components/ProgressCard";

export default function EditLessons() {
  const { user } = useAuth() as { user: { role: string } | null };
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch lessons for selected category
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery<any[]>({
    queryKey: ["/api/lessons/category", selectedCategory],
    enabled: !!selectedCategory,
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
        console.log("Deleting lesson with ID:", lessonId);
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete lesson");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Lesson Deleted", description: "The lesson was deleted." });
      queryClient.invalidateQueries({ queryKey: ["/api/lessons/category", selectedCategory] });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not delete lesson.", variant: "destructive" });
    },
  });

  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Only teachers and administrators can edit lessons.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Lessons</h1>
      {/* Category Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select a Category</h2>
        {/* Category Selection */}
        <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Select a Category</h2>
        {categoriesLoading ? (
            <div className="text-center text-muted-foreground">Loading categories...</div>
        ) : (
            <div className="flex flex-wrap justify-center gap-3">
            {(categories as any[]).map((cat: any, index: number) => {
                // Define a palette of category colors
                const colors = [
                "bg-pink-500 hover:bg-pink-600 text-white",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "bg-green-500 hover:bg-green-600 text-white",
                "bg-indigo-500 hover:bg-indigo-600 text-white",
                ];
                const colorClass = colors[index % colors.length];

                return (
                <Button
                    key={cat.id || cat.name}
                    onClick={() => setSelectedCategory(cat.id)}
                    data-testid={`category-${cat.id}`}
                    className={`transition-all duration-200 shadow-md rounded-full 
                    px-6 py-3 text-lg font-semibold 
                    ${selectedCategory === cat.id 
                        ? `ring-4 ring-offset-2 ring-${colorClass.split(" ")[0].replace("bg-", "")}` 
                        : colorClass
                    }
                    `}
                >
                    {cat.name}
                </Button>
                );
            })}
            </div>
        )}
        </div>

      {/* Lessons List */}
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Lessons in {categories.find((c: any) => c.id === selectedCategory)?.name}</h2>
          {lessonsLoading ? (
            <div>Loading lessons...</div>
          ) : lessons.length === 0 ? (
            <div>No lessons found in this category.</div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson: any) => (
                <div key={lesson.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{lesson.title}</div>
                    <div className="text-sm text-muted-foreground">{lesson.description}</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      data-testid={`view-lesson-${lesson.id}`}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/lesson-edit/${lesson.id}`)}
                      data-testid={`edit-lesson-${lesson.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteLessonMutation.mutate(lesson.id)}
                      data-testid={`delete-lesson-${lesson.id}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}