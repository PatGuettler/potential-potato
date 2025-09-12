import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { User, Category } from "@shared/schema";

export default function LessonCreation() {
  const { user } = useAuth() as { user: User | null };
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content: "",
    categoryId: "",
    difficulty: "",
    estimatedDuration: "",
    programmingLanguage: "",
    answerGuide: "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      return await apiRequest("/api/admin/lessons", {
        method: "POST",
        body: JSON.stringify(lessonData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lesson created successfully!",
      });
      setLessonForm({
        title: "",
        description: "",
        content: "",
        categoryId: "",
        difficulty: "",
        estimatedDuration: "",
        programmingLanguage: "",
        answerGuide: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lessonForm.title || !lessonForm.categoryId || !lessonForm.difficulty) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createLessonMutation.mutate({
      ...lessonForm,
      estimatedDuration: lessonForm.estimatedDuration ? parseInt(lessonForm.estimatedDuration) : null,
    });
  };

  if (!user) {
    return <div>Please log in to create lessons.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="lesson-creation-page">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Lesson</h1>
          <p className="text-gray-600 dark:text-gray-400">Create engaging lessons for your students</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Lesson</CardTitle>
            <CardDescription>
              Create a new lesson for your students. Fill out the form below with lesson details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title *</Label>
                  <Input
                    id="title"
                    data-testid="input-title"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter lesson title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={lessonForm.categoryId}
                    onValueChange={(value) => setLessonForm(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.name.toLowerCase()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select
                    value={lessonForm.difficulty}
                    onValueChange={(value) => setLessonForm(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger data-testid="select-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="duration"
                    data-testid="input-duration"
                    type="number"
                    value={lessonForm.estimatedDuration}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  data-testid="textarea-description"
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what students will learn..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Lesson Content</Label>
                <Textarea
                  id="content"
                  data-testid="textarea-content"
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter the full lesson content, including explanations, examples, and activities..."
                  rows={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programming">Programming Language (if applicable)</Label>
                <Select
                  value={lessonForm.programmingLanguage}
                  onValueChange={(value) => setLessonForm(prev => ({ ...prev, programmingLanguage: value }))}
                >
                  <SelectTrigger data-testid="select-programming">
                    <SelectValue placeholder="Select programming language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(user.role === 'teacher' || user.role === 'admin') && (
                <div className="space-y-2">
                  <Label htmlFor="answerGuide">Answer Guide (Teacher Only)</Label>
                  <Textarea
                    id="answerGuide"
                    data-testid="textarea-answer-guide"
                    value={lessonForm.answerGuide}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, answerGuide: e.target.value }))}
                    placeholder="Solution guide for teachers..."
                    rows={4}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={createLessonMutation.isPending}
                data-testid="button-create-lesson"
                className="w-full md:w-auto"
              >
                {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}