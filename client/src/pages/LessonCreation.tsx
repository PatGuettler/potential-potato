import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { User, Category } from "@shared/schema";
import { LessonForm } from "@/components/LessonForm";
import { QuizBuilder } from "@/components/QuizBuilder";
import { LessonContentTypeToggle } from "@/components/LessonContentTypeToggle";
import { LessonProgrammingLanguage } from "@/components/LessonProgrammingLanguage";
import { LessonAnswerFields } from "@/components/LessonAnswerFields";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Question {
  id: string;
  prompt: string;
  type: 'text' | 'number' | 'code';
  expectedAnswer: string;
  caseSensitive?: boolean;
  options?: string[];
}

interface LessonSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export default function LessonCreation() {
  const { user } = useAuth() as { user: User | null };
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [useQuizBuilder, setUseQuizBuilder] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content: "",
    categoryId: "",
    difficulty: "",
    estimatedDuration: "",
    programmingLanguage: "",
    answerGuide: "",
    answer: "",
  });
  const [lessonSections, setLessonSections] = useState<LessonSection[]>([]);

  // Section and question handlers
  const addSection = () => {
    const newSection: LessonSection = {
      id: `section-${Date.now()}`,
      title: "",
      description: "",
      questions: []
    };
    setLessonSections(prev => [...prev, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setLessonSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const updateSection = (sectionId: string, field: keyof Omit<LessonSection, 'id' | 'questions'>, value: string) => {
    setLessonSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, [field]: value }
        : section
    ));
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      prompt: "",
      type: 'text',
      expectedAnswer: "",
      caseSensitive: false,
      options: []
    };
    setLessonSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    ));
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    setLessonSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
        : section
    ));
  };

  const updateQuestion = (sectionId: string, questionId: string, field: keyof Question, value: any) => {
    setLessonSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            questions: section.questions.map(question => 
              question.id === questionId 
                ? { ...question, [field]: value }
                : question
            )
          }
        : section
    ));
  };

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: any) => {
      return await apiRequest("POST", "/api/lessons", lessonData);
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
        answer: "",
      });
      setLessonSections([]);
      setUseQuizBuilder(false);
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

    if (useQuizBuilder) {
      if (lessonSections.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one section in quiz builder mode.",
          variant: "destructive",
        });
        return;
      }

      const hasInvalidSections = lessonSections.some(section => 
        !section.title.trim() || section.questions.some(q => !q.prompt.trim() || !q.expectedAnswer.trim())
      );

      if (hasInvalidSections) {
        toast({
          title: "Error",
          description: "Please fill in all section titles and question fields.",
          variant: "destructive",
        });
        return;
      }
    }

    const lessonData = {
      ...lessonForm,
      estimatedDuration: lessonForm.estimatedDuration ? parseInt(lessonForm.estimatedDuration) : null,
      ...(useQuizBuilder ? {
        content: JSON.stringify({
          type: 'structured',
          sections: lessonSections
        })
      } : {})
    };

    createLessonMutation.mutate(lessonData);
  };

  if (!user) {
    return <div>Please log in to create lessons.</div>;
  }

  // Only allow teachers and admins
  if (user.role !== "teacher" && user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Only teachers and administrators can create lessons.
        </p>
      </div>
    );
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
            <LessonForm
              lessonForm={lessonForm}
              setLessonForm={setLessonForm}
              categories={categories}
              useQuizBuilder={useQuizBuilder}
              setUseQuizBuilder={setUseQuizBuilder}
              user={user}
              onSubmit={handleSubmit}
              isPending={createLessonMutation.isPending}
            >
              <div className="space-y-4">
                <LessonContentTypeToggle
                  useQuizBuilder={useQuizBuilder}
                  setUseQuizBuilder={setUseQuizBuilder}
                />

                {!useQuizBuilder && (
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
                )}

                {useQuizBuilder && (
                  <QuizBuilder
                    lessonSections={lessonSections}
                    addSection={addSection}
                    removeSection={removeSection}
                    updateSection={updateSection}
                    addQuestion={addQuestion}
                    removeQuestion={removeQuestion}
                    updateQuestion={updateQuestion}
                  />
                )}
              </div>

              {lessonForm.categoryId === 'engineering' && (
                <LessonProgrammingLanguage
                  value={lessonForm.programmingLanguage}
                  onChange={(value) => setLessonForm(prev => ({ ...prev, programmingLanguage: value }))}
                />
              )}

              {!useQuizBuilder && (
                <LessonAnswerFields
                  answer={lessonForm.answer}
                  answerGuide={lessonForm.answerGuide}
                  setAnswer={value => setLessonForm(prev => ({ ...prev, answer: value }))}
                  setAnswerGuide={value => setLessonForm(prev => ({ ...prev, answerGuide: value }))}
                />
              )}
            </LessonForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}