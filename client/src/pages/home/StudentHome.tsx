import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { AssignmentList, type AssignmentRow, CategoryIcon, ProgressBar, StatCard } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CourseCard, type CourseSummary } from "@/pages/CourseCatalog";
import { parseGrade } from "@shared/core/types";
import type { Progress } from "@shared/core/types";

type LessonRow = { id: string; title: string; categoryId: string; estimatedDuration: number };
type ClassRow = { id: string; name: string; teacherName: string; courseId?: string };

export default function StudentHome() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState("");

  const { data: assignments = [] } = useQuery<AssignmentRow[]>({ queryKey: ["/api/me/assignments"] });
  const { data: progress = [] } = useQuery<Progress[]>({ queryKey: ["/api/progress"] });
  const { data: lessons = [] } = useQuery<LessonRow[]>({ queryKey: ["/api/lessons"] });
  const { data: courses = [] } = useQuery<CourseSummary[]>({ queryKey: ["/api/courses"] });
  const { data: classes = [] } = useQuery<ClassRow[]>({ queryKey: ["/api/me/classrooms"] });

  const join = useMutation({
    mutationFn: () => apiRequest<{ name: string }>("POST", "/api/me/join", { code }),
    onSuccess: (c) => {
      toast({ title: "Joined!", description: `You're now in ${c.name}.` });
      setCode("");
      queryClient.invalidateQueries({ queryKey: ["/api/me/classrooms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/assignments"] });
    },
    onError: (e: Error) => toast({ title: "Couldn't join", description: e.message, variant: "destructive" }),
  });

  const completed = progress.filter((p) => p.isCompleted);
  // Courses from the student's classes first, then the rest of their grade's catalog.
  const grade = parseGrade(user?.gradeLevel);
  const classCourseIds = new Set(classes.map((c) => c.courseId).filter(Boolean));
  const myCourses = [
    ...courses.filter((c) => classCourseIds.has(c.id)),
    ...courses.filter((c) => !classCourseIds.has(c.id) && grade !== undefined && c.gradeLevel <= grade && grade <= (c.gradeLevelMax ?? c.gradeLevel)),
  ].slice(0, 6);
  const avg = completed.length ? Math.round(completed.reduce((s, p) => s + p.score, 0) / completed.length) : null;
  const todo = assignments.filter((a) => a.status !== "completed");
  const overdue = todo.filter((a) => a.overdue).length;
  const inProgress = progress
    .filter((p) => p.status === "in_progress")
    .sort((a, b) => b.lastAccessed.localeCompare(a.lastAccessed))
    .map((p) => ({ p, lesson: lessons.find((l) => l.id === p.lessonId) }))
    .filter((x) => x.lesson)
    .slice(0, 3);

  return (
    <AppShell title={`Welcome back, ${user?.firstName || user?.username}!`} subtitle="Here's what's on your plate">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Lessons completed" value={completed.length} icon="fas fa-check-circle" tone="text-green-600" />
        <StatCard label="Average score" value={avg === null ? "—" : `${avg}%`} icon="fas fa-star" tone="text-amber-500" />
        <StatCard label="To do" value={todo.length} hint={overdue ? <span className="text-red-600">{overdue} overdue</span> : "Nothing overdue"} icon="fas fa-tasks" />
        <StatCard label="Time learning" value={`${progress.reduce((s, p) => s + p.timeSpent, 0)} min`} icon="fas fa-clock" tone="text-sky-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <AssignmentList items={[...todo, ...assignments.filter((a) => a.status === "completed").slice(-3).reverse()]} empty="Your teacher hasn't assigned anything yet." />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pick up where you left off</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inProgress.length === 0 && <p className="text-sm text-muted-foreground">No lessons in progress.</p>}
              {inProgress.map(({ p, lesson }) => (
                <Link key={p.lessonId} href={`/lesson/${p.lessonId}`} className="flex items-center gap-3 rounded-md hover:bg-muted/50 -mx-2 px-2 py-1.5">
                  <CategoryIcon categoryId={lesson!.categoryId} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{lesson!.title}</div>
                    <ProgressBar value={p.score} className="mt-1.5" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">My classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {classes.map((c) => (
                <div key={c.id} className="text-sm">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.teacherName}</div>
                </div>
              ))}
              <form
                className="flex gap-2 pt-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (code.trim()) join.mutate();
                }}
              >
                <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Class code" className="uppercase" data-testid="input-join-code" />
                <Button type="submit" variant="outline" disabled={join.isPending}>Join</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">My courses</h2>
          <Link href="/courses" className="text-sm text-primary hover:underline">Browse the catalog</Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {myCourses.map((c) => <CourseCard key={c.id} c={c} />)}
        </div>
      </section>
    </AppShell>
  );
}
