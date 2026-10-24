import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { FamilySettings, PublicUser } from "@shared/core/types";

export type ChildSummary = PublicUser & {
  summary: {
    lessonsCompleted: number;
    averageScore: number | null;
    minutesSpent: number;
    assignmentsTotal: number;
    assignmentsDone: number;
    assignmentsOverdue: number;
    pendingReviews: number;
    lastActive: string | null;
  };
  courses: { id: string; title: string; subject: string; lessonCount: number; completedCount: number }[];
};

export type Family = {
  settings: FamilySettings;
  parents: { id: string; name: string; username: string; email: string }[];
  familyClassId: string | null;
  children: ChildSummary[];
};

export function useFamily() {
  const { user } = useAuth();
  return useQuery<Family>({ queryKey: ["/api/family"], enabled: user?.role === "parent" || user?.role === "admin" });
}

/** Students the signed-in adult keeps records for: a parent's children, or a teacher's/admin's students. */
export function useRecordStudents() {
  const { user } = useAuth();
  const isParent = user?.role === "parent";
  const family = useFamily();
  const staff = useQuery<{ id: string; name: string; username: string; gradeLevel?: string }[]>({ queryKey: ["/api/teacher/students"], enabled: !isParent && !!user && user.role !== "student" });
  if (isParent) {
    return { students: (family.data?.children ?? []).map((c) => ({ id: c.id, name: `${c.firstName} ${c.lastName}`.trim(), gradeLevel: c.gradeLevel })), isLoading: family.isLoading };
  }
  return { students: (staff.data ?? []).map((s) => ({ id: s.id, name: s.name, gradeLevel: s.gradeLevel })), isLoading: staff.isLoading };
}

export const subjectLabel = (s: string) =>
  ({ mathematics: "Math", science: "Science", technology: "Technology", engineering: "Engineering" })[s] ?? s;

export const RECORD_SUBJECTS = ["mathematics", "science", "technology", "engineering", "Reading", "Writing", "History", "Geography", "Foreign language", "Art", "Music", "Physical education", "Field trip", "Life skills"];
