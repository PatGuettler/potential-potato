import { useState } from "react";
import { Link, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { CourseDialog } from "@/components/CourseDialog";
import { PlanCourseDialog } from "@/components/PlanCourseDialog";
import { EmptyState, Loading, ProgressBar, StatusBadge } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { styleFor } from "@/lib/format";
import { gradeLabel, type Course, type CourseUnit } from "@shared/core/types";

type LessonRow = { id: string; title: string; description: string; estimatedDuration: number; difficulty: string; questionCount: number; hasWrittenResponse: boolean; status?: string; score?: number };
type Detail = Course & { lessonCount: number; completedCount?: number; lessons: Record<string, LessonRow>; classes: { id: string; name: string }[] };

function AssignUnitDialog({ course, unit, onClose }: { course: Detail; unit: CourseUnit; onClose: () => void }) {
  const { toast } = useToast();
  const { data: classes = [] } = useQuery<{ id: string; name: string; courseId?: string }[]>({ queryKey: ["/api/teacher/classrooms"] });
  const preferred = classes.find((c) => c.courseId === course.id)?.id;
  const [classroomId, setClassroomId] = useState<string>("");
  const [start, setStart] = useState(() => new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10));
  const [spacing, setSpacing] = useState("2");
  const target = classroomId || preferred || "";
  const assign = useMutation({
    mutationFn: () => apiRequest<{ created: number; skipped: number }>("POST", `/api/teacher/classrooms/${target}/assign-unit`, { courseId: course.id, unitId: unit.id, startDate: new Date(`${start}T23:59`).toISOString(), spacingDays: Number(spacing) }),
    onSuccess: (r) => {
      toast({ title: `Assigned ${r.created} lesson${r.created === 1 ? "" : "s"}`, description: r.skipped ? `${r.skipped} were already assigned to this class.` : "Due dates are spaced out from your start date." });
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (e: Error) => toast({ title: "Couldn't assign unit", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Assign “{unit.title}”</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (target) assign.mutate(); }}>
          <div className="space-y-1.5">
            <Label>Class</Label>
            <Select value={target} onValueChange={setClassroomId}>
              <SelectTrigger data-testid="assign-unit-class"><SelectValue placeholder="Choose a class" /></SelectTrigger>
              <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="unit-start">First lesson due</Label>
              <Input id="unit-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Then one lesson every</Label>
              <Select value={spacing} onValueChange={setSpacing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[1, 2, 3, 5, 7].map((d) => <SelectItem key={d} value={String(d)}>{d === 7 ? "week" : `${d} day${d > 1 ? "s" : ""}`}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{unit.lessonIds.length} lessons will be assigned in order. Lessons already assigned to the class are skipped.</p>
          <DialogFooter><Button type="submit" disabled={!target || assign.isPending} data-testid="assign-unit-submit">Assign unit</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const staff = user?.role === "teacher" || user?.role === "admin";
  const isParent = user?.role === "parent";
  const isStudent = user?.role === "student";
  const [planning, setPlanning] = useState<{ unitId?: string; count: number } | null>(null);
  const { data: course, isLoading, error } = useQuery<Detail>({ queryKey: ["/api/courses", id] });
  const [editing, setEditing] = useState(false);
  const [assigning, setAssigning] = useState<CourseUnit | null>(null);

  if (error) return <AppShell title="Course"><Card><EmptyState icon="fas fa-book" title="Course not found">{(error as Error).message}</EmptyState></Card></AppShell>;
  if (isLoading || !course) return <AppShell title="Course"><Loading /></AppShell>;
  const s = styleFor(course.subject);
  const canEdit = staff && (user?.role === "admin" || course.authorId === user?.id);
  let n = 0;

  return (
    <AppShell
      title={course.title}
      subtitle={[gradeLabel(course.gradeLevel, course.gradeLevelMax), course.framework].filter(Boolean).join(" · ")}
      actions={
        <>
          {isParent && <Button size="sm" onClick={() => setPlanning({ count: course.lessonCount })} data-testid="add-to-plan"><i className="fas fa-calendar-plus mr-2" />Add to my child's plan</Button>}
          {canEdit && <Button size="sm" variant="outline" onClick={() => setEditing(true)} data-testid="edit-course">Edit course</Button>}
        </>
      }
    >
      <Card className="overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${s.gradient}`} />
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 space-y-2">
            <p>{course.description}</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline">{course.units.length} units</Badge>
              <Badge variant="outline">{course.lessonCount} lessons</Badge>
              {course.classes.map((c) => (
                <Link key={c.id} href={`/classes/${c.id}`}><Badge className="cursor-pointer">Your class: {c.name}</Badge></Link>
              ))}
            </div>
          </div>
          {isStudent && course.completedCount !== undefined && course.lessonCount > 0 && (
            <div className="md:w-64">
              <div className="flex justify-between text-sm mb-1.5"><span>Your progress</span><span className="text-muted-foreground">{course.completedCount}/{course.lessonCount}</span></div>
              <ProgressBar value={(course.completedCount / course.lessonCount) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {course.units.map((unit) => (
        <Card key={unit.id} data-testid={`unit-${unit.id}`}>
          <CardHeader className="pb-2 flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle className="text-base">{unit.title}</CardTitle>
              {unit.description && <p className="text-sm text-muted-foreground mt-1">{unit.description}</p>}
            </div>
            {isParent && unit.lessonIds.length > 0 && (
              <Button size="sm" variant="outline" className="shrink-0" onClick={() => setPlanning({ unitId: unit.id, count: unit.lessonIds.length })}><i className="fas fa-calendar-plus mr-2" />Plan this unit</Button>
            )}
            {staff && (
              <div className="flex gap-1 shrink-0">
                {unit.lessonIds.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => setAssigning(unit)} data-testid={`assign-${unit.id}`}><i className="fas fa-calendar-plus mr-2" />Assign unit</Button>
                )}
                <Link href={`/courses/${course.id}/units/${unit.id}/new-lesson`}>
                  <Button size="sm" variant="ghost"><i className="fas fa-plus mr-2" />Lesson</Button>
                </Link>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {unit.lessonIds.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No lessons in this unit yet.</p>
            ) : (
              <ol className="divide-y divide-border">
                {unit.lessonIds.map((lid) => {
                  const l = course.lessons[lid];
                  n++;
                  return (
                    <li key={lid}>
                      <Link href={`/lesson/${lid}`} className="flex items-center gap-3 py-3 hover:bg-muted/50 -mx-2 px-2 rounded-md" data-testid={`course-lesson-${lid}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${s.bg} ${s.text}`}>{n}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{l.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {l.estimatedDuration} min · {l.questionCount} questions{l.hasWrittenResponse ? " · written response" : ""} · {l.description}
                          </div>
                        </div>
                        {isStudent && l.status && <StatusBadge status={l.status} />}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>
      ))}

      {editing && <CourseDialog open={editing} onOpenChange={setEditing} course={course} />}
      {assigning && <AssignUnitDialog course={course} unit={assigning} onClose={() => setAssigning(null)} />}
      {planning && <PlanCourseDialog courseId={course.id} courseTitle={planning.unitId ? course.units.find((u) => u.id === planning.unitId)!.title : course.title} lessonCount={planning.count} unitId={planning.unitId} onClose={() => setPlanning(null)} />}
    </AppShell>
  );
}
