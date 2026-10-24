import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { EmptyState, Loading } from "@/components/widgets";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecordStudents } from "@/lib/family";

/** Shared frame for attendance, transcript, and portfolio pages: picks which child or student to show. */
export function RecordsLayout({
  kind,
  title,
  studentId,
  actions,
  children,
}: {
  kind: "attendance" | "transcript" | "portfolio";
  title: string;
  studentId?: string;
  actions?: ReactNode;
  children: (studentId: string) => ReactNode;
}) {
  const [, navigate] = useLocation();
  const { students, isLoading } = useRecordStudents();
  const current = studentId ?? students[0]?.id;

  useEffect(() => {
    if (!studentId && students[0]) navigate(`/records/${kind}/${students[0].id}`, { replace: true });
  }, [studentId, students[0]?.id]);

  const picker = students.length > 1 && (
    <Select value={current} onValueChange={(id) => navigate(`/records/${kind}/${id}`)}>
      <SelectTrigger className="w-48 print:hidden" data-testid="record-student"><SelectValue /></SelectTrigger>
      <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
    </Select>
  );

  return (
    <AppShell title={title} actions={<>{picker}{actions}</>}>
      {isLoading ? (
        <Loading />
      ) : !current ? (
        <Card><EmptyState icon="fas fa-child" title="No students yet">Add a child on the My family page to start keeping records.</EmptyState></Card>
      ) : (
        children(current)
      )}
    </AppShell>
  );
}
