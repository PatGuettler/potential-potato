import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ActivityFeed, type ActivityItem, EmptyState, Loading, ProgressBar, StatCard } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/FormField";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export type ClassCard = {
  id: string;
  name: string;
  subject: string;
  joinCode: string;
  teacherName: string;
  studentCount: number;
  assignmentCount: number;
  completionRate: number | null;
};

type Overview = {
  classrooms: ClassCard[];
  studentCount: number;
  activeAssignments: number;
  pendingReviews: number;
  atRisk: { id: string; name: string; summary: { assignmentsOverdue: number } }[];
  activity: ActivityItem[];
};

export function CreateClassButton() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const create = useMutation({
    mutationFn: () => apiRequest("POST", "/api/teacher/classrooms", { name, subject }),
    onSuccess: () => {
      toast({ title: "Class created", description: "Share the class code with students so they can join." });
      setOpen(false);
      setName("");
      setSubject("");
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teacher/classrooms"] });
    },
    onError: (e: Error) => toast({ title: "Couldn't create class", description: e.message, variant: "destructive" }),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" data-testid="create-classroom-button">
          <i className="fas fa-plus mr-2" />New class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a class</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <FormField id="class-name" label="Class name" value={name} onChange={setName} placeholder="Period 3 · Earth Science" required />
          <FormField id="class-subject" label="Subject" value={subject} onChange={setSubject} placeholder="Science" />
          <DialogFooter>
            <Button type="submit" disabled={create.isPending}>Create class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ClassGrid({ classes }: { classes: ClassCard[] }) {
  if (classes.length === 0) {
    return (
      <Card>
        <EmptyState icon="fas fa-chalkboard" title="No classes yet">Create a class, then add students or share its join code.</EmptyState>
      </Card>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {classes.map((c) => (
        <Link key={c.id} href={`/classes/${c.id}`} className="block" data-testid={`classroom-${c.id}`}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-3">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">
                  {c.subject || "General"} · {c.teacherName} · code <span className="font-mono">{c.joinCode}</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span><i className="fas fa-user-graduate text-muted-foreground mr-1.5" />{c.studentCount} students</span>
                <span><i className="fas fa-tasks text-muted-foreground mr-1.5" />{c.assignmentCount} assignments</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Assignment completion</span>
                  <span>{c.completionRate === null ? "—" : `${c.completionRate}%`}</span>
                </div>
                <ProgressBar value={c.completionRate ?? 0} />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function TeacherHome() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery<Overview>({ queryKey: ["/api/teacher/overview"] });

  return (
    <AppShell title={`Good to see you, ${user?.firstName || user?.username}`} subtitle="Your classes at a glance" actions={<CreateClassButton />}>
      {isLoading || !data ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Classes" value={data.classrooms.length} icon="fas fa-chalkboard" />
            <StatCard label="Students" value={data.studentCount} icon="fas fa-user-graduate" tone="text-violet-600" />
            <StatCard label="Open assignments" value={data.activeAssignments} icon="fas fa-tasks" tone="text-orange-500" />
            <Link href="/reviews" className="block">
              <StatCard label="Waiting for review" value={data.pendingReviews} hint="Written responses" icon="fas fa-inbox" tone="text-rose-600" />
            </Link>
          </div>

          <section>
            <h2 className="font-semibold mb-3">My classes</h2>
            <ClassGrid classes={data.classrooms} />
          </section>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Needs attention</CardTitle>
              </CardHeader>
              <CardContent>
                {data.atRisk.length === 0 ? (
                  <EmptyState icon="fas fa-thumbs-up" title="Everyone's on track">No overdue work right now.</EmptyState>
                ) : (
                  <ul className="divide-y divide-border">
                    {data.atRisk.map((s) => (
                      <li key={s.id}>
                        <Link href={`/students/${s.id}`} className="flex items-center justify-between py-2.5 hover:bg-muted/50 -mx-2 px-2 rounded-md">
                          <span className="font-medium text-sm">{s.name}</span>
                          <span className="text-xs text-red-600">{s.summary.assignmentsOverdue} overdue</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            <ActivityFeed items={data.activity} />
          </div>
        </>
      )}
    </AppShell>
  );
}
