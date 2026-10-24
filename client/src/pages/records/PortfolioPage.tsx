import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RecordsLayout } from "@/components/RecordsLayout";
import { Loading } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { fullName, shortDate } from "@/lib/format";
import { RECORD_SUBJECTS, subjectLabel } from "@/lib/family";
import { schoolYearOf, type AttendanceEntry, type FamilySettings, type PortfolioItem, type PublicUser } from "@shared/core/types";

type Report = {
  student: PublicUser;
  progress: { lessonId: string; lessonTitle: string; categoryId?: string; status: string; score: number; completedAt?: string; lastAccessed: string }[];
  submissions: { id: string; lessonTitle: string; answer: string; status: string; teacherScore?: number; feedback?: string; reviewerName?: string; submittedAt: string }[];
  notes: { id: string; body: string; authorName: string; createdAt: string }[];
};
type Attendance = { settings: FamilySettings; years: string[]; entries: AttendanceEntry[] };

function AddItemDialog({ studentId, onClose }: { studentId: string; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", date: new Date().toISOString().slice(0, 10), subject: "science", description: "", link: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const save = useMutation({
    mutationFn: () => apiRequest("POST", `/api/students/${studentId}/portfolio`, form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/students", studentId, "portfolio"] }); onClose(); },
    onError: (e: Error) => toast({ title: "Couldn't add", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a work sample</DialogTitle>
          <DialogDescription>Projects, experiments, book reports, art, field trips. Link to a photo or document in Google Drive, iCloud, etc.</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title")(e.target.value)} placeholder="Baking-soda volcano experiment" required data-testid="portfolio-title" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => set("date")(e.target.value)} required /></div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={form.subject} onValueChange={set("subject")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{RECORD_SUBJECTS.map((s) => <SelectItem key={s} value={s}>{subjectLabel(s)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>What they did and learned</Label><Textarea value={form.description} onChange={(e) => set("description")(e.target.value)} rows={3} /></div>
          <div className="space-y-1.5"><Label>Link to photo or file (optional)</Label><Input value={form.link} onChange={(e) => set("link")(e.target.value)} placeholder="https://" /></div>
          <DialogFooter><Button type="submit" disabled={save.isPending} data-testid="portfolio-save">Add to portfolio</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PortfolioBody({ studentId }: { studentId: string }) {
  const { user } = useAuth();
  const { data: report, isLoading } = useQuery<Report>({ queryKey: ["/api/students", studentId, "report"] });
  const { data: items = [] } = useQuery<PortfolioItem[]>({ queryKey: ["/api/students", studentId, "portfolio"] });
  const { data: att } = useQuery<Attendance>({ queryKey: ["/api/students", studentId, "attendance"] });
  const [year, setYear] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const remove = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/portfolio/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/students", studentId, "portfolio"] }),
  });

  const view = useMemo(() => {
    if (!report || !att) return null;
    const start = att.settings.schoolYearStart;
    const y = year ?? att.years[0];
    const inYear = (d?: string) => !!d && schoolYearOf(d, start) === y;
    const completed = report.progress.filter((p) => p.status === "completed" && inYear(p.completedAt));
    const bySubject = new Map<string, typeof completed>();
    for (const p of completed) bySubject.set(p.categoryId ?? "other", [...(bySubject.get(p.categoryId ?? "other") ?? []), p]);
    const entries = att.entries.filter((e) => inYear(e.date));
    return {
      y,
      bySubject: Array.from(bySubject.entries()),
      completedCount: completed.length,
      days: new Set(entries.map((e) => e.date)).size,
      hours: Math.round(entries.reduce((n, e) => n + e.minutes, 0) / 6) / 10,
      samples: report.submissions.filter((s) => inYear(s.submittedAt)),
      items: items.filter((i) => inYear(i.date)),
      notes: report.notes.filter((n) => inYear(n.createdAt)),
    };
  }, [report, att, items, year]);

  if (isLoading || !report || !att || !view) return <Loading />;
  const canEdit = user?.role !== "student";

  return (
    <>
      <div className="flex flex-wrap gap-2 print:hidden">
        <Select value={view.y} onValueChange={setYear}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{att.years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
        {canEdit && <Button size="sm" onClick={() => setAdding(true)} data-testid="portfolio-add"><i className="fas fa-plus mr-2" />Add work sample</Button>}
        <Button size="sm" variant="outline" onClick={() => window.print()}><i className="fas fa-print mr-2" />Print portfolio</Button>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-8" data-testid="portfolio">
          <div className="text-center space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Student portfolio · {view.y}</div>
            <h2 className="text-2xl font-bold">{fullName(report.student)}</h2>
            <div className="text-sm text-muted-foreground">{att.settings.schoolName}{report.student.gradeLevel ? ` · ${report.student.gradeLevel}` : ""}</div>
          </div>

          <section className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-muted p-3"><div className="text-2xl font-bold">{view.days}</div><div className="text-xs text-muted-foreground">school days</div></div>
            <div className="rounded-lg bg-muted p-3"><div className="text-2xl font-bold">{view.hours}</div><div className="text-xs text-muted-foreground">hours logged</div></div>
            <div className="rounded-lg bg-muted p-3"><div className="text-2xl font-bold">{view.completedCount}</div><div className="text-xs text-muted-foreground">lessons completed</div></div>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Coursework completed</h3>
            {view.bySubject.length === 0 && <p className="text-sm text-muted-foreground">No lessons completed this school year yet.</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              {view.bySubject.map(([subject, rows]) => (
                <div key={subject}>
                  <div className="text-sm font-medium mb-1">{subjectLabel(subject)} ({rows.length})</div>
                  <ul className="text-sm space-y-0.5">
                    {rows.map((r) => <li key={r.lessonId} className="flex justify-between gap-2"><span className="truncate">{r.lessonTitle}</span><span className="text-muted-foreground shrink-0">{r.score}%</span></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Work samples</h3>
            {view.items.length + view.samples.length === 0 && <p className="text-sm text-muted-foreground">Add projects, experiments, and written work to show growth over the year.</p>}
            <div className="space-y-3">
              {view.items.map((i) => (
                <div key={i.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{i.title}</div>
                      <div className="text-xs text-muted-foreground">{shortDate(i.date)} · {subjectLabel(i.subject)}</div>
                    </div>
                    {canEdit && <Button size="icon" variant="ghost" className="h-7 w-7 print:hidden" onClick={() => remove.mutate(i.id)} title="Remove"><i className="fas fa-trash text-xs text-muted-foreground" /></Button>}
                  </div>
                  {i.description && <p className="text-sm mt-1">{i.description}</p>}
                  {i.link && <a href={i.link} target="_blank" rel="noreferrer" className="text-sm text-primary underline break-all">{i.link}</a>}
                </div>
              ))}
              {view.samples.map((s) => (
                <div key={s.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">Written response: {s.lessonTitle}</div>
                      <div className="text-xs text-muted-foreground">{shortDate(s.submittedAt)}</div>
                    </div>
                    {s.status === "reviewed" ? <Badge>{s.teacherScore}%</Badge> : <Badge variant="outline">Awaiting review</Badge>}
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{s.answer}</p>
                  {s.feedback && <p className="text-sm mt-1 text-muted-foreground">Feedback from {s.reviewerName}: {s.feedback}</p>}
                </div>
              ))}
            </div>
          </section>

          {view.notes.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">Teacher and parent notes</h3>
              <ul className="space-y-2 text-sm">{view.notes.map((n) => <li key={n.id}><span className="font-medium">{n.authorName}</span> ({shortDate(n.createdAt)}): {n.body}</li>)}</ul>
            </section>
          )}
        </CardContent>
      </Card>
      {adding && <AddItemDialog studentId={studentId} onClose={() => setAdding(false)} />}
    </>
  );
}

export default function PortfolioPage() {
  const { studentId } = useParams<{ studentId?: string }>();
  return (
    <RecordsLayout kind="portfolio" title="Portfolio" studentId={studentId}>
      {(id) => <PortfolioBody key={id} studentId={id} />}
    </RecordsLayout>
  );
}
