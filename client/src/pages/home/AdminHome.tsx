import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ActivityFeed, type ActivityItem, Loading, StatCard } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { downloadFile } from "@/lib/format";
import { ClassGrid, CreateClassButton, type ClassCard } from "./TeacherHome";

type Stats = {
  organizationName: string;
  users: Record<string, number>;
  lessons: number;
  classrooms: number;
  assignments: number;
  completionsThisWeek: number;
  activeStudentsThisWeek: number;
  pendingReviews: number;
  activity: ActivityItem[];
};

export default function AdminHome() {
  const { toast } = useToast();
  const { data: stats } = useQuery<Stats>({ queryKey: ["/api/admin/stats"] });
  const { data: classes = [] } = useQuery<ClassCard[]>({ queryKey: ["/api/teacher/classrooms"] });
  const [orgName, setOrgName] = useState("");
  useEffect(() => setOrgName(stats?.organizationName ?? ""), [stats?.organizationName]);

  const saveOrg = useMutation({
    mutationFn: () => apiRequest("PATCH", "/api/admin/settings", { organizationName: orgName }),
    onSuccess: () => {
      toast({ title: "Saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/org"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (e: Error) => toast({ title: "Couldn't save", description: e.message, variant: "destructive" }),
  });

  const exportData = async () => {
    try {
      const data = await apiRequest("GET", "/api/admin/export");
      downloadFile(`stem-academy-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2));
    } catch (e) {
      toast({ title: "Export failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (!stats) return <AppShell title="Administration"><Loading /></AppShell>;
  const totalUsers = Object.values(stats.users).reduce((a, b) => a + b, 0);

  return (
    <AppShell
      title="Administration"
      subtitle={stats.organizationName}
      actions={
        <Link href="/admin/users">
          <Button size="sm" data-testid="manage-users">
            <i className="fas fa-users-cog mr-2" />Manage users
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="People"
          value={totalUsers}
          hint={`${stats.users.student ?? 0} students · ${stats.users.teacher ?? 0} teachers · ${stats.users.parent ?? 0} parents`}
          icon="fas fa-users"
        />
        <StatCard label="Active students (7 days)" value={stats.activeStudentsThisWeek} icon="fas fa-bolt" tone="text-amber-500" />
        <StatCard label="Lessons completed (7 days)" value={stats.completionsThisWeek} icon="fas fa-check-circle" tone="text-green-600" />
        <StatCard label="Lessons in library" value={stats.lessons} hint={`${stats.pendingReviews} responses awaiting review`} icon="fas fa-book" tone="text-violet-600" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">All classes ({stats.classrooms})</h2>
          <CreateClassButton />
        </div>
        <ClassGrid classes={classes} />
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <ActivityFeed items={stats.activity} title="Activity across the school" />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Settings & data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                saveOrg.mutate();
              }}
            >
              <label className="text-sm font-medium" htmlFor="org-name">Organization name</label>
              <div className="flex gap-2">
                <Input id="org-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                <Button type="submit" variant="outline" disabled={saveOrg.isPending}>Save</Button>
              </div>
            </form>
            <div className="space-y-2">
              <div className="text-sm font-medium">Backup</div>
              <p className="text-sm text-muted-foreground">Download every user, class, assignment, grade and note as JSON. Passwords are not included.</p>
              <Button variant="outline" onClick={exportData} data-testid="backup-data">
                <i className="fas fa-download mr-2" />Download backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
