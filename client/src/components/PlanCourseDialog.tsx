import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { shortDate } from "@/lib/format";
import { useFamily } from "@/lib/family";

const PACES = [
  { value: "1", label: "Every school day (5 a week)" },
  { value: "2", label: "Every other school day" },
  { value: "3", label: "Twice a week" },
  { value: "5", label: "Once a week" },
];

/** Lets a parent put a whole course (or one unit) on one or more children's schedules. */
export function PlanCourseDialog({ courseId, courseTitle, lessonCount, unitId, onClose }: { courseId: string; courseTitle: string; lessonCount: number; unitId?: string; onClose: () => void }) {
  const { toast } = useToast();
  const { data: family } = useFamily();
  const [kids, setKids] = useState<Set<string>>(new Set());
  const [start, setStart] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [pace, setPace] = useState("1");
  const plan = useMutation({
    mutationFn: () =>
      apiRequest<{ created: number; skipped: number; lastDue: string | null }>("POST", `/api/teacher/classrooms/${family!.familyClassId}/${unitId ? "assign-unit" : "assign-course"}`, {
        courseId,
        unitId,
        studentIds: Array.from(kids),
        startDate: new Date(`${start}T12:00`).toISOString(),
        spacingDays: Number(pace),
      }),
    onSuccess: (r) => {
      toast({ title: `Planned ${r.created} lessons`, description: r.lastDue ? `Finishes around ${shortDate(r.lastDue)}. Due dates skip weekends.` : "Everything was already on the schedule." });
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (e: Error) => toast({ title: "Couldn't plan the course", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add “{courseTitle}” to the plan</DialogTitle>
          <DialogDescription>{lessonCount} lessons will be scheduled in order. Courses can be any level, not just your child's grade.</DialogDescription>
        </DialogHeader>
        {!family?.children.length ? (
          <p className="text-sm">Add your children first on the <Link href="/family" className="text-primary underline" onClick={onClose}>My family</Link> page.</p>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (kids.size) plan.mutate(); }}>
            <div className="space-y-2">
              <Label>For</Label>
              {family.children.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={kids.has(c.id)} onCheckedChange={(v) => setKids((s) => { const n = new Set(s); v ? n.add(c.id) : n.delete(c.id); return n; })} data-testid={`plan-child-${c.username}`} />
                  {c.firstName} {c.gradeLevel && <span className="text-muted-foreground">({c.gradeLevel})</span>}
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="plan-start">Start</Label>
                <Input id="plan-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Pace</Label>
                <Select value={pace} onValueChange={setPace}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PACES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button type="submit" disabled={!kids.size || plan.isPending} data-testid="plan-submit">Add to plan</Button></DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
