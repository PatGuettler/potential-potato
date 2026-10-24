import { useState } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RecordsLayout } from "@/components/RecordsLayout";
import { Loading } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { fullName } from "@/lib/format";
import { subjectLabel } from "@/lib/family";
import { gradePoints, schoolYearOf, type PublicUser, type TranscriptEntry } from "@shared/core/types";

type Suggestion = { courseId: string; courseTitle: string; subject: string; completion: number; averageScore: number; suggestedGrade: string; suggestedCredits: number };
type Data = { student: PublicUser; school: string; entries: TranscriptEntry[]; totalCredits: number; gpa: number | null; suggestions: Suggestion[] };

const LETTERS = [...Object.keys(gradePoints), "P"];
const SUBJECTS = ["mathematics", "science", "technology", "engineering", "English", "Social studies", "Foreign language", "Fine arts", "Physical education", "Elective"];
const GRADE_NAMES: Record<number, string> = { 9: "Grade 9 (Freshman)", 10: "Grade 10 (Sophomore)", 11: "Grade 11 (Junior)", 12: "Grade 12 (Senior)" };

type Draft = Omit<TranscriptEntry, "id" | "studentId" | "createdAt"> & { id?: string };

function EntryDialog({ studentId, draft, onClose }: { studentId: string; draft: Draft; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ ...draft, credits: String(draft.credits), gradeLevel: String(draft.gradeLevel) });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const save = useMutation({
    mutationFn: () => {
      const body = { ...form, credits: Number(form.credits), gradeLevel: Number(form.gradeLevel) };
      return draft.id ? apiRequest("PUT", `/api/transcript/${draft.id}`, body) : apiRequest("POST", `/api/students/${studentId}/transcript`, body);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/students", studentId, "transcript"] }); onClose(); },
    onError: (e: Error) => toast({ title: "Couldn't save", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{draft.id ? "Edit course" : "Add a course to the transcript"}</DialogTitle></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="space-y-1.5"><Label>Course title</Label><Input value={form.courseTitle} onChange={(e) => set("courseTitle")(e.target.value)} required data-testid="transcript-title" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={form.subject} onValueChange={set("subject")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s} value={s}>{subjectLabel(s)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Grade level</Label>
              <Select value={form.gradeLevel} onValueChange={set("gradeLevel")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[9, 10, 11, 12].map((g) => <SelectItem key={g} value={String(g)}>{GRADE_NAMES[g]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label>School year</Label><Input value={form.schoolYear} onChange={(e) => set("schoolYear")(e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Credits</Label><Input type="number" step="0.25" min="0.25" max="3" value={form.credits} onChange={(e) => set("credits")(e.target.value)} required /></div>
            <div className="space-y-1.5">
              <Label>Final grade</Label>
              <Select value={form.grade} onValueChange={set("grade")}>
                <SelectTrigger data-testid="transcript-grade"><SelectValue /></SelectTrigger>
                <SelectContent>{LETTERS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Notes (optional)</Label><Input value={form.notes ?? ""} onChange={(e) => set("notes")(e.target.value)} placeholder="e.g. Honors, dual enrollment, lab science" /></div>
          <DialogFooter><Button type="submit" disabled={save.isPending} data-testid="transcript-save">Save</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TranscriptBody({ studentId }: { studentId: string }) {
  const { user } = useAuth();
  const { data, isLoading } = useQuery<Data>({ queryKey: ["/api/students", studentId, "transcript"] });
  const [draft, setDraft] = useState<Draft | null>(null);
  const remove = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/transcript/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/students", studentId, "transcript"] }),
  });
  if (isLoading || !data) return <Loading />;
  const canEdit = user?.role === "parent" || user?.role === "admin";
  const thisYear = schoolYearOf(new Date().toISOString());
  const blank: Draft = { courseTitle: "", subject: "mathematics", gradeLevel: 9, schoolYear: thisYear, credits: 1, grade: "A" };
  const byGrade = [9, 10, 11, 12].map((g) => ({ g, rows: data.entries.filter((e) => e.gradeLevel === g) })).filter((x) => x.rows.length);

  return (
    <>
      <div className="flex flex-wrap gap-2 print:hidden">
        {canEdit && <Button size="sm" onClick={() => setDraft(blank)} data-testid="transcript-add"><i className="fas fa-plus mr-2" />Add course</Button>}
        <Button size="sm" variant="outline" onClick={() => window.print()}><i className="fas fa-print mr-2" />Print transcript</Button>
      </div>

      {canEdit && data.suggestions.length > 0 && (
        <Card className="print:hidden border-primary/40">
          <CardHeader className="pb-2"><CardTitle className="text-base">Ready to add from {data.student.firstName}'s coursework</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {data.suggestions.map((s) => (
                <li key={s.courseId} className="flex flex-wrap items-center gap-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{s.courseTitle}</div>
                    <div className="text-xs text-muted-foreground">{s.completion}% of lessons complete · average score {s.averageScore}% · suggested grade {s.suggestedGrade}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setDraft({ ...blank, courseTitle: s.courseTitle, subject: s.subject, grade: s.suggestedGrade, credits: s.suggestedCredits, courseId: s.courseId })}>Add</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6" data-testid="transcript">
          <div className="text-center space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Official high school transcript</div>
            <h2 className="text-2xl font-bold">{data.school}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm border-y border-border py-3">
            <div><span className="text-muted-foreground">Student:</span> {fullName(data.student)}</div>
            <div><span className="text-muted-foreground">Birth date:</span> {data.student.birthDate ? new Date(`${data.student.birthDate}T12:00`).toLocaleDateString() : "—"}</div>
            <div><span className="text-muted-foreground">Cumulative GPA (4.0 scale):</span> <strong data-testid="transcript-gpa">{data.gpa?.toFixed(2) ?? "—"}</strong></div>
            <div><span className="text-muted-foreground">Total credits:</span> <strong>{data.totalCredits}</strong></div>
          </div>
          {byGrade.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">No high school courses recorded yet.</p>
          ) : (
            byGrade.map(({ g, rows }) => (
              <div key={g}>
                <h3 className="font-semibold mb-2">{GRADE_NAMES[g]} · {rows[0].schoolYear}</h3>
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-muted-foreground border-b border-border"><th className="py-1.5">Course</th><th>Subject</th><th className="text-right">Credits</th><th className="text-right">Grade</th><th className="print:hidden" /></tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-border last:border-0">
                        <td className="py-1.5">{r.courseTitle}{r.notes && <span className="text-xs text-muted-foreground"> ({r.notes})</span>}</td>
                        <td>{subjectLabel(r.subject)}</td>
                        <td className="text-right">{r.credits}</td>
                        <td className="text-right font-semibold">{r.grade}</td>
                        <td className="text-right print:hidden">
                          {canEdit && (
                            <>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDraft(r)} title="Edit"><i className="fas fa-pen text-xs text-muted-foreground" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => confirm(`Remove ${r.courseTitle}?`) && remove.mutate(r.id)} title="Remove"><i className="fas fa-trash text-xs text-muted-foreground" /></Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
          <div className="pt-6 grid sm:grid-cols-2 gap-8 text-sm">
            <div className="border-t border-foreground/40 pt-1">Parent / administrator signature</div>
            <div className="border-t border-foreground/40 pt-1">Date</div>
          </div>
          <p className="text-xs text-muted-foreground">Grading scale: A 93–100, A- 90–92, B+ 87–89, B 83–86, B- 80–82, C+ 77–79, C 73–76, C- 70–72, D 60–69, F below 60. One credit = one year-long course (about 120–180 hours).</p>
        </CardContent>
      </Card>
      {draft && <EntryDialog studentId={studentId} draft={draft} onClose={() => setDraft(null)} />}
    </>
  );
}

export default function TranscriptPage() {
  const { studentId } = useParams<{ studentId?: string }>();
  return (
    <RecordsLayout kind="transcript" title="Transcript" studentId={studentId}>
      {(id) => <TranscriptBody key={id} studentId={id} />}
    </RecordsLayout>
  );
}
