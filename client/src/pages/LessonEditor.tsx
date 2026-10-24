import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { QuizBuilder, questionIssues } from "@/components/QuizBuilder";
import { Markdown } from "@/components/Markdown";
import { GRADES } from "@/components/CourseDialog";
import { Loading } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { parseStructuredContent } from "@shared/core/lessons";
import type { Category, Course, Lesson, LessonSection, VocabularyTerm } from "@shared/core/types";

const YOUR_TURN = "\n\n## Your turn\n";
const READING_TEMPLATE = `Start with a hook: a question or everyday example that makes students curious.

## Key ideas
- First big idea, in one sentence
- Second big idea
- Third big idea

## Worked example
**Problem:** state a problem students will meet.
1. First step, with the reasoning
2. Second step
3. Answer, with units

## Common mistakes
> Describe a misconception and why it's wrong.

## Summary
Two or three sentences tying the ideas together.`;

type Form = {
  title: string;
  description: string;
  content: string;
  writtenPrompt: string;
  categoryId: string;
  difficulty: string;
  estimatedDuration: string;
  gradeLevel: string;
  courseId: string;
  unitId: string;
  answer: string;
  answerGuide: string;
};

const empty: Form = { title: "", description: "", content: "", writtenPrompt: "", categoryId: "", difficulty: "medium", estimatedDuration: "30", gradeLevel: "", courseId: "", unitId: "", answer: "", answerGuide: "" };

function ListEditor({ items, onChange, placeholder, testId }: { items: string[]; onChange: (v: string[]) => void; placeholder: string; testId?: string }) {
  return (
    <div className="space-y-1.5">
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input value={v} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} placeholder={placeholder} data-testid={testId ? `${testId}-${i}` : undefined} />
          <Button type="button" size="icon" variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))} title="Remove"><i className="fas fa-times text-muted-foreground" /></Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="ghost" onClick={() => onChange([...items, ""])} data-testid={testId ? `${testId}-add` : undefined}><i className="fas fa-plus mr-1.5" />Add</Button>
    </div>
  );
}

function Check({ ok, children, optional }: { ok: boolean; children: React.ReactNode; optional?: boolean }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <i className={`mt-0.5 ${ok ? "fas fa-check-circle text-green-600" : optional ? "far fa-circle text-muted-foreground" : "fas fa-circle-exclamation text-amber-500"}`} />
      <span className={ok ? "" : "text-muted-foreground"}>{children}</span>
    </li>
  );
}

export default function LessonEditor() {
  const params = useParams<{ id?: string; courseId?: string; unitId?: string }>();
  const id = params.id;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState<Form>(() => ({ ...empty, courseId: params.courseId ?? "", unitId: params.unitId ?? "" }));
  const [sections, setSections] = useState<LessonSection[]>([]);
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [vocab, setVocab] = useState<VocabularyTerm[]>([]);
  const [standards, setStandards] = useState<string>("");
  const [written, setWritten] = useState(false);
  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const { data: courses = [] } = useQuery<Course[]>({ queryKey: ["/api/courses"] });
  const { data: existing, isLoading } = useQuery<Lesson>({ queryKey: ["/api/lessons", id], enabled: !!id });
  const course = courses.find((c) => c.id === form.courseId);

  // Filing a lesson in a course fills in its subject and grade.
  useEffect(() => {
    if (!course) return;
    setForm((f) => ({ ...f, categoryId: f.categoryId || course.subject, gradeLevel: f.gradeLevel || String(course.gradeLevel), unitId: f.unitId && course.units.some((u) => u.id === f.unitId) ? f.unitId : course.units[0]?.id ?? "" }));
  }, [course?.id]);

  useEffect(() => {
    if (!existing) return;
    const structured = parseStructuredContent(existing.content);
    const raw = structured ? "" : existing.content ?? "";
    const [reading, prompt = ""] = raw.split(YOUR_TURN);
    setForm({
      title: existing.title,
      description: existing.description ?? "",
      content: reading,
      writtenPrompt: prompt,
      categoryId: existing.categoryId,
      difficulty: existing.difficulty,
      estimatedDuration: String(existing.estimatedDuration ?? 30),
      gradeLevel: existing.gradeLevel === undefined ? "" : String(existing.gradeLevel),
      courseId: existing.courseId ?? "",
      unitId: existing.unitId ?? "",
      answer: existing.answer ?? "",
      answerGuide: existing.answerGuide ?? "",
    });
    setWritten(!!existing.answer);
    setSections([...(structured?.sections ?? []), ...(existing.quiz?.sections ?? [])]);
    setObjectives(existing.objectives?.length ? existing.objectives : [""]);
    setVocab(existing.vocabulary ?? []);
    setStandards((existing.standards ?? []).join(", "));
  }, [existing]);

  const questions = sections.flatMap((s) => s.questions);
  const invalidQuestions = questions.filter((q) => questionIssues(q).length).length;
  const cleanObjectives = objectives.map((o) => o.trim()).filter(Boolean);
  const checklist = useMemo(
    () => ({
      details: !!form.title.trim() && !!form.categoryId,
      filed: !!form.courseId && !!form.unitId,
      objectives: cleanObjectives.length > 0,
      reading: form.content.trim().split(/\s+/).length >= 40,
      quiz: questions.length >= 3 && invalidQuestions === 0,
      explanations: questions.length > 0 && questions.every((q) => q.explanation),
    }),
    [form, cleanObjectives.length, questions, invalidQuestions],
  );

  const save = useMutation({
    mutationFn: () => {
      const content = written && form.writtenPrompt.trim() ? `${form.content.trim()}${YOUR_TURN}${form.writtenPrompt.trim()}` : form.content.trim();
      const body = {
        title: form.title,
        description: form.description,
        content,
        categoryId: form.categoryId,
        difficulty: form.difficulty,
        estimatedDuration: Number(form.estimatedDuration) || 30,
        gradeLevel: form.gradeLevel === "" ? null : Number(form.gradeLevel),
        courseId: form.courseId || null,
        unitId: form.unitId || null,
        objectives: cleanObjectives,
        vocabulary: vocab.filter((v) => v.term.trim()),
        standards: standards.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
        answer: written ? form.answer : "",
        answerGuide: form.answerGuide,
        quiz: sections.length
          ? { sections: sections.map((s) => ({ ...s, questions: s.questions.map((q) => ({ ...q, options: q.type === "choice" ? (q.options ?? []).map((o) => o.trim()).filter(Boolean) : q.options })) })) }
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
    if (!checklist.details) {
      toast({ title: "Missing details", description: "A lesson needs a title and a subject.", variant: "destructive" });
      return;
    }
    if (invalidQuestions) {
      toast({ title: `${invalidQuestions} question${invalidQuestions > 1 ? "s need" : " needs"} attention`, description: "Look for the amber notes in the quiz.", variant: "destructive" });
      return;
    }
    if (written && !form.answer.trim()) {
      toast({ title: "Add a rubric", description: "Written responses need a rubric so you can grade consistently.", variant: "destructive" });
      return;
    }
    save.mutate();
  };

  if (id && isLoading) return <AppShell title="Edit lesson"><Loading /></AppShell>;

  return (
    <AppShell title={id ? `Edit: ${existing?.title ?? ""}` : "New lesson"} subtitle={course ? `${course.title}${course.units.find((u) => u.id === form.unitId) ? ` · ${course.units.find((u) => u.id === form.unitId)!.title}` : ""}` : "Reading, quiz, and an optional written response"}>
      <form onSubmit={submit} className="grid xl:grid-cols-[1fr_280px] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">1. Details</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="title">Lesson title *</Label>
                <Input id="title" value={form.title} onChange={(e) => set("title")(e.target.value)} placeholder="e.g. Solving Two-Step Equations" required data-testid="input-title" />
              </div>
              <div className="space-y-1.5">
                <Label>Course</Label>
                <Select value={form.courseId || "none"} onValueChange={(v) => setForm((f) => ({ ...f, courseId: v === "none" ? "" : v, unitId: "" }))}>
                  <SelectTrigger data-testid="select-course"><SelectValue placeholder="Choose a course" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not in a course</SelectItem>
                    {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select value={form.unitId} onValueChange={set("unitId")} disabled={!course}>
                  <SelectTrigger data-testid="select-unit"><SelectValue placeholder={course ? "Choose a unit" : "Pick a course first"} /></SelectTrigger>
                  <SelectContent>{course?.units.map((u) => <SelectItem key={u.id} value={u.id}>{u.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Subject *</Label>
                  <Select value={form.categoryId} onValueChange={set("categoryId")}>
                    <SelectTrigger data-testid="select-category"><SelectValue placeholder="Subject" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Grade</Label>
                  <Select value={form.gradeLevel || "none"} onValueChange={(v) => set("gradeLevel")(v === "none" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Any</SelectItem>
                      {GRADES.map((g) => <SelectItem key={g.value} value={g.value}>{g.label === "K" ? "Kindergarten" : `Grade ${g.label}`}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
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
                <Input id="description" value={form.description} onChange={(e) => set("description")(e.target.value)} placeholder="One sentence students see in the course outline" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">2. Learning goals</CardTitle></CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Objectives: students will be able to…</Label>
                <ListEditor items={objectives} onChange={setObjectives} placeholder="Solve equations of the form px + q = r" testId="objective" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="standards">Standards</Label>
                  <Input id="standards" value={standards} onChange={(e) => setStandards(e.target.value)} placeholder="CCSS.MATH.CONTENT.7.EE.B.4.A, NGSS MS-PS1-2" />
                  <p className="text-xs text-muted-foreground">Separate with commas.</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Vocabulary</Label>
                  {vocab.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <Input className="w-36" value={v.term} onChange={(e) => setVocab((all) => all.map((x, j) => (j === i ? { ...x, term: e.target.value } : x)))} placeholder="Term" />
                      <Input value={v.definition} onChange={(e) => setVocab((all) => all.map((x, j) => (j === i ? { ...x, definition: e.target.value } : x)))} placeholder="Student-friendly definition" />
                      <Button type="button" size="icon" variant="ghost" onClick={() => setVocab((all) => all.filter((_, j) => j !== i))}><i className="fas fa-times text-muted-foreground" /></Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="ghost" onClick={() => setVocab((all) => [...all, { term: "", definition: "" }])}><i className="fas fa-plus mr-1.5" />Add term</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">3. Reading</CardTitle>
              {!form.content.trim() && <Button type="button" size="sm" variant="outline" onClick={() => set("content")(READING_TEMPLATE)} data-testid="use-template"><i className="fas fa-wand-magic-sparkles mr-1.5" />Start from a template</Button>}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="write">
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="space-y-2">
                  <Textarea value={form.content} onChange={(e) => set("content")(e.target.value)} rows={14} className="font-mono text-sm" placeholder="Explain the idea, show a worked example, and point out common mistakes." data-testid="textarea-content" />
                  <p className="text-xs text-muted-foreground">
                    Formatting: <code>## Heading</code> · <code>**bold**</code> · <code>- bullet</code> · <code>1. step</code> · <code>&gt; callout</code> · tables with <code>| a | b |</code>
                  </p>
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
            <CardHeader className="pb-2"><CardTitle className="text-base">4. Quiz</CardTitle></CardHeader>
            <CardContent>
              <QuizBuilder sections={sections} onChange={setSections} lessonId={id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">5. Written response</CardTitle>
              <label className="flex items-center gap-2 text-sm"><Switch checked={written} onCheckedChange={setWritten} data-testid="toggle-written" /> Include</label>
            </CardHeader>
            <CardContent className="space-y-4">
              {written ? (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="prompt">Prompt students see</Label>
                    <Textarea id="prompt" value={form.writtenPrompt} onChange={(e) => set("writtenPrompt")(e.target.value)} rows={2} placeholder="Explain, using evidence from the lesson, why…" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="answer">Rubric (teachers only)</Label>
                    <Textarea id="answer" value={form.answer} onChange={(e) => set("answer")(e.target.value)} rows={4} placeholder="What a complete answer includes. Shown next to each response in your review queue." />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Turn this on to ask an open-ended question. Responses land in your review queue, where you score them and leave feedback that students and parents can see.</p>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="guide">Teacher guide (optional)</Label>
                <Textarea id="guide" value={form.answerGuide} onChange={(e) => set("answerGuide")(e.target.value)} rows={3} placeholder="Background, misconceptions to watch for, lab or discussion ideas" />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="xl:sticky xl:top-4 space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Ready to teach?</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2" data-testid="readiness">
                <Check ok={checklist.details}>Title and subject</Check>
                <Check ok={checklist.filed} optional>Filed in a course and unit</Check>
                <Check ok={checklist.objectives}>At least one objective</Check>
                <Check ok={checklist.reading}>Reading of 40+ words</Check>
                <Check ok={checklist.quiz}>3+ quiz questions, all complete</Check>
                <Check ok={checklist.explanations} optional>Every question explains its answer</Check>
              </ul>
              <Button type="submit" className="w-full" disabled={save.isPending} data-testid="button-save-lesson">{save.isPending ? "Saving…" : id ? "Save changes" : "Create lesson"}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => window.history.back()}>Cancel</Button>
            </CardContent>
          </Card>
        </aside>
      </form>
    </AppShell>
  );
}
