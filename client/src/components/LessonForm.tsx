import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Category, User } from "@shared/schema";

type LessonFormProps = {
  lessonForm: any;
  setLessonForm: (fn: (prev: any) => any) => void;
  categories: Category[];
  useQuizBuilder: boolean;
  setUseQuizBuilder: (checked: boolean) => void;
  user: User;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  children?: React.ReactNode;
};

export function LessonForm({
  lessonForm,
  setLessonForm,
  categories,
  useQuizBuilder,
  setUseQuizBuilder,
  user,
  onSubmit,
  isPending,
  children,
}: LessonFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
      {children}
      <Button 
        type="submit" 
        disabled={isPending}
        data-testid="button-create-lesson"
        className="w-full md:w-auto"
      >
        {isPending ? "Creating..." : "Create Lesson"}
      </Button>
    </form>
  );
}