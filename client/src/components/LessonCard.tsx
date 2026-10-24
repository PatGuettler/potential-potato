import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryIcon, ProgressBar, StatusBadge } from "@/components/widgets";

export interface LessonSummary {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: string;
  estimatedDuration: number;
  averageRating: number;
  totalRatings: number;
  questionCount: number;
}

const difficultyTone: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  hard: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function LessonCard({ lesson, status, score }: { lesson: LessonSummary; status?: string; score?: number }) {
  return (
    <Link href={`/lesson/${lesson.id}`} className="block" data-testid={`lesson-card-${lesson.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex flex-col h-full gap-3">
          <div className="flex items-start gap-3">
            <CategoryIcon categoryId={lesson.categoryId} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold leading-snug">{lesson.title}</div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge variant="outline" className={`${difficultyTone[lesson.difficulty] ?? ""} border-0 capitalize`}>{lesson.difficulty}</Badge>
                {status && <StatusBadge status={status} />}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground flex-1">{lesson.description}</p>
          {status === "in_progress" && score !== undefined && <ProgressBar value={score} />}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span><i className="fas fa-clock mr-1" />{lesson.estimatedDuration} min</span>
            {lesson.questionCount > 0 && <span><i className="fas fa-question-circle mr-1" />{lesson.questionCount} questions</span>}
            {lesson.totalRatings > 0 && <span><i className="fas fa-star text-amber-400 mr-1" />{lesson.averageRating} ({lesson.totalRatings})</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
