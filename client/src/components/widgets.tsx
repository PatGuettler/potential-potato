import type { ReactNode } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { relativeTime, shortDate, styleFor } from "@/lib/format";

export function StatCard({ label, value, hint, icon, tone = "text-primary" }: { label: string; value: ReactNode; hint?: ReactNode; icon: string; tone?: string }) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 ${tone}`}>
          <i className={icon} />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-muted rounded-full h-2 overflow-hidden ${className}`}>
      <div className="lesson-progress-bar h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

type Status = "completed" | "in_progress" | "not_started";

export function StatusBadge({ status, overdue }: { status: Status | string; overdue?: boolean }) {
  if (status === "completed") return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">Done</Badge>;
  if (overdue) return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">Overdue</Badge>;
  if (status === "in_progress") return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300">In progress</Badge>;
  return <Badge variant="outline">Not started</Badge>;
}

export function CategoryIcon({ categoryId, size = "w-9 h-9" }: { categoryId?: string; size?: string }) {
  const s = styleFor(categoryId);
  return (
    <div className={`${size} ${s.bg} rounded-lg flex items-center justify-center shrink-0`}>
      <i className={`${s.icon} ${s.text}`} />
    </div>
  );
}

export function EmptyState({ icon, title, children }: { icon: string; title: string; children?: ReactNode }) {
  return (
    <div className="text-center py-10 px-4">
      <i className={`${icon} text-3xl text-muted-foreground mb-3`} />
      <h3 className="font-semibold">{title}</h3>
      {children && <div className="text-sm text-muted-foreground mt-1">{children}</div>}
    </div>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export interface AssignmentRow {
  id: string;
  lessonId: string;
  lessonTitle: string;
  categoryId?: string;
  classroomName: string;
  dueDate: string;
  status: Status;
  overdue: boolean;
  score: number | null;
  note?: string;
}

export function AssignmentList({ items, linkLessons = true, empty = "No assignments yet." }: { items: AssignmentRow[]; linkLessons?: boolean; empty?: string }) {
  if (items.length === 0) return <EmptyState icon="fas fa-clipboard-check" title="All clear">{empty}</EmptyState>;
  return (
    <ul className="divide-y divide-border">
      {items.map((a) => {
        const row = (
          <div className="flex items-center gap-3 py-3">
            <CategoryIcon categoryId={a.categoryId} />
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{a.lessonTitle}</div>
              <div className="text-xs text-muted-foreground truncate">
                {a.classroomName} · due {shortDate(a.dueDate)} ({relativeTime(a.dueDate)})
                {a.status === "completed" && a.score !== null ? ` · score ${a.score}%` : ""}
              </div>
            </div>
            <StatusBadge status={a.status} overdue={a.overdue} />
          </div>
        );
        return (
          <li key={a.id}>
            {linkLessons ? (
              <Link href={`/lesson/${a.lessonId}`} className="block hover:bg-muted/50 -mx-2 px-2 rounded-md" data-testid={`assignment-${a.lessonId}`}>
                {row}
              </Link>
            ) : (
              row
            )}
          </li>
        );
      })}
    </ul>
  );
}

export interface ActivityItem {
  id: string;
  type: string;
  actorName: string;
  studentName?: string;
  lessonTitle?: string;
  message: string;
  createdAt: string;
}

const activityIcon: Record<string, string> = {
  lesson_started: "fas fa-play text-blue-500",
  lesson_completed: "fas fa-check-circle text-green-600",
  question_answered: "fas fa-question-circle text-slate-500",
  submission_sent: "fas fa-paper-plane text-purple-500",
  submission_reviewed: "fas fa-clipboard-check text-teal-600",
  assignment_created: "fas fa-tasks text-orange-500",
  note_added: "fas fa-comment-dots text-sky-600",
};

export function ActivityFeed({ items, title = "Recent activity" }: { items: ActivityItem[]; title?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon="fas fa-clock" title="Nothing yet">Activity will show up here.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <i className={`${activityIcon[a.type] ?? "fas fa-circle text-muted-foreground"} mt-1 w-4 text-center`} />
                <div className="min-w-0">
                  <span className="font-medium">{a.actorName}</span> {a.message}
                  {a.lessonTitle && <span className="text-muted-foreground"> · {a.lessonTitle}</span>}
                  <div className="text-xs text-muted-foreground">{relativeTime(a.createdAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
