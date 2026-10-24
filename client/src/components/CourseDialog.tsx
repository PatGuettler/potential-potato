import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Course } from "@shared/core/types";

export const GRADES = Array.from({ length: 13 }, (_, g) => ({ value: String(g), label: g === 0 ? "K" : String(g) }));
export const SUBJECTS = [
  { id: "mathematics", name: "Mathematics" },
  { id: "science", name: "Science" },
  { id: "technology", name: "Technology" },
  { id: "engineering", name: "Engineering" },
];

type UnitDraft = { id?: string; title: string; description?: string };

/** Create or edit a course and its units. */
export function CourseDialog({ open, onOpenChange, course }: { open: boolean; onOpenChange: (o: boolean) => void; course?: Course }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [form, setForm] = useState(() => ({
    title: course?.title ?? "",
    subject: course?.subject ?? "mathematics",
    gradeLevel: String(course?.gradeLevel ?? 6),
    gradeLevelMax: course?.gradeLevelMax !== undefined ? String(course.gradeLevelMax) : "",
    description: course?.description ?? "",
    framework: course?.framework ?? "",
  }));
  const [units, setUnits] = useState<UnitDraft[]>(() =>
    course?.units.map((u) => ({ id: u.id, title: u.title, description: u.description })) ?? [{ title: "Unit 1: " }],
  );
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = useMutation({
    mutationFn: () => {
      const body = { ...form, gradeLevel: Number(form.gradeLevel), gradeLevelMax: form.gradeLevelMax === "" ? null : Number(form.gradeLevelMax), units: units.filter((u) => u.title.trim()) };
      return course ? apiRequest<Course>("PUT", `/api/courses/${course.id}`, body) : apiRequest<Course>("POST", "/api/courses", body);
    },
    onSuccess: (c) => {
      toast({ title: course ? "Course saved" : "Course created", description: course ? undefined : "Now add lessons to each unit." });
      queryClient.invalidateQueries();
      onOpenChange(false);
      if (!course) navigate(`/courses/${c.id}`);
    },
    onError: (e: Error) => toast({ title: "Couldn't save course", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-xl">
        <DialogHeader><DialogTitle>{course ? "Edit course" : "New course"}</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="space-y-1.5">
            <Label htmlFor="course-title">Course title</Label>
            <Input id="course-title" value={form.title} onChange={(e) => set("title")(e.target.value)} placeholder="Grade 6 Math" required data-testid="course-title" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={form.subject} onValueChange={set("subject")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select value={form.gradeLevel} onValueChange={set("gradeLevel")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Through grade</Label>
              <Select value={form.gradeLevelMax || "none"} onValueChange={(v) => set("gradeLevelMax")(v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Single grade</SelectItem>
                  {GRADES.filter((g) => Number(g.value) > Number(form.gradeLevel)).map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="course-desc">Description</Label>
            <Textarea id="course-desc" value={form.description} onChange={(e) => set("description")(e.target.value)} rows={2} placeholder="What students will learn this year" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="course-fw">Standards framework (optional)</Label>
            <Input id="course-fw" value={form.framework} onChange={(e) => set("framework")(e.target.value)} placeholder="Common Core State Standards for Mathematics" />
          </div>
          <div className="space-y-2">
            <Label>Units, in teaching order</Label>
            {units.map((u, i) => (
              <div key={u.id ?? i} className="flex gap-2">
                <Input value={u.title} onChange={(e) => setUnits((all) => all.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} placeholder={`Unit ${i + 1}: Title`} />
                <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => setUnits((all) => { const c = [...all]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; return c; })} title="Move up">
                  <i className="fas fa-arrow-up" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => setUnits((all) => all.filter((_, j) => j !== i))} title="Remove unit" disabled={units.length === 1}>
                  <i className="fas fa-trash text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setUnits((all) => [...all, { title: `Unit ${all.length + 1}: ` }])}>
              <i className="fas fa-plus mr-2" />Add unit
            </Button>
            {course && <p className="text-xs text-muted-foreground">Removing a unit keeps its lessons in the library; they just won't be filed in this course.</p>}
          </div>
          <DialogFooter><Button type="submit" disabled={save.isPending} data-testid="course-save">{course ? "Save course" : "Create course"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
