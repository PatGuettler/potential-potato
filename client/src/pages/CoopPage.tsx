import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { EmptyState, Loading } from "@/components/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useFamily } from "@/lib/family";
import { parseGrade } from "@shared/core/types";

type CoopClass = {
  id: string; name: string; subject: string; description?: string; schedule?: string; location?: string;
  gradeMin?: number; gradeMax?: number; fee?: string; capacity?: number; enrolled: number; seatsLeft: number | null;
  teacherName: string; courseTitle?: string; myChildren: string[];
};
type MyClass = { id: string; name: string; description?: string; schedule?: string; location?: string; gradeMin?: number; gradeMax?: number; fee?: string; capacity?: number; openEnrollment?: boolean; isFamily?: boolean };

const g = (n?: number) => (n === undefined ? "" : n === 0 ? "K" : String(n));

function CoopDetailsDialog({ cls, onClose }: { cls: MyClass; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    description: cls.description ?? "", schedule: cls.schedule ?? "", location: cls.location ?? "", fee: cls.fee ?? "",
    gradeMin: cls.gradeMin === undefined ? "" : String(cls.gradeMin), gradeMax: cls.gradeMax === undefined ? "" : String(cls.gradeMax),
    capacity: cls.capacity ? String(cls.capacity) : "", openEnrollment: !!cls.openEnrollment,
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const save = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/teacher/classrooms/${cls.id}`, form),
    onSuccess: () => { toast({ title: "Class updated" }); queryClient.invalidateQueries(); onClose(); },
    onError: (e: Error) => toast({ title: "Couldn't save", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Co-op details: {cls.name}</DialogTitle><DialogDescription>Families see these when browsing classes.</DialogDescription></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <label className="flex items-center gap-2 text-sm"><Switch checked={form.openEnrollment} onCheckedChange={(v) => setForm((f) => ({ ...f, openEnrollment: v }))} data-testid="open-enrollment" /> Open for family sign-ups</label>
          <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description")(e.target.value)} rows={2} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Schedule</Label><Input value={form.schedule} onChange={(e) => set("schedule")(e.target.value)} placeholder="Tuesdays 10:00–11:30" /></div>
            <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location")(e.target.value)} placeholder="Room 3, Grace Church" /></div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1.5"><Label>Min grade</Label><Input type="number" min={0} max={12} value={form.gradeMin} onChange={(e) => set("gradeMin")(e.target.value)} placeholder="K=0" /></div>
            <div className="space-y-1.5"><Label>Max grade</Label><Input type="number" min={0} max={12} value={form.gradeMax} onChange={(e) => set("gradeMax")(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Seats</Label><Input type="number" min={1} value={form.capacity} onChange={(e) => set("capacity")(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Fee</Label><Input value={form.fee} onChange={(e) => set("fee")(e.target.value)} placeholder="$40/term" /></div>
          </div>
          <DialogFooter><Button type="submit" disabled={save.isPending} data-testid="coop-save">Save</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CoopPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isParent = user?.role === "parent";
  const staff = user?.role === "teacher" || user?.role === "admin";
  const { data: classes = [], isLoading } = useQuery<CoopClass[]>({ queryKey: ["/api/coop/classes"] });
  const { data: family } = useFamily();
  const { data: mine = [] } = useQuery<MyClass[]>({ queryKey: ["/api/teacher/classrooms"], enabled: staff });
  const [editing, setEditing] = useState<MyClass | null>(null);

  const enroll = useMutation({
    mutationFn: ({ classId, studentId, join }: { classId: string; studentId: string; join: boolean }) =>
      join ? apiRequest("POST", `/api/coop/classes/${classId}/enroll`, { studentId }) : apiRequest("DELETE", `/api/coop/classes/${classId}/enroll/${studentId}`),
    onSuccess: (_r, v) => { toast({ title: v.join ? "Enrolled!" : "Withdrawn" }); queryClient.invalidateQueries(); },
    onError: (e: Error) => toast({ title: "Couldn't update enrollment", description: e.message, variant: "destructive" }),
  });

  return (
    <AppShell title="Co-op classes" subtitle="Shared classes families can sign up for">
      {staff && mine.filter((c) => !c.isFamily).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Your classes</div>
            <div className="flex flex-wrap gap-2">
              {mine.filter((c) => !c.isFamily).map((c) => (
                <Button key={c.id} size="sm" variant="outline" onClick={() => setEditing(c)} data-testid={`coop-edit-${c.id}`}>
                  {c.openEnrollment ? <i className="fas fa-door-open text-green-600 mr-2" /> : <i className="fas fa-lock text-muted-foreground mr-2" />}
                  {c.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click a class to set its schedule, grade range, seats, and fee, and to open it for sign-ups.</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Loading />
      ) : classes.length === 0 ? (
        <Card><EmptyState icon="fas fa-users" title="No classes open for sign-up">Teachers and admins can open a class for enrollment from this page.</EmptyState></Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {classes.map((c) => {
            const full = c.seatsLeft === 0;
            return (
              <Card key={c.id} data-testid={`coop-class-${c.id}`}>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.teacherName}{c.courseTitle ? ` · ${c.courseTitle}` : ""}</div>
                  </div>
                  {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
                  <div className="space-y-1 text-sm">
                    {c.schedule && <div><i className="fas fa-clock w-5 text-muted-foreground" />{c.schedule}</div>}
                    {c.location && <div><i className="fas fa-location-dot w-5 text-muted-foreground" />{c.location}</div>}
                    {(c.gradeMin !== undefined || c.gradeMax !== undefined) && <div><i className="fas fa-child w-5 text-muted-foreground" />Grades {g(c.gradeMin) || "K"}–{g(c.gradeMax) || "12"}</div>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.fee && <Badge variant="outline">{c.fee}</Badge>}
                    {c.capacity ? <Badge variant="outline" className={full ? "text-red-600" : ""}>{full ? "Full" : `${c.seatsLeft} of ${c.capacity} seats left`}</Badge> : <Badge variant="outline">{c.enrolled} enrolled</Badge>}
                  </div>
                  {isParent && family && family.children.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-border">
                      {family.children.map((kid) => {
                        const inIt = c.myChildren.includes(kid.id);
                        const grade = parseGrade(kid.gradeLevel);
                        const outOfRange = grade !== undefined && ((c.gradeMin !== undefined && grade < c.gradeMin) || (c.gradeMax !== undefined && grade > c.gradeMax));
                        return (
                          <div key={kid.id} className="flex items-center justify-between gap-2 text-sm">
                            <span>{kid.firstName} {inIt && <Badge className="ml-1">Enrolled</Badge>}</span>
                            {inIt ? (
                              <Button size="sm" variant="ghost" onClick={() => enroll.mutate({ classId: c.id, studentId: kid.id, join: false })}>Withdraw</Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled={full || outOfRange || enroll.isPending} title={outOfRange ? "Outside this class's grade range" : undefined} onClick={() => enroll.mutate({ classId: c.id, studentId: kid.id, join: true })} data-testid={`enroll-${c.id}-${kid.username}`}>
                                {outOfRange ? "Not this grade" : "Enroll"}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {staff && <Link href={`/classes/${c.id}`} className="text-sm text-primary hover:underline">Open gradebook</Link>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {editing && <CoopDetailsDialog cls={editing} onClose={() => setEditing(null)} />}
    </AppShell>
  );
}
