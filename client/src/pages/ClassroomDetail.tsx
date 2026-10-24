import { useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { CategoryIcon, EmptyState, Loading, StatCard } from "@/components/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { downloadCsv, fullName, pct, relativeTime, shortDate } from "@/lib/format";
import type { PublicUser } from "@shared/core/types";
import type { ClassCard } from "./home/TeacherHome";

type Grade = { status: string; score: number | null; overdue: boolean };
type Detail = {
  classroom: ClassCard;
  students: (PublicUser & { summary: { averageScore: number | null; assignmentsOverdue: number; lastActive: string | null }; grades: Record<string, Grade> })[];
  assignments: { id: string; lessonId: string; lessonTitle: string; categoryId?: string; dueDate: string; note?: string; completedCount: number; averageScore: number | null }[];
};

function GradeCell({ g }: { g?: Grade }) {
  if (!g) return <span className="text-muted-foreground">—</span>;
  if (g.status === "completed") return <span className="inline-block min-w-12 rounded px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 font-medium">{g.score}%</span>;
  if (g.overdue) return <span className="inline-block min-w-12 rounded px-1.5 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">late</span>;
  if (g.status === "in_progress") return <span className="inline-block min-w-12 rounded px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">…</span>;
  return <span className="text-muted-foreground">·</span>;
}

const refresh = () => queryClient.invalidateQueries();

function AssignDialog({ classroomId }: { classroomId: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [lessonId, setLessonId] = useState("");
  const [due, setDue] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const { data: lessons = [] } = useQuery<{ id: string; title: string; categoryId: string }[]>({ queryKey: ["/api/lessons"], enabled: open });
  const assign = useMutation({
    // Due at the end of the chosen day, local time.
    mutationFn: () => apiRequest("POST", `/api/teacher/classrooms/${classroomId}/assignments`, { lessonId, dueDate: new Date(`${due}T23:59`).toISOString(), note }),
    onSuccess: () => {
      toast({ title: "Lesson assigned" });
      setOpen(false);
      setLessonId("");
      setNote("");
      refresh();
    },
    onError: (e: Error) => toast({ title: "Couldn't assign", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="assign-lesson"><i className="fas fa-plus mr-2" />Assign lesson</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Assign a lesson</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (lessonId) assign.mutate(); }}>
          <div className="space-y-2">
            <Label>Lesson</Label>
            <Select value={lessonId} onValueChange={setLessonId}>
              <SelectTrigger data-testid="select-lesson"><SelectValue placeholder="Choose a lesson" /></SelectTrigger>
              <SelectContent>
                {lessons.map((l) => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due">Due date</Label>
            <Input id="due" type="date" value={due} onChange={(e) => setDue(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note for students (optional)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
          <DialogFooter><Button type="submit" disabled={!lessonId || assign.isPending}>Assign</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddStudentDialog({ classroomId, enrolled }: { classroomId: string; enrolled: Set<string> }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: all = [] } = useQuery<{ id: string; username: string; name: string; gradeLevel?: string }[]>({ queryKey: ["/api/teacher/students"], enabled: open });
  const add = useMutation({
    mutationFn: (studentId: string) => apiRequest("POST", `/api/teacher/classrooms/${classroomId}/students`, { studentId }),
    onSuccess: () => refresh(),
    onError: (e: Error) => toast({ title: "Couldn't add student", description: e.message, variant: "destructive" }),
  });
  const candidates = all.filter((s) => !enrolled.has(s.id) && `${s.name} ${s.username}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" data-testid="add-student"><i className="fas fa-user-plus mr-2" />Add students</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add students</DialogTitle></DialogHeader>
        <Input placeholder="Search by name or username" value={search} onChange={(e) => setSearch(e.target.value)} />
        <ul className="max-h-72 overflow-y-auto divide-y divide-border">
          {candidates.length === 0 && <li className="py-4 text-sm text-muted-foreground text-center">No matching students. Admins can create accounts under Users & families.</li>}
          {candidates.map((s) => (
            <li key={s.id} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">@{s.username}{s.gradeLevel ? ` · ${s.gradeLevel}` : ""}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => add.mutate(s.id)} disabled={add.isPending}>Add</Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export default function ClassroomDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data, isLoading } = useQuery<Detail>({ queryKey: ["/api/teacher/classrooms", id] });

  const mutate = useMutation({
    mutationFn: ({ method, url }: { method: string; url: string }) => apiRequest(method, url),
    onSuccess: () => refresh(),
    onError: (e: Error) => toast({ title: "Something went wrong", description: e.message, variant: "destructive" }),
  });

  if (isLoading || !data) return <AppShell title="Class"><Loading /></AppShell>;
  const { classroom, students, assignments } = data;

  const exportCsv = () => {
    downloadCsv(`${classroom.name.replace(/\W+/g, "-")}-gradebook.csv`, [
      ["Student", "Username", ...assignments.map((a) => `${a.lessonTitle} (due ${shortDate(a.dueDate)})`), "Average"],
      ...students.map((s) => [
        fullName(s),
        s.username,
        ...assignments.map((a) => {
          const g = s.grades[a.id];
          return g?.status === "completed" ? g.score : g?.overdue ? "late" : g?.status === "in_progress" ? "in progress" : "";
        }),
        s.summary.averageScore,
      ]),
    ]);
  };

  const deleteClass = async () => {
    if (!confirm(`Delete ${classroom.name}? Assignments for this class will be removed; student progress is kept.`)) return;
    await mutate.mutateAsync({ method: "DELETE", url: `/api/teacher/classrooms/${classroom.id}` });
    navigate("/");
  };

  return (
    <AppShell
      title={classroom.name}
      subtitle={<>Join code <span className="font-mono font-semibold">{classroom.joinCode}</span> · {classroom.teacherName}</>}
      actions={
        <>
          <AssignDialog classroomId={classroom.id} />
          <AddStudentDialog classroomId={classroom.id} enrolled={new Set(students.map((s) => s.id))} />
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Students" value={students.length} icon="fas fa-user-graduate" />
        <StatCard label="Assignments" value={assignments.length} icon="fas fa-tasks" tone="text-orange-500" />
        <StatCard label="Completion" value={pct(classroom.completionRate)} icon="fas fa-chart-pie" tone="text-green-600" />
        <StatCard label="Students with late work" value={students.filter((s) => s.summary.assignmentsOverdue > 0).length} icon="fas fa-exclamation-triangle" tone="text-red-600" />
      </div>

      <Tabs defaultValue="gradebook">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="gradebook">Gradebook</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={exportCsv} data-testid="export-csv"><i className="fas fa-file-csv mr-2" />Export CSV</Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={deleteClass}>Delete class</Button>
          </div>
        </div>

        <TabsContent value="gradebook">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              {students.length === 0 ? (
                <EmptyState icon="fas fa-user-plus" title="No students yet">Add students, or have them join with code {classroom.joinCode}.</EmptyState>
              ) : (
                <table className="w-full text-sm" data-testid="gradebook">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="p-3 font-medium sticky left-0 bg-card">Student</th>
                      {assignments.map((a) => (
                        <th key={a.id} className="p-3 font-medium text-center min-w-28" title={a.lessonTitle}>
                          <div className="truncate max-w-32 mx-auto">{a.lessonTitle}</div>
                          <div className="font-normal">due {shortDate(a.dueDate)}</div>
                        </th>
                      ))}
                      <th className="p-3 font-medium text-center">Avg</th>
                      <th className="p-3 font-medium">Last active</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                        <td className="p-3 sticky left-0 bg-card">
                          <Link href={`/students/${s.id}`} className="font-medium hover:underline">{fullName(s)}</Link>
                        </td>
                        {assignments.map((a) => (
                          <td key={a.id} className="p-3 text-center text-xs"><GradeCell g={s.grades[a.id]} /></td>
                        ))}
                        <td className="p-3 text-center font-medium">{pct(s.summary.averageScore)}</td>
                        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{relativeTime(s.summary.lastActive)}</td>
                        <td className="p-3 text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Remove from class"
                            onClick={() => confirm(`Remove ${fullName(s)} from this class?`) && mutate.mutate({ method: "DELETE", url: `/api/teacher/classrooms/${classroom.id}/students/${s.id}` })}
                          >
                            <i className="fas fa-user-minus text-muted-foreground" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground mt-2">Scores are the share of quiz questions answered correctly on the first try.</p>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardContent className="p-0">
              {assignments.length === 0 ? (
                <EmptyState icon="fas fa-tasks" title="Nothing assigned yet">Use “Assign lesson” to give this class work with a due date.</EmptyState>
              ) : (
                <ul className="divide-y divide-border">
                  {assignments.map((a) => {
                    const past = new Date(a.dueDate).getTime() < Date.now();
                    return (
                      <li key={a.id} className="flex items-center gap-3 p-4">
                        <CategoryIcon categoryId={a.categoryId} />
                        <div className="min-w-0 flex-1">
                          <Link href={`/lesson/${a.lessonId}`} className="font-medium hover:underline">{a.lessonTitle}</Link>
                          <div className="text-xs text-muted-foreground">
                            Due {shortDate(a.dueDate)} ({relativeTime(a.dueDate)}){past ? " · closed" : ""}
                            {a.note ? ` · “${a.note}”` : ""}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{a.completedCount}/{students.length} done</div>
                          <div className="text-xs text-muted-foreground">avg {pct(a.averageScore)}</div>
                        </div>
                        <Button size="icon" variant="ghost" title="Remove assignment" onClick={() => confirm("Remove this assignment?") && mutate.mutate({ method: "DELETE", url: `/api/teacher/assignments/${a.id}` })}>
                          <i className="fas fa-trash text-muted-foreground" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
