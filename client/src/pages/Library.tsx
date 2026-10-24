import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { CategoryIcon, Loading } from "@/components/widgets";
import type { LessonSummary } from "@/components/LessonCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Category } from "@shared/core/types";

export default function Library() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { data: lessons = [], isLoading } = useQuery<(LessonSummary & { authorId: string })[]>({ queryKey: ["/api/lessons"] });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });

  const archive = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/lessons/${id}`),
    onSuccess: () => {
      toast({ title: "Lesson archived", description: "Students' past progress on it is kept." });
      queryClient.invalidateQueries();
    },
    onError: (e: Error) => toast({ title: "Couldn't archive", description: e.message, variant: "destructive" }),
  });

  const shown = lessons.filter(
    (l) => (category === "all" || l.categoryId === category) && `${l.title} ${l.description}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppShell
      title="All lessons"
      subtitle={`${lessons.length} lessons in the library`}
      actions={<Link href="/lesson-creation"><Button size="sm"><i className="fas fa-plus mr-2" />New lesson</Button></Link>}
    >
      <div className="flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search lessons" value={search} onChange={(e) => setSearch(e.target.value)} />
        {[{ id: "all", name: "All" }, ...categories].map((c) => (
          <Button key={c.id} size="sm" variant={category === c.id ? "default" : "outline"} onClick={() => setCategory(c.id)}>{c.name}</Button>
        ))}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {shown.map((l) => {
                const canEdit = user?.role === "admin" || l.authorId === user?.id;
                return (
                  <li key={l.id} className="flex flex-wrap items-center gap-3 p-4">
                    <CategoryIcon categoryId={l.categoryId} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/lesson/${l.id}`} className="font-medium hover:underline">{l.title}</Link>
                      <div className="text-xs text-muted-foreground capitalize">
                        {l.difficulty} · {l.estimatedDuration} min · {l.questionCount} questions
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/lesson/${l.id}`}><Button size="sm" variant="ghost">Preview</Button></Link>
                      {canEdit && <Link href={`/lesson-edit/${l.id}`}><Button size="sm" variant="ghost" data-testid={`edit-lesson-${l.id}`}>Edit</Button></Link>}
                      {canEdit && (
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => confirm(`Archive “${l.title}”?`) && archive.mutate(l.id)}>
                          Archive
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
