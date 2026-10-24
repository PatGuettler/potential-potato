import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Loading } from "@/components/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { downloadCsv, fullName, relativeTime } from "@/lib/format";
import { userRoles, type PublicUser, type Role } from "@shared/core/types";

type Row = PublicUser & { classroomNames: string[] };

const roleTone: Record<Role, string> = {
  admin: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  teacher: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  parent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  student: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
};

type FormState = { username: string; password: string; firstName: string; lastName: string; email: string; role: Role; gradeLevel: string; childIds: string[]; active: boolean };
const blank: FormState = { username: "", password: "", firstName: "", lastName: "", email: "", role: "student", gradeLevel: "", childIds: [], active: true };

function UserDialog({ open, onOpenChange, editing, students }: { open: boolean; onOpenChange: (o: boolean) => void; editing: Row | null; students: Row[] }) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(blank);
  const [lastKey, setLastKey] = useState<string | null>(null);
  // Reset the form whenever the dialog opens for a different user.
  const key = open ? editing?.id ?? "new" : null;
  if (key !== lastKey) {
    setLastKey(key);
    if (key) {
      setForm(editing ? { ...blank, ...editing, password: "", gradeLevel: editing.gradeLevel ?? "" } : blank);
    }
  }
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = useMutation({
    mutationFn: () => {
      const { password, ...rest } = form;
      const body = password ? { ...rest, password } : rest;
      return editing ? apiRequest("PATCH", `/api/admin/users/${editing.id}`, body) : apiRequest("POST", "/api/admin/users", { ...body, password });
    },
    onSuccess: () => {
      toast({ title: editing ? "User updated" : "User created" });
      onOpenChange(false);
      queryClient.invalidateQueries();
    },
    onError: (e: Error) => toast({ title: "Couldn't save", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editing ? `Edit ${fullName(editing)}` : "Add a person"}</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>First name</Label><Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Last name</Label><Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input value={form.username} onChange={(e) => set("username", e.target.value)} disabled={!!editing} required data-testid="user-username" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => set("role", v as Role)}>
                <SelectTrigger data-testid="user-role"><SelectValue /></SelectTrigger>
                <SelectContent>{userRoles.map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="space-y-1.5">
            <Label>{editing ? "New password (leave blank to keep)" : "Password"}</Label>
            <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required={!editing} minLength={8} data-testid="user-password" />
          </div>
          {form.role === "student" && (
            <div className="space-y-1.5"><Label>Grade level</Label><Input value={form.gradeLevel} onChange={(e) => set("gradeLevel", e.target.value)} placeholder="Grade 7" /></div>
          )}
          {form.role === "parent" && (
            <div className="space-y-1.5">
              <Label>Children</Label>
              <div className="max-h-48 overflow-y-auto rounded-md border border-border divide-y divide-border">
                {students.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.childIds.includes(s.id)}
                      onCheckedChange={(c) => set("childIds", c ? [...form.childIds, s.id] : form.childIds.filter((id) => id !== s.id))}
                    />
                    {fullName(s)} <span className="text-muted-foreground">@{s.username}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {editing && (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.active} onCheckedChange={(c) => set("active", !!c)} /> Account active
            </label>
          )}
          <DialogFooter><Button type="submit" disabled={save.isPending} data-testid="user-save">{editing ? "Save changes" : "Create account"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UserManagement() {
  const { user: me } = useAuth();
  const { toast } = useToast();
  const { data: users = [], isLoading } = useQuery<Row[]>({ queryKey: ["/api/admin/users"] });
  const [filter, setFilter] = useState<Role | "all">("all");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<{ open: boolean; editing: Row | null }>({ open: false, editing: null });

  const students = useMemo(() => users.filter((u) => u.role === "student"), [users]);
  const byId = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);
  const shown = users.filter(
    (u) => (filter === "all" || u.role === filter) && `${fullName(u)} ${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const remove = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries(),
    onError: (e: Error) => toast({ title: "Couldn't delete", description: e.message, variant: "destructive" }),
  });

  const exportCsv = () =>
    downloadCsv("users.csv", [
      ["Name", "Username", "Role", "Email", "Grade", "Classes", "Children", "Active", "Last login"],
      ...users.map((u) => [fullName(u), u.username, u.role, u.email, u.gradeLevel, u.classroomNames.join("; "), u.childIds.map((id) => fullName(byId.get(id))).join("; "), u.active ? "yes" : "no", u.lastLoginAt]),
    ]);

  return (
    <AppShell
      title="Users & families"
      subtitle="Create accounts, set roles and link parents to their children"
      actions={
        <>
          <Button size="sm" variant="outline" onClick={exportCsv}><i className="fas fa-file-csv mr-2" />Export</Button>
          <Button size="sm" onClick={() => setDialog({ open: true, editing: null })} data-testid="add-user"><i className="fas fa-user-plus mr-2" />Add person</Button>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search people" value={search} onChange={(e) => setSearch(e.target.value)} />
        {(["all", ...userRoles] as const).map((r) => (
          <Button key={r} size="sm" variant={filter === r ? "default" : "outline"} onClick={() => setFilter(r)} className="capitalize">
            {r === "all" ? `All (${users.length})` : `${r}s (${users.filter((u) => u.role === r).length})`}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Classes / children</th>
                  <th className="p-3 font-medium">Last login</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {shown.map((u) => (
                  <tr key={u.id} className={`border-b border-border last:border-0 ${u.active ? "" : "opacity-50"}`} data-testid={`user-row-${u.username}`}>
                    <td className="p-3">
                      {u.role === "student" ? <Link href={`/students/${u.id}`} className="font-medium hover:underline">{fullName(u)}</Link> : <span className="font-medium">{fullName(u)}</span>}
                      <div className="text-xs text-muted-foreground">@{u.username}{u.active ? "" : " · deactivated"}</div>
                    </td>
                    <td className="p-3"><Badge variant="outline" className={`${roleTone[u.role]} border-0 capitalize`}>{u.role}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground max-w-64">
                      {u.role === "parent" ? u.childIds.map((id) => fullName(byId.get(id))).join(", ") || "No children linked" : u.classroomNames.join(", ") || "—"}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{relativeTime(u.lastLoginAt)}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => setDialog({ open: true, editing: u })} data-testid={`edit-user-${u.username}`}>Edit</Button>
                      {u.id !== me?.id && (
                        <Button size="icon" variant="ghost" title="Delete" onClick={() => confirm(`Delete ${fullName(u)}? This can't be undone.`) && remove.mutate(u.id)}>
                          <i className="fas fa-trash text-muted-foreground" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      <UserDialog open={dialog.open} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))} editing={dialog.editing} students={students} />
    </AppShell>
  );
}
