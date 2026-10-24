import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RecordsLayout } from "@/components/RecordsLayout";
import { Loading, ProgressBar, StatCard } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { downloadCsv, fullName } from "@/lib/format";
import { RECORD_SUBJECTS, subjectLabel } from "@/lib/family";
import { schoolYearOf, type AttendanceEntry, type FamilySettings, type PublicUser } from "@shared/core/types";

type Data = { student: PublicUser; settings: FamilySettings; years: string[]; entries: (AttendanceEntry & { lessonTitle?: string })[] };

const hours = (m: number) => Math.round((m / 60) * 10) / 10;

function AttendanceBody({ studentId }: { studentId: string }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data, isLoading } = useQuery<Data>({ queryKey: ["/api/students", studentId, "attendance"] });
  const [year, setYear] = useState<string | null>(null);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), hours: "1", subject: "Reading", note: "" });

  const add = useMutation({
    mutationFn: () => apiRequest("POST", `/api/students/${studentId}/attendance`, { date: form.date, minutes: Math.round(Number(form.hours) * 60), subject: form.subject, note: form.note }),
    onSuccess: () => { toast({ title: "Logged" }); setForm((f) => ({ ...f, note: "" })); queryClient.invalidateQueries({ queryKey: ["/api/students", studentId, "attendance"] }); },
    onError: (e: Error) => toast({ title: "Couldn't log time", description: e.message, variant: "destructive" }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/attendance/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/students", studentId, "attendance"] }),
  });

  const view = useMemo(() => {
    if (!data) return null;
    const y = year ?? data.years[0];
    const entries = data.entries.filter((e) => schoolYearOf(e.date, data.settings.schoolYearStart) === y);
    const days = new Map<string, typeof entries>();
    for (const e of entries) days.set(e.date, [...(days.get(e.date) ?? []), e]);
    const bySubject = new Map<string, number>();
    for (const e of entries) bySubject.set(e.subject, (bySubject.get(e.subject) ?? 0) + e.minutes);
    return { y, entries, days: Array.from(days.entries()), bySubject: Array.from(bySubject.entries()).sort((a, b) => b[1] - a[1]), total: entries.reduce((n, e) => n + e.minutes, 0) };
  }, [data, year]);

  if (isLoading || !data || !view) return <Loading />;
  const { settings, student } = data;
  const reqDays = settings.requiredDays;
  const reqHours = settings.requiredHours;
  const canEdit = user?.role !== "student";

  const exportCsv = () =>
    downloadCsv(`${student.firstName}-attendance-${view.y}.csv`, [
      ["Date", "Subject", "Minutes", "Hours", "Source", "Lesson", "Note"],
      ...view.entries.slice().reverse().map((e) => [e.date, subjectLabel(e.subject), e.minutes, hours(e.minutes), e.source === "auto" ? "Lesson time" : "Logged by hand", e.lessonTitle, e.note]),
      [],
      ["Total days", view.days.length],
      ["Total hours", hours(view.total)],
    ]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <Select value={view.y} onValueChange={setYear}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{data.years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={exportCsv} data-testid="attendance-export"><i className="fas fa-file-csv mr-2" />Export CSV</Button>
        <Button size="sm" variant="outline" onClick={() => window.print()}><i className="fas fa-print mr-2" />Print</Button>
      </div>
      <h2 className="hidden print:block text-xl font-semibold">{settings.schoolName}: attendance for {fullName(student)}, {view.y}</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="School days logged" value={view.days.length} hint={reqDays ? `of ${reqDays} required` : undefined} icon="fas fa-calendar-check" tone="text-green-600" />
        <StatCard label="Hours of instruction" value={hours(view.total)} hint={reqHours ? `of ${reqHours} required` : undefined} icon="fas fa-clock" tone="text-sky-600" />
        <StatCard label="Average per day" value={view.days.length ? `${hours(view.total / view.days.length)} h` : "—"} icon="fas fa-chart-line" />
        <StatCard label="Subjects covered" value={view.bySubject.length} icon="fas fa-shapes" tone="text-violet-600" />
      </div>
      {(reqDays || reqHours) && (
        <Card>
          <CardContent className="p-5 space-y-3">
            {reqDays ? (
              <div>
                <div className="flex justify-between text-sm mb-1.5"><span>Days toward {reqDays}</span><span className="text-muted-foreground">{Math.min(100, Math.round((view.days.length / reqDays) * 100))}%</span></div>
                <ProgressBar value={(view.days.length / reqDays) * 100} />
              </div>
            ) : null}
            {reqHours ? (
              <div>
                <div className="flex justify-between text-sm mb-1.5"><span>Hours toward {reqHours}</span><span className="text-muted-foreground">{Math.min(100, Math.round((hours(view.total) / reqHours) * 100))}%</span></div>
                <ProgressBar value={(hours(view.total) / reqHours) * 100} />
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Daily log</CardTitle></CardHeader>
          <CardContent>
            {view.days.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing logged this school year yet. Lesson time is added automatically; log other learning (reading, field trips, music) by hand.</p>
            ) : (
              <ul className="divide-y divide-border" data-testid="attendance-days">
                {view.days.map(([date, entries]) => (
                  <li key={date} className="py-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{new Date(`${date}T12:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                      <span className="text-muted-foreground">{hours(entries.reduce((n, e) => n + e.minutes, 0))} h</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {entries.map((e) => (
                        <li key={e.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="shrink-0">{subjectLabel(e.subject)}</Badge>
                          <span className="truncate flex-1">{e.lessonTitle ?? e.note ?? ""}</span>
                          <span className="shrink-0">{e.minutes} min</span>
                          {e.source === "auto" ? <i className="fas fa-bolt text-amber-500" title="Logged automatically from lesson time" /> : canEdit && (
                            <button className="print:hidden" onClick={() => remove.mutate(e.id)} title="Delete entry"><i className="fas fa-times" /></button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {canEdit && (
            <Card className="print:hidden">
              <CardHeader className="pb-2"><CardTitle className="text-base">Log learning time</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required /></div>
                    <div className="space-y-1.5"><Label>Hours</Label><Input type="number" step="0.25" min="0.25" max="12" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} required data-testid="attendance-hours" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subject</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm((f) => ({ ...f, subject: v }))}>
                      <SelectTrigger data-testid="attendance-subject"><SelectValue /></SelectTrigger>
                      <SelectContent>{RECORD_SUBJECTS.map((s) => <SelectItem key={s} value={s}>{subjectLabel(s)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Note</Label><Input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="e.g. Read chapters 3–4 of Charlotte's Web" /></div>
                  <Button type="submit" className="w-full" disabled={add.isPending} data-testid="attendance-add">Add to log</Button>
                </form>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Hours by subject</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              {view.bySubject.length === 0 && <p className="text-sm text-muted-foreground">No time logged yet.</p>}
              {view.bySubject.map(([s, m]) => (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1"><span>{subjectLabel(s)}</span><span className="text-muted-foreground">{hours(m)} h</span></div>
                  <ProgressBar value={(m / view.bySubject[0][1]) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function AttendancePage() {
  const { studentId } = useParams<{ studentId?: string }>();
  return (
    <RecordsLayout kind="attendance" title="Attendance & hours" studentId={studentId}>
      {(id) => <AttendanceBody key={id} studentId={id} />}
    </RecordsLayout>
  );
}
