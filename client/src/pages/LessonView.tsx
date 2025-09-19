import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MonacoEditor } from "@/components/ui/monaco-editor";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import type { LessonContent, LessonQuestion } from "@shared/schema";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Play, RotateCcw, Save, Award, Loader } from "lucide-react";

export default function LessonView() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth() as { user: { role: string } | null };

  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", id],
    enabled: !!id,
  }) as { data: any, isLoading: boolean };

  // Load lesson progress
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/lessons", id, "progress"],
    enabled: !!id && !!lesson,
  });

  // Mutation for validating individual quiz questions
  const validateQuestionMutation = useMutation({
    mutationFn: async ({ lessonId, questionId, answer }: { lessonId: string; questionId: string; answer: string }) => {
      const response = await fetch(`/api/lessons/${lessonId}/questions/${questionId}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const text = await response.text() || response.statusText;
        throw new Error(`${response.status}: ${text}`);
      }
      
      return response.json();
    },
    onMutate: ({ questionId }) => {
      // Set loading state for the specific question
      setQuestionValidations(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isLoading: true,
        }
      }));
    },
    onSuccess: (data: { isCorrect: boolean; feedback: string }, { questionId }) => {
      // Update validation result for the specific question
      setQuestionValidations(prev => ({
        ...prev,
        [questionId]: {
          isCorrect: data.isCorrect,
          feedback: data.feedback,
          isLoading: false,
        }
      }));
      
      // Refresh lesson progress to get updated statistics
      queryClient.invalidateQueries({ queryKey: ["/api/lessons", id, "progress"] });
      
      // Show toast feedback
      if (data.isCorrect) {
        toast({
          title: "Correct!",
          description: data.feedback,
        });
      } else {
        toast({
          title: "Try Again",
          description: data.feedback,
          variant: "destructive",
        });
      }
    },
    onError: (error, { questionId }) => {
      setQuestionValidations(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          isLoading: false,
        }
      }));
      
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
        description: "Failed to validate answer.",
        variant: "destructive",
      });
    },
  });

  const validateAnswerMutation = useMutation({
    mutationFn: async ({ lessonId, studentAnswer }: { lessonId: string; studentAnswer: string }) => {
      const response = await fetch(`/api/lessons/${lessonId}/validate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentAnswer }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const text = await response.text() || response.statusText;
        throw new Error(`${response.status}: ${text}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnswerValidation(data);
      setCanComplete(data.isCorrect);
      
      if (data.isCorrect) {
        setUserProgress(Math.max(userProgress, data.score || 100));
        toast({
          title: "Correct Answer!",
          description: data.feedback,
        });
      } else {
        toast({
          title: "Try Again",
          description: data.feedback,
          variant: "destructive",
        });
      }
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
        description: "Failed to validate answer.",
        variant: "destructive",
      });
    },
  });

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

  const deleteLessonMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/lessons/${lesson.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete lesson");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Lesson Deleted", description: "The lesson was deleted." });
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      navigate("/dashboard");
    },
    onError: () => {
      toast({ title: "Error", description: "Could not delete lesson.", variant: "destructive" });
    },
  });

  const [code, setCode] = useState("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [answerValidation, setAnswerValidation] = useState<{
    isCorrect: boolean;
    feedback: string;
    score: number;
  } | null>(null);
  
  // Quiz-specific state
  const [lessonProgress, setLessonProgress] = useState<{
    total: number;
    correct: number;
    percent: number;
    perQuestion: { [questionId: string]: { isCorrect: boolean } };
  } | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<{ [questionId: string]: string }>({});
  const [questionValidations, setQuestionValidations] = useState<{
    [questionId: string]: {
      isCorrect: boolean;
      feedback: string;
      isLoading?: boolean;
    };
  }>({});
  const [structuredContent, setStructuredContent] = useState<LessonContent | null>(null);
  const [isLegacyContent, setIsLegacyContent] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [canComplete, setCanComplete] = useState(false);

  // Parse lesson content when lesson data changes
  useEffect(() => {
    if (!lesson?.content) {
      setIsLegacyContent(true);
      setStructuredContent(null);
      return;
    }

    try {
      const parsed = JSON.parse(lesson.content);
      if (parsed.sections && Array.isArray(parsed.sections)) {
        setStructuredContent(parsed as LessonContent);
        setIsLegacyContent(false);
      } else {
        setIsLegacyContent(true);
        setStructuredContent(null);
      }
    } catch {
      setIsLegacyContent(true);
      setStructuredContent(null);
    }
  }, [lesson]);

  // Update progress state when progress data changes
  useEffect(() => {
    if (progressData && typeof progressData === 'object') {
      const progress = progressData as {
        total: number;
        correct: number;
        percent: number;
        perQuestion: { [questionId: string]: { isCorrect: boolean } };
      };
      setLessonProgress(progress);
      setUserProgress(progress.percent || 0);
      setCanComplete(progress.percent >= 100);
    }
  }, [progressData]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleSubmitAnswer = () => {
    if (!lesson || !studentAnswer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    validateAnswerMutation.mutate({
      lessonId: lesson.id,
      studentAnswer: studentAnswer.trim(),
    });
  };

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    if (!lesson || !answer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    validateQuestionMutation.mutate({
      lessonId: lesson.id,
      questionId,
      answer: answer.trim(),
    });
  };

  const updateQuestionAnswer = (questionId: string, answer: string) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleCompleteLesson = () => {
    if (!lesson || !canComplete) return;

    updateProgressMutation.mutate({
      lessonId: lesson.id,
      isCompleted: true,
      score: lessonProgress?.percent || userProgress,
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

  // Helper component to render question input based on type
  const renderQuestionInput = (question: LessonQuestion, sectionIndex: number, questionIndex: number) => {
    const questionId = question.id;
    const currentAnswer = questionAnswers[questionId] || "";
    const validation = questionValidations[questionId];
    const isAnswered = lessonProgress?.perQuestion[questionId]?.isCorrect || false;

    const questionNumber = `${sectionIndex + 1}.${questionIndex + 1}`;

    return (
      <div key={questionId} className="border border-border rounded-lg p-4 space-y-4" data-testid={`question-${questionId}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">Question {questionNumber}</span>
              {isAnswered && (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" data-testid={`question-${questionId}-correct`} />
              )}
              {validation && !validation.isCorrect && !validation.isLoading && (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" data-testid={`question-${questionId}-incorrect`} />
              )}
              {validation?.isLoading && (
                <Loader className="h-4 w-4 animate-spin text-muted-foreground" data-testid={`question-${questionId}-loading`} />
              )}
            </div>
            <p className="text-sm mb-3" data-testid={`question-${questionId}-prompt`}>{question.prompt}</p>
          </div>
        </div>

        {question.type === "text" && (
          <Textarea
            placeholder="Enter your answer here..."
            value={currentAnswer}
            onChange={(e) => updateQuestionAnswer(questionId, e.target.value)}
            className="min-h-[100px] resize-none"
            data-testid={`question-${questionId}-textarea`}
            disabled={isAnswered}
          />
        )}

        {question.type === "number" && (
          <Input
            type="number"
            placeholder="Enter a number..."
            value={currentAnswer}
            onChange={(e) => updateQuestionAnswer(questionId, e.target.value)}
            data-testid={`question-${questionId}-number`}
            disabled={isAnswered}
          />
        )}

        {question.type === "code" && (
          <div className="border border-border rounded-lg overflow-hidden">
            <MonacoEditor
              value={currentAnswer}
              onChange={(value) => updateQuestionAnswer(questionId, value || "")}
              language="javascript"
              height="200px"
            />
          </div>
        )}

        {/* Answer validation feedback */}
        {validation && validation.feedback && (
          <Alert className={validation.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-red-500 bg-red-50 dark:bg-red-950"}>
            <div className="flex items-start space-x-2">
              {validation.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <AlertDescription className="text-sm">
                {validation.feedback}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleQuestionAnswer(questionId, currentAnswer)}
            disabled={!currentAnswer.trim() || validation?.isLoading || isAnswered}
            size="sm"
            data-testid={`question-${questionId}-submit`}
            className="flex-1 sm:flex-initial"
          >
            {validation?.isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : isAnswered ? (
              <>Answered</>
            ) : (
              <>Check Answer</>
            )}
          </Button>
          
          {!isAnswered && currentAnswer && (
            <Button
              onClick={() => updateQuestionAnswer(questionId, "")}
              variant="outline"
              size="sm"
              data-testid={`question-${questionId}-clear`}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{isLoading ? 'Loading lesson...' : 'Loading progress...'}</p>
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
        <div className="container mx-auto px-4 sm:px-6 py-4">
          {/* Mobile Layout */}
          <div className="block md:hidden space-y-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                data-testid="back-button"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="text-xs text-muted-foreground">
                {userProgress}% Complete
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="lesson-title">{lesson.title}</h1>
              <p className="text-sm text-muted-foreground" data-testid="lesson-meta">
                {lesson.categoryId} • {lesson.difficulty} • {lesson.estimatedDuration} min
              </p>
            </div>
            <Progress value={userProgress} className="w-full" data-testid="lesson-progress" />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleSaveProgress}
                variant="outline"
                disabled={updateProgressMutation.isPending}
                data-testid="save-progress-button"
                size="sm"
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              <Button 
                onClick={handleCompleteLesson}
                disabled={updateProgressMutation.isPending || !canComplete}
                data-testid="complete-lesson-button"
                size="sm"
                className="flex-1"
              >
                <Award className="h-4 w-4 mr-2" />
                Complete Lesson
              </Button>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                data-testid="back-button"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
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
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              <Button 
                onClick={handleCompleteLesson}
                disabled={updateProgressMutation.isPending || !canComplete}
                data-testid="complete-lesson-button"
              >
                <Award className="h-4 w-4 mr-2" />
                Complete Lesson
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border" data-testid="lesson-content">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Lesson Content</h2>
              <div className="prose max-w-none text-sm sm:text-base" data-testid="lesson-description">
                <p>{lesson.description}</p>
              </div>

              {/* Render structured quiz content or legacy content */}
              {!isLegacyContent && structuredContent ? (
                <div className="mt-6 space-y-8" data-testid="structured-content">
                  {structuredContent.sections.map((section, sectionIndex) => (
                    <div key={section.id} className="space-y-6" data-testid={`section-${section.id}`}>
                      <div className="border-l-4 border-primary pl-4">
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        {section.description && (
                          <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {section.questions.map((question, questionIndex) =>
                          renderQuestionInput(question, sectionIndex, questionIndex)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6" data-testid="legacy-content">
                  {lesson.content && (
                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                  )}
                </div>
              )}
            </div>

            {/* Legacy Answer Submission Section - only show for non-quiz lessons */}
            {isLegacyContent && (
              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border" data-testid="answer-submission">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Submit Your Answer</h2>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your answer here... Explain the key concepts you learned from this lesson."
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    className="min-h-[120px] resize-none"
                    data-testid="student-answer-textarea"
                  />
                  
                  {/* Answer validation feedback */}
                  {answerValidation && (
                    <Alert className={answerValidation.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-red-500 bg-red-50 dark:bg-red-950"}>
                      <div className="flex items-start space-x-2">
                        {answerValidation.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <AlertDescription className="text-sm">
                          {answerValidation.feedback}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={validateAnswerMutation.isPending || !studentAnswer.trim()}
                      data-testid="submit-answer-button"
                      className="flex-1"
                    >
                      {validateAnswerMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Validating...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Submit Answer
                        </>
                      )}
                    </Button>
                    
                    {!canComplete && answerValidation && !answerValidation.isCorrect && (
                      <Button
                        onClick={() => {
                          setStudentAnswer("");
                          setAnswerValidation(null);
                        }}
                        variant="outline"
                        data-testid="try-again-button"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Code Editor for Programming Lessons */}
            {lesson.programmingLanguage && (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold">Code Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Language: {lesson.programmingLanguage}
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <MonacoEditor
                    value={code}
                    onChange={setCode}
                    language={lesson.programmingLanguage.toLowerCase()}
                    height="400px"
                  />
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => setUserProgress(Math.min(100, userProgress + 25))}
                      data-testid="run-code-button"
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </Button>
                    <Button 
                      variant="outline"
                      data-testid="reset-code-button"
                      className="flex-1 sm:flex-initial"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Progress Card */}
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border" data-testid="progress-sidebar">
              <h3 className="font-semibold mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion</span>
                    <span>{userProgress}%</span>
                  </div>
                  <Progress value={userProgress} />
                </div>
                
                {/* Question-based progress for quiz lessons */}
                {!isLegacyContent && lessonProgress && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Questions Answered</span>
                      <span>{lessonProgress.correct} / {lessonProgress.total}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Question Progress</div>
                      <div className="flex flex-wrap gap-1">
                        {structuredContent?.sections.map((section, sectionIndex) =>
                          section.questions.map((question, questionIndex) => {
                            const isAnswered = lessonProgress.perQuestion[question.id]?.isCorrect;
                            const validation = questionValidations[question.id];
                            const questionNumber = `${sectionIndex + 1}.${questionIndex + 1}`;
                            
                            return (
                              <div
                                key={question.id}
                                className={`
                                  flex items-center justify-center w-8 h-8 rounded text-xs font-medium
                                  ${isAnswered 
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                                    : validation && !validation.isCorrect
                                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
                                      : 'bg-muted text-muted-foreground border border-border'
                                  }
                                `}
                                title={`Question ${questionNumber}: ${isAnswered ? 'Correct' : validation ? 'Incorrect' : 'Not answered'}`}
                              >
                                {questionNumber}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  Time spent: {timeSpent} minutes
                </div>
                {canComplete && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ready to complete!
                  </div>
                )}
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border" data-testid="learning-objectives">
              <h3 className="font-semibold mb-4">Learning Objectives</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Understand the core concepts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Apply knowledge to real problems</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className={`h-4 w-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                    !isLegacyContent 
                      ? (lessonProgress && lessonProgress.percent >= 100 ? 'bg-green-600 border-green-600' : 'border-muted-foreground')
                      : (answerValidation?.isCorrect ? 'bg-green-600 border-green-600' : 'border-muted-foreground')
                  }`}></div>
                  <span className={(
                    !isLegacyContent 
                      ? (lessonProgress && lessonProgress.percent >= 100 ? 'text-foreground' : 'text-muted-foreground')
                      : (answerValidation?.isCorrect ? 'text-foreground' : 'text-muted-foreground')
                  )}>
                    {!isLegacyContent ? 'Complete all quiz questions' : 'Complete answer submission'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Lesson Resources */}
            <div
              className="bg-card rounded-xl p-4 sm:p-6 border border-border"
              data-testid="lesson-resources"
            >
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  data-testid="resource-documentation"
                >
                  📚 Documentation
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  data-testid="resource-examples"
                >
                  💻 Code Examples
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  data-testid="resource-help"
                >
                  ❓ Get Help
                </Button>

                {/* Embedded C++ Editor */}
                <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">📝 Try C++ Online</h4>
                <div className="rounded-lg overflow-hidden border border-muted shadow-sm">
                  <iframe
                    src="https://www.jdoodle.com/embed/v0/1"
                    title="C++ Online Editor"
                    className="w-full h-[500px]"
                  ></iframe>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
