import { useState } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ActivityFeed, type ActivityItem, AssignmentList, type AssignmentRow, EmptyState, Loading, ProgressBar, StatCard } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { fullName, pct, relativeTime, shortDate } from "@/lib/format";
import type { PublicUser } from "@shared/core/types";

type Report = {
  student: PublicUser;
  classrooms: { id: string; name: string; teacherName: string }[];
  parents: { id: string; name: string; email: string }[];
  summary: {
    lessonsCompleted: number;
    lessonsInProgress: number;
    averageScore: number | null;
    minutesSpent: number;
    assignmentsTotal: number;
    assignmentsDone: number;
    assignmentsOverdue: number;
    pendingReviews: number;
    lastActive: string | null;
  };
  categories: { categoryId: string; name: string; total: number; completed: number }[];
  assignments: AssignmentRow[];
  submissions: { id: string; lessonTitle: string; answer: string; status: string; teacherScore?: number; feedback?: string; reviewerName?: string; submittedAt: string }[];
  notes: { id: string; body: string; authorName: string; authorRole?: string; createdAt: string }[];
  activity: ActivityItem[];
};

export default function StudentReport() {
  const params = useParams<{ id?: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const studentId = params.id ?? user!.id;
  const [note, setNote] = useState("");
  const { data, isLoading, error } = useQuery<Report>({ queryKey: ["/api/students", studentId, "report"] });

  const addNote = useMutation({
    mutationFn: () => apiRequest("POST", `/api/students/${studentId}/notes`, { body: note }),
    onSuccess: () => {
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["/api/students", studentId, "report"] });
    },
    onError: (e: Error) => toast({ title: "Couldn't post note", description: e.message, variant: "destructive" }),
  });

  if (error) return <AppShell title="Student report"><Card><EmptyState icon="fas fa-lock" title="Not available">{(error as Error).message}</EmptyState></Card></AppShell>;
  if (isLoading || !data) return <AppShell title="Student report"><Loading /></AppShell>;

  const { student, summary: s } = data;
  const canNote = user?.role !== "student";

  return (
    <AppShell
      title={user?.id === student.id ? "My progress report" : fullName(student)}
      subtitle={[student.gradeLevel, data.classrooms.map((c) => c.name).join(", ")].filter(Boolean).join(" · ") || undefined}
      actions={<Button size="sm" variant="outline" onClick={() => window.print()} className="print:hidden"><i className="fas fa-print mr-2" />Print</Button>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Lessons completed" value={s.lessonsCompleted} hint={`${s.lessonsInProgress} in progress`} icon="fas fa-check-circle" tone="text-green-600" />
        <StatCard label="Average score" value={pct(s.averageScore)} icon="fas fa-star" tone="text-amber-500" />
        <StatCard
          label="Assignments"
          value={`${s.assignmentsDone}/${s.assignmentsTotal}`}
          hint={s.assignmentsOverdue ? <span className="text-red-600">{s.assignmentsOverdue} overdue</span> : "None overdue"}
          icon="fas fa-tasks"
        />
        <StatCard label="Time learning" value={`${s.minutesSpent} min`} hint={`Last active ${relativeTime(s.lastActive)}`} icon="fas fa-clock" tone="text-sky-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Assignments</CardTitle></CardHeader>
            <CardContent><AssignmentList items={data.assignments} linkLessons={user?.role !== "parent"} /></CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Written responses</CardTitle></CardHeader>
            <CardContent>
              {data.submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No written responses yet.</p>
              ) : (
                <ul className="space-y-4">
                  {data.submissions.map((sub) => (
                    <li key={sub.id} className="rounded-lg border border-border p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-sm">{sub.lessonTitle}</div>
                        {sub.status === "reviewed" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">{sub.teacherScore}%</Badge>
                        ) : (
                          <Badge variant="outline">Awaiting review</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{sub.answer}</p>
                      {sub.feedback && (
                        <div className="text-sm rounded-md bg-muted px-3 py-2">
                          <span className="font-medium">{sub.reviewerName}:</span> {sub.feedback}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">Submitted {shortDate(sub.submittedAt)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <ActivityFeed items={data.activity} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">By subject</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.categories.map((c) => (
                <div key={c.categoryId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">{c.completed}/{c.total}</span>
                  </div>
                  <ProgressBar value={c.total ? (c.completed / c.total) * 100 : 0} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Notes between home & school</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
              {data.notes.map((n) => (
                <div key={n.id} className="text-sm rounded-md bg-muted/60 px-3 py-2">
                  <div className="flex justify-between gap-2 text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">{n.authorName}{n.authorRole ? ` (${n.authorRole})` : ""}</span>
                    <span>{relativeTime(n.createdAt)}</span>
                  </div>
                  {n.body}
                </div>
              ))}
              {canNote && (
                <form
                  className="space-y-2 print:hidden"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (note.trim()) addNote.mutate();
                  }}
                >
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Write a note. Teachers and parents of this student can see it." data-testid="note-input" />
                  <Button type="submit" size="sm" disabled={addNote.isPending || !note.trim()}>Post note</Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Contacts</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {data.classrooms.map((c) => (
                <div key={c.id}><span className="text-muted-foreground">Teacher:</span> {c.teacherName} <span className="text-muted-foreground">({c.name})</span></div>
              ))}
              {data.parents.map((p) => (
                <div key={p.id}><span className="text-muted-foreground">Parent:</span> {p.name}</div>
              ))}
              {data.classrooms.length + data.parents.length === 0 && <p className="text-muted-foreground">None on file.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
