import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Loading } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { fullName, initials } from "@/lib/format";
import { useFamily, type ChildSummary } from "@/lib/family";

const GRADE_OPTIONS = ["Kindergarten", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];

function ChildDialog({ child, onClose }: { child?: ChildSummary; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: child?.firstName ?? "",
    lastName: child?.lastName ?? "",
    username: child?.username ?? "",
    password: "",
    gradeLevel: child?.gradeLevel ?? "Grade 3",
    birthDate: child?.birthDate ?? "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const save = useMutation({
    mutationFn: () => {
      const { password, username, ...rest } = form;
      return child
        ? apiRequest("PATCH", `/api/family/children/${child.id}`, password ? { ...rest, password } : rest)
        : apiRequest("POST", "/api/family/children", form);
    },
    onSuccess: () => {
      toast({ title: child ? "Saved" : `${form.firstName} added`, description: child ? undefined : `They can sign in as “${form.username}”.` });
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (e: Error) => toast({ title: "Couldn't save", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{child ? `Edit ${child.firstName}` : "Add a child"}</DialogTitle>
          <DialogDescription>Each child gets their own sign-in so their progress is tracked separately.</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>First name</Label><Input value={form.firstName} onChange={(e) => set("firstName")(e.target.value)} required data-testid="child-first" /></div>
            <div className="space-y-1.5"><Label>Last name</Label><Input value={form.lastName} onChange={(e) => set("lastName")(e.target.value)} placeholder="Same as yours" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select value={form.gradeLevel} onValueChange={set("gradeLevel")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GRADE_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Birth date (for transcripts)</Label><Input type="date" value={form.birthDate} onChange={(e) => set("birthDate")(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Username</Label><Input value={form.username} onChange={(e) => set("username")(e.target.value)} disabled={!!child} required data-testid="child-username" /></div>
            <div className="space-y-1.5"><Label>{child ? "New password (optional)" : "Password"}</Label><Input type="password" value={form.password} onChange={(e) => set("password")(e.target.value)} required={!child} minLength={6} data-testid="child-password" /></div>
          </div>
          <DialogFooter><Button type="submit" disabled={save.isPending} data-testid="child-save">{child ? "Save" : "Add child"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CoParentDialog({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", password: "", email: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const save = useMutation({
    mutationFn: () => apiRequest("POST", "/api/family/parents", form),
    onSuccess: () => {
      toast({ title: "Co-parent added", description: "They see the same children, plans, and records." });
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (e: Error) => toast({ title: "Couldn't add", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add another parent</DialogTitle></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>First name</Label><Input value={form.firstName} onChange={(e) => set("firstName")(e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Last name</Label><Input value={form.lastName} onChange={(e) => set("lastName")(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Username</Label><Input value={form.username} onChange={(e) => set("username")(e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => set("password")(e.target.value)} required minLength={8} /></div>
          </div>
          <DialogFooter><Button type="submit" disabled={save.isPending}>Add parent</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FamilyPage() {
  const { toast } = useToast();
  const { data: family, isLoading } = useFamily();
  const [dialog, setDialog] = useState<null | "add" | "parent" | ChildSummary>(null);
  const [settings, setSettings] = useState({ schoolName: "", state: "", requiredDays: "", requiredHours: "", schoolYearStart: "08-01" });
  useEffect(() => {
    if (!family) return;
    const s = family.settings;
    setSettings({ schoolName: s.schoolName, state: s.state ?? "", requiredDays: s.requiredDays ? String(s.requiredDays) : "", requiredHours: s.requiredHours ? String(s.requiredHours) : "", schoolYearStart: s.schoolYearStart });
  }, [family?.settings]);
  const saveSettings = useMutation({
    mutationFn: () => apiRequest("PUT", "/api/family/settings", settings),
    onSuccess: () => { toast({ title: "Settings saved" }); queryClient.invalidateQueries(); },
    onError: (e: Error) => toast({ title: "Couldn't save", description: e.message, variant: "destructive" }),
  });

  if (isLoading || !family) return <AppShell title="My family"><Loading /></AppShell>;

  return (
    <AppShell
      title="My family"
      subtitle={family.settings.schoolName}
      actions={<Button size="sm" onClick={() => setDialog("add")} data-testid="add-child"><i className="fas fa-plus mr-2" />Add child</Button>}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {family.children.length === 0 && (
            <Card><CardContent className="p-8 text-center space-y-3">
              <i className="fas fa-child-reaching text-4xl text-primary" />
              <h3 className="font-semibold">Add your first child</h3>
              <p className="text-sm text-muted-foreground">Then pick courses for them from the catalog. Lessons, attendance, and records are tracked for each child.</p>
              <Button onClick={() => setDialog("add")}>Add a child</Button>
            </CardContent></Card>
          )}
          {family.children.map((c) => (
            <Card key={c.id} data-testid={`family-child-${c.username}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 flex items-center justify-center font-semibold">{initials(c)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{fullName(c)}</div>
                    <div className="text-xs text-muted-foreground">{c.gradeLevel ?? "No grade set"} · signs in as @{c.username}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setDialog(c)}>Edit</Button>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1.5">Courses</div>
                  {c.courses.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {c.courses.map((co) => (
                        <Link key={co.id} href={`/courses/${co.id}`} className="text-xs rounded-full bg-muted px-2.5 py-1 hover:bg-muted/70">{co.title} · {co.completedCount}/{co.lessonCount}</Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No courses yet. <Link href="/courses" className="text-primary underline">Browse the catalog</Link> and click “Add to my child's plan.”</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/students/${c.id}`}><Button size="sm" variant="outline">Progress report</Button></Link>
                  <Link href={`/records/attendance/${c.id}`}><Button size="sm" variant="outline">Attendance</Button></Link>
                  <Link href={`/records/portfolio/${c.id}`}><Button size="sm" variant="outline">Portfolio</Button></Link>
                  <Link href={`/records/transcript/${c.id}`}><Button size="sm" variant="outline">Transcript</Button></Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Home school settings</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); saveSettings.mutate(); }}>
                <div className="space-y-1.5"><Label>School name (printed on records)</Label><Input value={settings.schoolName} onChange={(e) => setSettings((s) => ({ ...s, schoolName: e.target.value }))} required /></div>
                <div className="space-y-1.5"><Label>State</Label><Input value={settings.state} onChange={(e) => setSettings((s) => ({ ...s, state: e.target.value }))} placeholder="e.g. Ohio" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Required days</Label><Input type="number" min={0} value={settings.requiredDays} onChange={(e) => setSettings((s) => ({ ...s, requiredDays: e.target.value }))} placeholder="180" /></div>
                  <div className="space-y-1.5"><Label>Required hours</Label><Input type="number" min={0} value={settings.requiredHours} onChange={(e) => setSettings((s) => ({ ...s, requiredHours: e.target.value }))} placeholder="optional" /></div>
                </div>
                <div className="space-y-1.5">
                  <Label>School year starts</Label>
                  <Select value={settings.schoolYearStart} onValueChange={(v) => setSettings((s) => ({ ...s, schoolYearStart: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["07-01", "08-01", "08-15", "09-01", "01-01"].map((d) => <SelectItem key={d} value={d}>{new Date(`2026-${d}T12:00`).toLocaleDateString(undefined, { month: "long", day: "numeric" })}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">Homeschool laws vary by state. Check your state's requirements for days, hours, subjects, and assessments.</p>
                <Button type="submit" variant="outline" disabled={saveSettings.isPending}>Save settings</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Parents</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {family.parents.map((p) => <div key={p.id} className="text-sm">{p.name} <span className="text-muted-foreground">@{p.username}</span></div>)}
              <Button size="sm" variant="ghost" onClick={() => setDialog("parent")}><i className="fas fa-user-plus mr-2" />Add another parent</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {dialog === "add" && <ChildDialog onClose={() => setDialog(null)} />}
      {dialog === "parent" && <CoParentDialog onClose={() => setDialog(null)} />}
      {dialog && typeof dialog === "object" && <ChildDialog child={dialog} onClose={() => setDialog(null)} />}
    </AppShell>
  );
}
