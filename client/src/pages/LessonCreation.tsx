import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { User, Category } from "@shared/schema";

// Types for structured lesson content
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

  // Helper functions for managing sections and questions
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

  // Count total questions across all sections
  const totalQuestions = lessonSections.reduce((total, section) => total + section.questions.length, 0);

  const { data: categories = [] } = useQuery({
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

    // Validation for quiz builder mode
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
      // Serialize structured content to JSON if using quiz builder
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
                      {(categories as Category[]).map((category: Category) => (
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

              {/* Content Type Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="quiz-builder-toggle">Content Type</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose between traditional content or structured quiz format
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${!useQuizBuilder ? 'font-medium' : 'text-gray-500'}`}>
                      Legacy Content
                    </span>
                    <Switch
                      id="quiz-builder-toggle"
                      data-testid="switch-quiz-builder"
                      checked={useQuizBuilder}
                      onCheckedChange={setUseQuizBuilder}
                    />
                    <span className={`text-sm ${useQuizBuilder ? 'font-medium' : 'text-gray-500'}`}>
                      Quiz Builder
                    </span>
                  </div>
                </div>

                {/* Legacy Content Mode */}
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

                {/* Quiz Builder Mode */}
                {useQuizBuilder && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Quiz Builder</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Create structured lessons with sections and questions
                          {totalQuestions > 0 && (
                            <Badge variant="secondary" className="ml-2" data-testid="badge-question-count">
                              {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={addSection}
                        variant="outline"
                        size="sm"
                        data-testid="button-add-section"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                    </div>

                    {/* Sections List */}
                    <div className="space-y-4">
                      {lessonSections.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="text-no-sections">
                          <p>No sections yet. Add your first section to get started.</p>
                        </div>
                      ) : (
                        lessonSections.map((section, sectionIndex) => (
                          <Card key={section.id} className="p-4" data-testid={`card-section-${section.id}`}>
                            <div className="space-y-4">
                              {/* Section Header */}
                              <div className="flex items-start gap-4">
                                <GripVertical className="h-5 w-5 text-gray-400 mt-2 flex-shrink-0" />
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">Section {sectionIndex + 1}</h4>
                                    <Badge variant="outline" data-testid={`badge-section-questions-${section.id}`}>
                                      {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`section-title-${section.id}`}>Section Title *</Label>
                                      <Input
                                        id={`section-title-${section.id}`}
                                        data-testid={`input-section-title-${section.id}`}
                                        value={section.title}
                                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                        placeholder="Enter section title"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`section-description-${section.id}`}>Description (Optional)</Label>
                                      <Input
                                        id={`section-description-${section.id}`}
                                        data-testid={`input-section-description-${section.id}`}
                                        value={section.description || ''}
                                        onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                                        placeholder="Brief section description"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  onClick={() => removeSection(section.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  data-testid={`button-remove-section-${section.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Questions for this section */}
                              <div className="ml-9 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Questions</h5>
                                  <Button
                                    type="button"
                                    onClick={() => addQuestion(section.id)}
                                    variant="outline"
                                    size="sm"
                                    data-testid={`button-add-question-${section.id}`}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Question
                                  </Button>
                                </div>

                                {section.questions.length === 0 ? (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 py-2" data-testid={`text-no-questions-${section.id}`}>
                                    No questions yet. Add your first question.
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    {section.questions.map((question, questionIndex) => (
                                      <Card key={question.id} className="p-3 bg-gray-50 dark:bg-gray-800" data-testid={`card-question-${question.id}`}>
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Question {questionIndex + 1}</span>
                                            <Button
                                              type="button"
                                              onClick={() => removeQuestion(section.id, question.id)}
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                              data-testid={`button-remove-question-${question.id}`}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                              <Label htmlFor={`question-prompt-${question.id}`}>Question Prompt *</Label>
                                              <Textarea
                                                id={`question-prompt-${question.id}`}
                                                data-testid={`textarea-question-prompt-${question.id}`}
                                                value={question.prompt}
                                                onChange={(e) => updateQuestion(section.id, question.id, 'prompt', e.target.value)}
                                                placeholder="Enter the question prompt"
                                                rows={2}
                                              />
                                            </div>
                                            
                                            <div className="space-y-2">
                                              <Label htmlFor={`question-type-${question.id}`}>Question Type *</Label>
                                              <Select
                                                value={question.type}
                                                onValueChange={(value) => updateQuestion(section.id, question.id, 'type', value)}
                                              >
                                                <SelectTrigger data-testid={`select-question-type-${question.id}`}>
                                                  <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="text">Text</SelectItem>
                                                  <SelectItem value="number">Number</SelectItem>
                                                  <SelectItem value="code">Code</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <Label htmlFor={`question-answer-${question.id}`}>Expected Answer *</Label>
                                            <Textarea
                                              id={`question-answer-${question.id}`}
                                              data-testid={`textarea-question-answer-${question.id}`}
                                              value={question.expectedAnswer}
                                              onChange={(e) => updateQuestion(section.id, question.id, 'expectedAnswer', e.target.value)}
                                              placeholder="Enter the expected answer or criteria"
                                              rows={2}
                                            />
                                          </div>

                                          <div className="flex items-center gap-4">
                                            <div className="flex items-center space-x-2">
                                              <Switch
                                                id={`question-case-sensitive-${question.id}`}
                                                data-testid={`switch-question-case-sensitive-${question.id}`}
                                                checked={question.caseSensitive || false}
                                                onCheckedChange={(checked) => updateQuestion(section.id, question.id, 'caseSensitive', checked)}
                                              />
                                              <Label htmlFor={`question-case-sensitive-${question.id}`} className="text-sm">
                                                Case Sensitive
                                              </Label>
                                            </div>
                                          </div>
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {lessonForm.categoryId === 'engineering' && (
                <div className="space-y-2">
                  <Label htmlFor="programming">Programming Language</Label>
                  <Select
                    value={lessonForm.programmingLanguage}
                    onValueChange={(value) => setLessonForm(prev => ({ ...prev, programmingLanguage: value }))}
                  >
                    <SelectTrigger data-testid="select-programming">
                      <SelectValue placeholder="Select programming language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="arduino">Arduino</SelectItem>
                      <SelectItem value="scratch">Scratch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(user.role === 'teacher' || user.role === 'admin') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="answer">Answer (Passing Criteria) *</Label>
                    <Textarea
                      id="answer"
                      data-testid="textarea-answer"
                      value={lessonForm.answer}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Expected answer or passing criteria for lesson completion..."
                      rows={3}
                    />
                  </div>
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
                </>
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