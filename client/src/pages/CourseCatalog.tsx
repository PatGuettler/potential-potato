import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { CourseDialog, GRADES, SUBJECTS } from "@/components/CourseDialog";
import { EmptyState, Loading, ProgressBar } from "@/components/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { styleFor } from "@/lib/format";
import { gradeLabel, parseGrade, type Course } from "@shared/core/types";

export type CourseSummary = Course & { lessonCount: number; completedCount?: number };

const BANDS = [
  { name: "Elementary School", min: 0, max: 5 },
  { name: "Middle School", min: 6, max: 8 },
  { name: "High School", min: 9, max: 12 },
];

const covers = (c: Course, g: number) => c.gradeLevel <= g && g <= (c.gradeLevelMax ?? c.gradeLevel);

export function CourseCard({ c }: { c: CourseSummary }) {
  const s = styleFor(c.subject);
  return (
    <Link href={`/courses/${c.id}`} className="block" data-testid={`course-${c.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex flex-col h-full gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0`}>
              <i className={`${s.icon} text-white`} />
            </div>
            <div className="min-w-0">
              <div className="font-semibold leading-snug">{c.title}</div>
              <div className="text-xs text-muted-foreground">{gradeLabel(c.gradeLevel, c.gradeLevelMax)}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground flex-1">{c.description}</p>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <Badge variant="outline">{c.units.length} units</Badge>
            <Badge variant="outline">{c.lessonCount} lessons</Badge>
          </div>
          {c.completedCount !== undefined && c.lessonCount > 0 && (
            <div>
              <ProgressBar value={(c.completedCount / c.lessonCount) * 100} />
              <div className="text-xs text-muted-foreground mt-1">{c.completedCount} of {c.lessonCount} done</div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function CourseCatalog() {
  const { user } = useAuth();
  const staff = user?.role === "teacher" || user?.role === "admin";
  const myGrade = user?.role === "student" ? parseGrade(user.gradeLevel) : undefined;
  const [grade, setGrade] = useState<string>(myGrade !== undefined ? String(myGrade) : "all");
  const [subject, setSubject] = useState("all");
  const [creating, setCreating] = useState(false);
  const { data: courses = [], isLoading } = useQuery<CourseSummary[]>({ queryKey: ["/api/courses"] });

  const shown = courses.filter((c) => (grade === "all" || covers(c, Number(grade))) && (subject === "all" || c.subject === subject));

  return (
    <AppShell
      title="Course catalog"
      subtitle={`${courses.length} courses from Kindergarten through Grade 12`}
      actions={staff && <Button size="sm" onClick={() => setCreating(true)} data-testid="new-course"><i className="fas fa-plus mr-2" />New course</Button>}
    >
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by grade">
          <Button size="sm" variant={grade === "all" ? "default" : "outline"} onClick={() => setGrade("all")}>All grades</Button>
          {GRADES.map((g) => (
            <Button key={g.value} size="sm" variant={grade === g.value ? "default" : "outline"} onClick={() => setGrade(g.value)} className="w-10 px-0" data-testid={`grade-${g.label}`}>
              {g.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by subject">
          {[{ id: "all", name: "All subjects" }, ...SUBJECTS].map((s) => (
            <Button key={s.id} size="sm" variant={subject === s.id ? "secondary" : "ghost"} onClick={() => setSubject(s.id)}>{s.name}</Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : shown.length === 0 ? (
        <Card><EmptyState icon="fas fa-book" title="No courses match">Try another grade or subject.</EmptyState></Card>
      ) : (
        BANDS.map((band) => {
          const inBand = shown.filter((c) => c.gradeLevel >= band.min && c.gradeLevel <= band.max);
          if (!inBand.length) return null;
          return (
            <section key={band.name}>
              <h2 className="font-semibold mb-3">{band.name}</h2>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {inBand.map((c) => <CourseCard key={c.id} c={c} />)}
              </div>
            </section>
          );
        })
      )}
      {creating && <CourseDialog open={creating} onOpenChange={setCreating} />}
    </AppShell>
  );
}
