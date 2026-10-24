import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { AssignmentList, type AssignmentRow, EmptyState, Loading, ProgressBar } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { fullName, initials, pct, relativeTime } from "@/lib/format";
import type { PublicUser } from "@shared/core/types";

type Child = PublicUser & {
  summary: {
    lessonsCompleted: number;
    averageScore: number | null;
    minutesSpent: number;
    assignmentsTotal: number;
    assignmentsDone: number;
    assignmentsOverdue: number;
    pendingReviews: number;
    lastActive: string | null;
  };
  upcoming: AssignmentRow[];
};

export default function ParentHome() {
  const { user } = useAuth();
  const { data: children, isLoading } = useQuery<Child[]>({ queryKey: ["/api/parent/children"] });

  return (
    <AppShell title={`Hi, ${user?.firstName || user?.username}`} subtitle="How your children are doing this week">
      {isLoading ? (
        <Loading />
      ) : !children?.length ? (
        <Card>
          <EmptyState icon="fas fa-child" title="No children linked yet">
            Ask your school administrator to link your account to your child's student account.
          </EmptyState>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {children.map((c) => {
            const s = c.summary;
            const done = s.assignmentsTotal ? Math.round((s.assignmentsDone / s.assignmentsTotal) * 100) : 0;
            return (
              <Card key={c.id} data-testid={`child-${c.username}`}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
                  <div className="w-11 h-11 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 flex items-center justify-center font-semibold">
                    {initials(c)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg">{fullName(c)}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {c.gradeLevel ? `${c.gradeLevel} · ` : ""}last active {relativeTime(s.lastActive)}
                    </div>
                  </div>
                  <Link href={`/students/${c.id}`}>
                    <Button size="sm" data-testid={`view-report-${c.username}`}>Full report</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {s.assignmentsOverdue > 0 && (
                    <div className="rounded-md bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 text-sm px-3 py-2">
                      <i className="fas fa-exclamation-triangle mr-2" />
                      {s.assignmentsOverdue} assignment{s.assignmentsOverdue > 1 ? "s are" : " is"} overdue
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted p-2">
                      <div className="text-xl font-bold">{s.lessonsCompleted}</div>
                      <div className="text-xs text-muted-foreground">lessons done</div>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <div className="text-xl font-bold">{pct(s.averageScore)}</div>
                      <div className="text-xs text-muted-foreground">avg score</div>
                    </div>
                    <div className="rounded-lg bg-muted p-2">
                      <div className="text-xl font-bold">{s.minutesSpent}</div>
                      <div className="text-xs text-muted-foreground">minutes</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span>Assignments completed</span>
                      <span className="text-muted-foreground">{s.assignmentsDone}/{s.assignmentsTotal}</span>
                    </div>
                    <ProgressBar value={done} />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Coming up</div>
                    <AssignmentList items={c.upcoming} linkLessons={false} empty="Nothing due right now." />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
