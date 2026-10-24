import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { LessonCard, type LessonSummary } from "@/components/LessonCard";
import { EmptyState, Loading } from "@/components/widgets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import type { Category, Progress } from "@shared/core/types";

export default function CategoryView() {
  const { category } = useParams<{ category: string }>();
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState("all");

  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const { data: lessons = [], isLoading } = useQuery<LessonSummary[]>({ queryKey: ["/api/lessons/category", category] });
  const { data: progress = [] } = useQuery<Progress[]>({ queryKey: ["/api/progress/category", category], enabled: user?.role === "student" });

  const info = categories.find((c) => c.id === category);
  const shown = lessons.filter((l) => difficulty === "all" || l.difficulty === difficulty);
  const done = progress.filter((p) => p.isCompleted).length;

  return (
    <AppShell
      title={info?.name ?? "Lessons"}
      subtitle={user?.role === "student" ? `${done} of ${lessons.length} completed · ${info?.description ?? ""}` : info?.description}
    >
      <div className="flex flex-wrap gap-2">
        {["all", "easy", "medium", "hard"].map((d) => (
          <Button key={d} size="sm" variant={difficulty === d ? "default" : "outline"} onClick={() => setDifficulty(d)} className="capitalize" data-testid={`filter-${d}`}>
            {d === "all" ? `All (${lessons.length})` : `${d} (${lessons.filter((l) => l.difficulty === d).length})`}
          </Button>
        ))}
      </div>
      {isLoading ? (
        <Loading />
      ) : shown.length === 0 ? (
        <Card><EmptyState icon="fas fa-book" title="No lessons here yet" /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {shown.map((l) => {
            const p = progress.find((x) => x.lessonId === l.id);
            return <LessonCard key={l.id} lesson={l} status={user?.role === "student" ? p?.status ?? "not_started" : undefined} score={p?.score} />;
          })}
        </div>
      )}
    </AppShell>
  );
}
