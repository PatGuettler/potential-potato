import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@shared/schema";

interface LessonCardProps {
  lesson: Lesson;
  progress?: number;
  status?: "completed" | "in-progress" | "not-started";
  onContinue?: () => void;
  onStart?: () => void;
}

export function LessonCard({ 
  lesson, 
  progress = 0, 
  status = "not-started", 
  onContinue, 
  onStart 
}: LessonCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-orange-100 text-orange-700">In Progress</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-700">Not Started</Badge>;
    }
  };

  const getIcon = () => {
    switch (lesson.categoryId) {
      case "science":
        return "fas fa-microscope text-blue-600";
      case "technology":
        return "fas fa-laptop-code text-purple-600";
      case "engineering":
        return "fas fa-cogs text-green-600";
      case "mathematics":
        return "fas fa-calculator text-orange-600";
      default:
        return "fas fa-book text-gray-600";
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm" data-testid={`lesson-card-${lesson.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className={getIcon()}></i>
          </div>
          <div>
            <h4 className="font-semibold" data-testid={`lesson-title-${lesson.id}`}>{lesson.title}</h4>
            <p className="text-sm text-muted-foreground" data-testid={`lesson-meta-${lesson.id}`}>
              {lesson.categoryId} • {lesson.difficulty}
            </p>
          </div>
        </div>
        <span data-testid={`lesson-status-${lesson.id}`}>{getStatusBadge()}</span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4" data-testid={`lesson-description-${lesson.id}`}>
        {lesson.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <i className="fas fa-clock"></i>
          <span data-testid={`lesson-duration-${lesson.id}`}>{lesson.estimatedDuration} min</span>
          {status === "in-progress" && (
            <>
              <i className="fas fa-signal"></i>
              <span data-testid={`lesson-progress-${lesson.id}`}>Progress: {progress}%</span>
            </>
          )}
        </div>
        
        {status === "in-progress" ? (
          <Button 
            onClick={onContinue}
            data-testid={`button-continue-${lesson.id}`}
          >
            Continue
          </Button>
        ) : status === "not-started" ? (
          <Button 
            variant="secondary"
            onClick={onStart}
            data-testid={`button-start-${lesson.id}`}
          >
            Start Lesson
          </Button>
        ) : (
          <Button 
            variant="outline"
            data-testid={`button-review-${lesson.id}`}
          >
            Review
          </Button>
        )}
      </div>
    </div>
  );
}
