import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Question = {
  id: string;
  prompt: string;
  type: string;
  expectedAnswer: string;
  caseSensitive?: boolean;
  options?: string[];
};

type LessonSection = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
};

interface QuizBuilderProps {
  lessonSections: LessonSection[];
  addSection: () => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, field: keyof Omit<LessonSection, "id" | "questions">, value: string) => void;
  addQuestion: (sectionId: string) => void;
  removeQuestion: (sectionId: string, questionId: string) => void;
  updateQuestion: (sectionId: string, questionId: string, field: keyof Question, value: any) => void;
}

export function QuizBuilder({
  lessonSections,
  addSection,
  removeSection,
  updateSection,
  addQuestion,
  removeQuestion,
  updateQuestion,
}: QuizBuilderProps) {
  const totalQuestions = lessonSections.reduce((total, section) => total + section.questions.length, 0);

  return (
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
      <div className="space-y-4">
        {lessonSections.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="text-no-sections">
            <p>No sections yet. Add your first section to get started.</p>
          </div>
        ) : (
          lessonSections.map((section, sectionIndex) => (
            <Card key={section.id} className="p-4" data-testid={`card-section-${section.id}`}>
              <div className="space-y-4">
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
  );
}