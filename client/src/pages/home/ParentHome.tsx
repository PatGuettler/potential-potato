import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { AssignmentList, type AssignmentRow, Loading, ProgressBar, StatCard } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { fullName, initials, pct, relativeTime } from "@/lib/format";
import { useFamily } from "@/lib/family";
import type { CalendarEvent, PublicUser } from "@shared/core/types";

type Child = PublicUser & {
  summary: { lessonsCompleted: number; averageScore: number | null; minutesSpent: number; assignmentsTotal: number; assignmentsDone: number; assignmentsOverdue: number; pendingReviews: number; lastActive: string | null };
  upcoming: AssignmentRow[];
};

export default function ParentHome() {
  const { user } = useAuth();
  const { data: children, isLoading } = useQuery<Child[]>({ queryKey: ["/api/parent/children"] });
  const { data: family } = useFamily();
  const { data: events = [] } = useQuery<CalendarEvent[]>({ queryKey: ["/api/events"] });
  const { data: subs = [] } = useQuery<{ status: string }[]>({ queryKey: ["/api/teacher/submissions"] });
  const today = new Date().toISOString().slice(0, 10);
  const nextEvents = events.filter((e) => e.date >= today).slice(0, 3);
  const pending = subs.filter((s) => s.status === "pending").length;
  const courses = family?.children.reduce((n, c) => n + c.courses.length, 0) ?? 0;

  return (
    <AppShell
      title={`Hi, ${user?.firstName || user?.username}`}
      subtitle={family?.settings.schoolName}
      actions={
        <>
          <Link href="/courses"><Button size="sm" variant="outline" data-testid="plan-course"><i className="fas fa-calendar-plus mr-2" />Plan a course</Button></Link>
          <Link href="/family"><Button size="sm" data-testid="manage-family"><i className="fas fa-people-roof mr-2" />My family</Button></Link>
        </>
      }
    >
      {isLoading ? (
        <Loading />
      ) : !children?.length ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <i className="fas fa-house-chimney-user text-4xl text-primary" />
            <h2 className="text-lg font-semibold">Welcome to your home school</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">Three steps: add your children, pick courses from the K–12 catalog, and let attendance and progress records build themselves as they learn.</p>
            <Link href="/family"><Button>Add your first child</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Children" value={children.length} icon="fas fa-children" tone="text-violet-600" />
            <StatCard label="Courses in progress" value={courses} icon="fas fa-graduation-cap" />
            <Link href="/reviews" className="block"><StatCard label="Written work to review" value={pending} icon="fas fa-inbox" tone="text-rose-600" /></Link>
            <StatCard label="Overdue lessons" value={children.reduce((n, c) => n + c.summary.assignmentsOverdue, 0)} icon="fas fa-triangle-exclamation" tone="text-amber-500" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {children.map((c) => {
              const s = c.summary;
              const done = s.assignmentsTotal ? Math.round((s.assignmentsDone / s.assignmentsTotal) * 100) : 0;
              return (
                <Card key={c.id} data-testid={`child-${c.username}`}>
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
                    <div className="w-11 h-11 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 flex items-center justify-center font-semibold">{initials(c)}</div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg">{fullName(c)}</CardTitle>
                      <div className="text-xs text-muted-foreground">{c.gradeLevel ? `${c.gradeLevel} · ` : ""}last active {relativeTime(s.lastActive)}</div>
                    </div>
                    <Link href={`/students/${c.id}`}><Button size="sm" data-testid={`view-report-${c.username}`}>Full report</Button></Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {s.assignmentsOverdue > 0 && (
                      <div className="rounded-md bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 text-sm px-3 py-2">
                        <i className="fas fa-exclamation-triangle mr-2" />{s.assignmentsOverdue} lesson{s.assignmentsOverdue > 1 ? "s are" : " is"} overdue
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-muted p-2"><div className="text-xl font-bold">{s.lessonsCompleted}</div><div className="text-xs text-muted-foreground">lessons done</div></div>
                      <div className="rounded-lg bg-muted p-2"><div className="text-xl font-bold">{pct(s.averageScore)}</div><div className="text-xs text-muted-foreground">avg score</div></div>
                      <div className="rounded-lg bg-muted p-2"><div className="text-xl font-bold">{Math.round(s.minutesSpent / 6) / 10}</div><div className="text-xs text-muted-foreground">hours</div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5"><span>Assignments completed</span><span className="text-muted-foreground">{s.assignmentsDone}/{s.assignmentsTotal}</span></div>
                      <ProgressBar value={done} />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Up next</div>
                      <AssignmentList items={c.upcoming} linkLessons={false} empty="Nothing scheduled. Plan a course from the catalog." />
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
                      <Link href={`/records/attendance/${c.id}`}><Button size="sm" variant="ghost"><i className="fas fa-calendar-check mr-1.5" />Attendance</Button></Link>
                      <Link href={`/records/portfolio/${c.id}`}><Button size="sm" variant="ghost"><i className="fas fa-folder-open mr-1.5" />Portfolio</Button></Link>
                      <Link href={`/records/transcript/${c.id}`}><Button size="sm" variant="ghost"><i className="fas fa-scroll mr-1.5" />Transcript</Button></Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Coming up at co-op</CardTitle>
              <Link href="/calendar" className="text-sm text-primary hover:underline">Full calendar</Link>
            </CardHeader>
            <CardContent>
              {nextEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {nextEvents.map((e) => (
                    <li key={e.id} className="py-2 flex justify-between gap-3 text-sm">
                      <span className="font-medium">{e.title}</span>
                      <span className="text-muted-foreground shrink-0">{new Date(`${e.date}T12:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}{e.startTime ? ` · ${e.startTime}` : ""}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AppShell>
  );
}
