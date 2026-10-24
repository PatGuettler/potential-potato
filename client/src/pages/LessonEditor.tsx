import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { QuizBuilder } from "@/components/QuizBuilder";
import { Markdown } from "@/components/Markdown";
import { Loading } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { parseStructuredContent } from "@shared/core/lessons";
import type { Category, Lesson, LessonQuestion, LessonSection } from "@shared/core/types";

type Form = {
  title: string;
  description: string;
  content: string;
  categoryId: string;
  difficulty: string;
  estimatedDuration: string;
  answer: string;
  answerGuide: string;
};

const empty: Form = { title: "", description: "", content: "", categoryId: "", difficulty: "easy", estimatedDuration: "30", answer: "", answerGuide: "" };
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export default function LessonEditor() {
  const { id } = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState<Form>(empty);
  const [sections, setSections] = useState<LessonSection[]>([]);
  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const { data: existing, isLoading } = useQuery<Lesson>({ queryKey: ["/api/lessons", id], enabled: !!id });

  useEffect(() => {
    if (!existing) return;
    const structured = parseStructuredContent(existing.content);
    setForm({
      title: existing.title,
      description: existing.description ?? "",
      content: structured ? "" : existing.content ?? "",
      categoryId: existing.categoryId,
      difficulty: existing.difficulty,
      estimatedDuration: String(existing.estimatedDuration ?? 30),
      answer: existing.answer ?? "",
      answerGuide: existing.answerGuide ?? "",
    });
    setSections([...(structured?.sections ?? []), ...(existing.quiz?.sections ?? [])]);
  }, [existing]);

  const save = useMutation({
    mutationFn: () => {
      const body = {
        ...form,
        estimatedDuration: Number(form.estimatedDuration) || 30,
        quiz: sections.length
          ? { sections: sections.map((s) => ({ ...s, questions: s.questions.map((q) => ({ ...q, options: q.type === "choice" ? (q.options ?? []).map((o) => o.trim()).filter(Boolean) : undefined })) })) }
          : null,
      };
      return id ? apiRequest<Lesson>("PUT", `/api/lessons/${id}`, body) : apiRequest<Lesson>("POST", "/api/lessons", body);
    },
    onSuccess: (lesson) => {
      toast({ title: id ? "Lesson saved" : "Lesson created" });
      queryClient.invalidateQueries();
      navigate(`/lesson/${lesson.id}`);
    },
    onError: (e: Error) => toast({ title: "Couldn't save lesson", description: e.message, variant: "destructive" }),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.categoryId) {
      toast({ title: "Missing details", description: "A lesson needs a title and a category.", variant: "destructive" });
      return;
    }
    const bad = sections.find((s) => !s.title.trim() || s.questions.some((q) => !q.prompt.trim() || !q.expectedAnswer.trim()));
    if (bad) {
      toast({ title: "Quiz incomplete", description: "Every section needs a title and every question needs a prompt and an answer.", variant: "destructive" });
      return;
    }
    const badChoice = sections.flatMap((s) => s.questions).find((q) => q.type === "choice" && !(q.options ?? []).map((o) => o.trim()).includes(q.expectedAnswer.trim()));
    if (badChoice) {
      toast({ title: "Check your choices", description: `The correct answer for “${badChoice.prompt}” must match one of its choices exactly.`, variant: "destructive" });
      return;
    }
    save.mutate();
  };

  const updateSection = (sid: string, field: "title" | "description", value: string) =>
    setSections((all) => all.map((s) => (s.id === sid ? { ...s, [field]: value } : s)));
  const updateQuestion = (sid: string, qid: string, field: keyof LessonQuestion, value: any) =>
    setSections((all) => all.map((s) => (s.id === sid ? { ...s, questions: s.questions.map((q) => (q.id === qid ? { ...q, [field]: value } : q)) } : s)));

  if (id && isLoading) return <AppShell title="Edit lesson"><Loading /></AppShell>;

  return (
    <AppShell title={id ? `Edit: ${existing?.title ?? ""}` : "Create a lesson"} subtitle="Reading material, an auto-graded quiz, and an optional written response">
      <form onSubmit={submit} className="space-y-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => set("title")(e.target.value)} required data-testid="input-title" />
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={form.categoryId} onValueChange={set("categoryId")}>
                <SelectTrigger data-testid="select-category"><SelectValue placeholder="Choose a category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={set("difficulty")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="duration">Minutes</Label>
                <Input id="duration" type="number" min={1} value={form.estimatedDuration} onChange={(e) => set("estimatedDuration")(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description">Summary</Label>
              <Input id="description" value={form.description} onChange={(e) => set("description")(e.target.value)} placeholder="One sentence students see on the lesson card" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Reading material</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea value={form.content} onChange={(e) => set("content")(e.target.value)} rows={12} placeholder={"Use **bold**, lists (- item, 1. item) and # headings."} data-testid="textarea-content" />
              </TabsContent>
              <TabsContent value="preview">
                <div className="rounded-md border border-border p-4 min-h-40">
                  {form.content ? <Markdown source={form.content} /> : <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <QuizBuilder
              lessonSections={sections}
              addSection={() => setSections((all) => [...all, { id: uid("section"), title: "Check your understanding", description: "", questions: [] }])}
              removeSection={(sid) => setSections((all) => all.filter((s) => s.id !== sid))}
              updateSection={updateSection}
              addQuestion={(sid) =>
                setSections((all) => all.map((s) => (s.id === sid ? { ...s, questions: [...s.questions, { id: uid("q"), prompt: "", type: "choice", expectedAnswer: "", options: [], caseSensitive: false }] } : s)))
              }
              removeQuestion={(sid, qid) => setSections((all) => all.map((s) => (s.id === sid ? { ...s, questions: s.questions.filter((q) => q.id !== qid) } : s)))}
              updateQuestion={updateQuestion as any}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Written response & teacher notes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="answer">Rubric for a written response (optional)</Label>
              <Textarea id="answer" value={form.answer} onChange={(e) => set("answer")(e.target.value)} rows={4} placeholder="If filled in, students write a response that lands in your review queue. Students never see this text." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guide">Teacher guide (optional)</Label>
              <Textarea id="guide" value={form.answerGuide} onChange={(e) => set("answerGuide")(e.target.value)} rows={4} placeholder="Background, common misconceptions, lab ideas. Visible to teachers only." />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={save.isPending} data-testid="button-save-lesson">{save.isPending ? "Saving…" : id ? "Save changes" : "Create lesson"}</Button>
          <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancel</Button>
        </div>
      </form>
    </AppShell>
  );
}
