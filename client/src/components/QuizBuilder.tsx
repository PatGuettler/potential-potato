import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { gradeQuestion } from "@shared/core/grading";
import { parseQuizText } from "@shared/core/quizText";
import { parseStructuredContent } from "@shared/core/lessons";
import type { Lesson, LessonQuestion, LessonSection, QuestionType } from "@shared/core/types";

const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const QUESTION_TYPES: { type: QuestionType; label: string; icon: string; help: string }[] = [
  { type: "choice", label: "Multiple choice", icon: "fas fa-list-ul", help: "Students pick one answer. Click the circle next to the correct choice." },
  { type: "truefalse", label: "True / False", icon: "fas fa-toggle-on", help: "Students pick True or False." },
  { type: "number", label: "Number", icon: "fas fa-hashtag", help: "Students type a number. Fractions like 3/4 and commas are accepted." },
  { type: "text", label: "Short answer", icon: "fas fa-font", help: "Students type a word or phrase. Add every spelling you'll accept." },
  { type: "code", label: "Code", icon: "fas fa-code", help: "Students write code; whitespace is ignored when checking." },
];

export function blankQuestion(type: QuestionType): LessonQuestion {
  const base = { id: uid("q"), prompt: "", type, expectedAnswer: "" } as LessonQuestion;
  if (type === "choice") return { ...base, options: ["", "", "", ""] };
  if (type === "truefalse") return { ...base, options: ["True", "False"], expectedAnswer: "True" };
  if (type === "text") return { ...base, acceptedAnswers: [] };
  return base;
}

/** What still needs fixing before a question can be saved. */
export function questionIssues(q: LessonQuestion): string[] {
  const issues: string[] = [];
  if (!q.prompt.trim()) issues.push("Write the question.");
  if (q.type === "choice") {
    const opts = (q.options ?? []).map((o) => o.trim()).filter(Boolean);
    if (opts.length < 2) issues.push("Add at least two choices.");
    if (new Set(opts).size !== opts.length) issues.push("Two choices are identical.");
    if (!q.expectedAnswer.trim() || !opts.includes(q.expectedAnswer.trim())) issues.push("Mark the correct choice.");
  } else if (q.type === "number") {
    if (!q.expectedAnswer.trim()) issues.push("Enter the correct number.");
    else if (!gradeQuestion(q, q.expectedAnswer).isCorrect) issues.push("The answer isn't a number.");
  } else if (!q.expectedAnswer.trim()) {
    issues.push("Enter the correct answer.");
  }
  return issues;
}

function TypePicker({ value, onChange }: { value: QuestionType; onChange: (t: QuestionType) => void }) {
  return (
    <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Question type">
      {QUESTION_TYPES.map((t) => (
        <button
          key={t.type}
          type="button"
          role="radio"
          aria-checked={value === t.type}
          onClick={() => onChange(t.type)}
          className={`text-xs rounded-md border px-2.5 py-1.5 transition-colors ${value === t.type ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:bg-muted"}`}
          data-testid={`type-${t.type}`}
        >
          <i className={`${t.icon} mr-1.5`} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** A live, gradable preview of exactly what students will see. */
function StudentPreview({ q }: { q: LessonQuestion }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ isCorrect: boolean } | null>(null);
  const check = (a: string) => {
    setAnswer(a);
    setResult(gradeQuestion(q, a));
  };
  return (
    <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-3 space-y-2">
      <div className="text-xs font-medium text-primary"><i className="fas fa-eye mr-1" />Student preview: try answering</div>
      <p className="text-sm font-medium">{q.prompt || <span className="text-muted-foreground">Your question appears here</span>}</p>
      {q.type === "choice" || q.type === "truefalse" ? (
        <div className="grid sm:grid-cols-2 gap-1.5">
          {(q.options ?? []).filter((o) => o.trim()).map((o) => (
            <button key={o} type="button" onClick={() => check(o)} className={`text-left text-sm rounded border px-2.5 py-1.5 bg-background ${answer === o && result ? (result.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-red-400 bg-red-50 dark:bg-red-950") : "border-border"}`}>
              {o}
            </button>
          ))}
        </div>
      ) : (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); check(answer); }}>
          <Input value={answer} onChange={(e) => setAnswer(e.target.value)} className="bg-background" placeholder={q.type === "number" ? "Enter a number" : "Type an answer"} />
          <Button type="submit" size="sm" variant="outline">Check</Button>
        </form>
      )}
      {result && (
        <div className={`text-sm ${result.isCorrect ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {result.isCorrect ? "✓ Correct" : "✗ Not quite"}
          {!result.isCorrect && q.hint && <span className="text-muted-foreground"> · Hint: {q.hint}</span>}
          {result.isCorrect && q.explanation && <span className="text-muted-foreground"> · {q.explanation}</span>}
        </div>
      )}
    </div>
  );
}

function QuestionEditor({
  q,
  number,
  onChange,
  onRemove,
  onDuplicate,
  onMove,
  canMoveUp,
  canMoveDown,
}: {
  q: LessonQuestion;
  number: number;
  onChange: (q: LessonQuestion) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMove: (dir: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [preview, setPreview] = useState(false);
  const [showFeedback, setShowFeedback] = useState(!!(q.hint || q.explanation));
  const issues = questionIssues(q);
  const set = (patch: Partial<LessonQuestion>) => onChange({ ...q, ...patch });
  const typeInfo = QUESTION_TYPES.find((t) => t.type === q.type)!;

  const changeType = (type: QuestionType) => {
    if (type === q.type) return;
    const fresh = blankQuestion(type);
    // Keep the prompt and feedback; keep choices when switching between choice-like types.
    onChange({ ...fresh, id: q.id, prompt: q.prompt, hint: q.hint, explanation: q.explanation, ...(type === "choice" && q.type === "truefalse" ? { options: ["True", "False", "", ""] } : {}) });
  };

  const options = q.options ?? [];
  const setOption = (i: number, text: string) => {
    const next = options.map((o, j) => (j === i ? text : o));
    set({ options: next, expectedAnswer: options[i] === q.expectedAnswer && q.expectedAnswer ? text : q.expectedAnswer });
  };

  return (
    <Card className={`p-0 ${issues.length ? "border-amber-300 dark:border-amber-800" : ""}`} data-testid={`question-editor-${number}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Q{number}</Badge>
          <TypePicker value={q.type} onChange={changeType} />
          <div className="ml-auto flex items-center gap-0.5">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => setPreview((p) => !p)} title="Preview as a student" aria-pressed={preview}>
              <i className={`fas fa-eye ${preview ? "text-primary" : "text-muted-foreground"}`} />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => onMove(-1)} disabled={!canMoveUp} title="Move up"><i className="fas fa-arrow-up text-muted-foreground" /></Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => onMove(1)} disabled={!canMoveDown} title="Move down"><i className="fas fa-arrow-down text-muted-foreground" /></Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={onDuplicate} title="Duplicate"><i className="fas fa-clone text-muted-foreground" /></Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={onRemove} title="Delete question"><i className="fas fa-trash text-muted-foreground" /></Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Textarea value={q.prompt} onChange={(e) => set({ prompt: e.target.value })} rows={2} placeholder="Type the question students will answer" data-testid={`prompt-${number}`} />
          <p className="text-xs text-muted-foreground">{typeInfo.help}</p>
        </div>

        {q.type === "choice" && (
          <div className="space-y-1.5" role="radiogroup" aria-label="Choices">
            {options.map((o, i) => {
              const correct = !!o.trim() && o === q.expectedAnswer;
              return (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={correct}
                    title={correct ? "Correct answer" : "Mark as correct"}
                    onClick={() => o.trim() && set({ expectedAnswer: o })}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${correct ? "border-green-600 bg-green-600 text-white" : "border-muted-foreground/40 hover:border-green-600"}`}
                    data-testid={`mark-correct-${number}-${i}`}
                  >
                    {correct && <i className="fas fa-check text-[10px]" />}
                  </button>
                  <Input value={o} onChange={(e) => setOption(i, e.target.value)} placeholder={`Choice ${String.fromCharCode(65 + i)}`} className={correct ? "border-green-500" : ""} data-testid={`choice-${number}-${i}`} />
                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8" disabled={options.length <= 2} onClick={() => set({ options: options.filter((_, j) => j !== i), expectedAnswer: correct ? "" : q.expectedAnswer })} title="Remove choice">
                    <i className="fas fa-times text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
            {options.length < 6 && (
              <Button type="button" size="sm" variant="ghost" onClick={() => set({ options: [...options, ""] })}><i className="fas fa-plus mr-1.5" />Add choice</Button>
            )}
          </div>
        )}

        {q.type === "truefalse" && (
          <div className="flex gap-2" role="radiogroup" aria-label="Correct answer">
            {["True", "False"].map((v) => (
              <button key={v} type="button" role="radio" aria-checked={q.expectedAnswer === v} onClick={() => set({ expectedAnswer: v })} className={`flex-1 rounded-md border px-3 py-2 text-sm ${q.expectedAnswer === v ? "border-green-600 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 font-medium" : "border-border hover:bg-muted"}`}>
                {q.expectedAnswer === v && <i className="fas fa-check mr-1.5" />}{v}
              </button>
            ))}
          </div>
        )}

        {q.type === "number" && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Correct answer</Label>
              <Input value={q.expectedAnswer} onChange={(e) => set({ expectedAnswer: e.target.value })} placeholder="e.g. 42, 3.14 or 3/4" data-testid={`number-answer-${number}`} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Also accept answers within ± (optional)</Label>
              <Input type="number" step="any" min="0" value={q.tolerance ?? ""} onChange={(e) => set({ tolerance: e.target.value === "" ? undefined : Number(e.target.value) })} placeholder="e.g. 0.05 for rounding" />
            </div>
          </div>
        )}

        {q.type === "text" && (
          <div className="space-y-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Correct answer</Label>
              <Input value={q.expectedAnswer} onChange={(e) => set({ expectedAnswer: e.target.value })} placeholder="e.g. photosynthesis" data-testid={`text-answer-${number}`} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Also accept</Label>
              <div className="flex flex-wrap gap-1.5">
                {(q.acceptedAnswers ?? []).map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                    {a}
                    <button type="button" onClick={() => set({ acceptedAnswers: (q.acceptedAnswers ?? []).filter((_, j) => j !== i) })} aria-label={`Remove ${a}`}><i className="fas fa-times" /></button>
                  </span>
                ))}
                <Input
                  className="h-7 w-48 text-xs"
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    const v = e.currentTarget.value.trim();
                    if (e.key === "Enter" && v) {
                      e.preventDefault();
                      set({ acceptedAnswers: [...(q.acceptedAnswers ?? []), v] });
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Capitals, punctuation, and a leading "the/a/an" are ignored automatically.</p>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <Switch checked={!!q.caseSensitive} onCheckedChange={(c) => set({ caseSensitive: c })} /> Capitalization must match (e.g. chemical symbols)
            </label>
          </div>
        )}

        {q.type === "code" && (
          <div className="space-y-1.5">
            <Label className="text-xs">Expected code</Label>
            <Textarea value={q.expectedAnswer} onChange={(e) => set({ expectedAnswer: e.target.value })} rows={4} className="font-mono text-sm" placeholder="print('Hello')" />
          </div>
        )}

        {showFeedback ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Hint <span className="text-muted-foreground font-normal">(shown after a wrong answer)</span></Label>
              <Input value={q.hint ?? ""} onChange={(e) => set({ hint: e.target.value || undefined })} placeholder="Nudge without giving it away" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Explanation <span className="text-muted-foreground font-normal">(shown once correct)</span></Label>
              <Input value={q.explanation ?? ""} onChange={(e) => set({ explanation: e.target.value || undefined })} placeholder="Why the answer is right" data-testid={`explanation-${number}`} />
            </div>
          </div>
        ) : (
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowFeedback(true)}><i className="fas fa-lightbulb mr-1.5" />Add a hint and explanation</Button>
        )}

        {issues.length > 0 && (
          <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-0.5" data-testid={`issues-${number}`}>
            {issues.map((i) => <li key={i}><i className="fas fa-exclamation-circle mr-1" />{i}</li>)}
          </ul>
        )}
        {preview && <StudentPreview key={JSON.stringify(q)} q={q} />}
      </CardContent>
    </Card>
  );
}

function PasteDialog({ open, onOpenChange, onImport }: { open: boolean; onOpenChange: (o: boolean) => void; onImport: (qs: LessonQuestion[]) => void }) {
  const [text, setText] = useState("");
  const parsed = useMemo(() => parseQuizText(text), [text]);
  const example = `1. What is 3 × 4?\na) 7\n*b) 12\nc) 34\nExplanation: Three groups of four is 12.\n\n2. The sun is a star.\nAnswer: True\n\n3. Solve 2x = 10.\nAnswer: 5\n\n4. Which organelle holds a cell's DNA?\nAnswer: nucleus | the nucleus\nHint: It's the cell's control center.`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paste questions</DialogTitle>
          <DialogDescription>Copy questions from a document. Separate questions with a blank line. Mark the right choice with * or add an "Answer:" line.</DialogDescription>
        </DialogHeader>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} className="font-mono text-sm" placeholder={example} data-testid="paste-text" />
        <div className="flex items-center justify-between text-sm">
          <Button type="button" variant="link" className="px-0" onClick={() => setText(example)}>Fill in the example</Button>
          <span className="text-muted-foreground">{parsed.questions.length} question{parsed.questions.length === 1 ? "" : "s"} found</span>
        </div>
        {parsed.questions.length > 0 && (
          <ul className="text-sm space-y-1 rounded-md bg-muted/50 p-3 max-h-40 overflow-y-auto">
            {parsed.questions.map((q, i) => (
              <li key={i}><Badge variant="outline" className="mr-2">{QUESTION_TYPES.find((t) => t.type === q.type)?.label}</Badge>{q.prompt}</li>
            ))}
          </ul>
        )}
        {parsed.errors.length > 0 && (
          <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-0.5">{parsed.errors.map((e) => <li key={e}><i className="fas fa-exclamation-circle mr-1" />{e}</li>)}</ul>
        )}
        <DialogFooter>
          <Button type="button" disabled={!parsed.questions.length} onClick={() => { onImport(parsed.questions.map((q) => ({ ...q, id: uid("q") }))); setText(""); onOpenChange(false); }} data-testid="paste-import">
            {parsed.questions.length ? `Add ${parsed.questions.length} question${parsed.questions.length === 1 ? "" : "s"}` : "Nothing to add yet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CopyFromLessonDialog({ open, onOpenChange, onImport, excludeId }: { open: boolean; onOpenChange: (o: boolean) => void; onImport: (qs: LessonQuestion[]) => void; excludeId?: string }) {
  const [search, setSearch] = useState("");
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const { data: lessons = [] } = useQuery<{ id: string; title: string; gradeLevel?: number; questionCount: number }[]>({ queryKey: ["/api/lessons"], enabled: open });
  const { data: lesson } = useQuery<Lesson>({ queryKey: ["/api/lessons", lessonId], enabled: !!lessonId, queryFn: () => apiRequest("GET", `/api/lessons/${lessonId}`) });
  const questions = lesson ? [...(parseStructuredContent(lesson.content)?.sections ?? []), ...(lesson.quiz?.sections ?? [])].flatMap((s) => s.questions) : [];
  const shown = lessons.filter((l) => l.id !== excludeId && l.questionCount > 0 && l.title.toLowerCase().includes(search.toLowerCase())).slice(0, 50);

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setLessonId(null); setPicked(new Set()); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Copy questions from another lesson</DialogTitle>
          <DialogDescription>Reuse questions from anywhere in the library. Copies are independent, so editing them won't change the original.</DialogDescription>
        </DialogHeader>
        {!lessonId ? (
          <>
            <Input placeholder="Search lessons" value={search} onChange={(e) => setSearch(e.target.value)} />
            <ul className="divide-y divide-border max-h-80 overflow-y-auto">
              {shown.map((l) => (
                <li key={l.id}>
                  <button type="button" className="w-full text-left py-2 px-1 hover:bg-muted/50 rounded flex justify-between gap-2" onClick={() => setLessonId(l.id)}>
                    <span className="text-sm">{l.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{l.questionCount} questions</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <Button type="button" variant="link" className="px-0 justify-start" onClick={() => { setLessonId(null); setPicked(new Set()); }}>← Back to lessons</Button>
            <div className="font-medium">{lesson?.title}</div>
            {!lesson && <p className="text-sm text-muted-foreground">Loading questions…</p>}
            <ul className="space-y-1.5">
              {questions.map((q) => (
                <li key={q.id}>
                  <label className="flex gap-2 items-start text-sm cursor-pointer rounded-md border border-border p-2">
                    <Checkbox checked={picked.has(q.id)} onCheckedChange={(c) => setPicked((s) => { const n = new Set(s); c ? n.add(q.id) : n.delete(q.id); return n; })} className="mt-0.5" />
                    <span>{q.prompt} <span className="text-xs text-muted-foreground">({QUESTION_TYPES.find((t) => t.type === q.type)?.label} · {q.expectedAnswer})</span></span>
                  </label>
                </li>
              ))}
            </ul>
            {questions.length > 0 && (
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPicked(new Set(questions.map((q) => q.id)))} data-testid="copy-select-all">Select all {questions.length}</Button>
              </div>
            )}
          </>
        )}
        <DialogFooter>
          <Button type="button" disabled={!picked.size} onClick={() => { onImport(questions.filter((q) => picked.has(q.id)).map((q) => ({ ...q, id: uid("q") }))); onOpenChange(false); setLessonId(null); setPicked(new Set()); }} data-testid="copy-import">
            {picked.size ? `Add ${picked.size} question${picked.size === 1 ? "" : "s"}` : "Select questions to add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function QuizBuilder({ sections, onChange, lessonId }: { sections: LessonSection[]; onChange: (s: LessonSection[]) => void; lessonId?: string }) {
  const [pasteOpen, setPasteOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const all = sections.flatMap((s) => s.questions);
  const withIssues = all.filter((q) => questionIssues(q).length).length;
  const withExplanations = all.filter((q) => q.explanation).length;
  let counter = 0;

  const updateSection = (sid: string, patch: Partial<LessonSection>) => onChange(sections.map((s) => (s.id === sid ? { ...s, ...patch } : s)));
  const setQuestions = (sid: string, fn: (qs: LessonQuestion[]) => LessonQuestion[]) => onChange(sections.map((s) => (s.id === sid ? { ...s, questions: fn(s.questions) } : s)));
  const addToLast = (qs: LessonQuestion[]) => {
    if (sections.length === 0) onChange([{ id: uid("section"), title: "Check your understanding", questions: qs }]);
    else setQuestions(sections[sections.length - 1].id, (cur) => [...cur, ...qs]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5 text-xs mr-auto">
          <Badge variant="secondary" data-testid="quiz-count">{all.length} question{all.length === 1 ? "" : "s"}</Badge>
          {all.length > 0 && <Badge variant="outline">{withExplanations}/{all.length} with explanations</Badge>}
          {withIssues > 0 && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300">{withIssues} need attention</Badge>}
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => setPasteOpen(true)} data-testid="paste-questions"><i className="fas fa-paste mr-1.5" />Paste questions</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setCopyOpen(true)} data-testid="copy-questions"><i className="fas fa-copy mr-1.5" />Copy from a lesson</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...sections, { id: uid("section"), title: `Part ${sections.length + 1}`, questions: [] }])}><i className="fas fa-layer-group mr-1.5" />Add section</Button>
      </div>

      {sections.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-border p-6 text-center space-y-3">
          <div className="font-medium">Add a quiz to check understanding</div>
          <p className="text-sm text-muted-foreground">Questions are graded instantly. Students must get every one right to finish, and their first-try accuracy becomes the lesson score.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUESTION_TYPES.slice(0, 4).map((t) => (
              <Button key={t.type} type="button" size="sm" variant="outline" onClick={() => addToLast([blankQuestion(t.type)])} data-testid={`start-${t.type}`}>
                <i className={`${t.icon} mr-1.5`} />{t.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {sections.map((section, si) => (
        <div key={section.id} className="space-y-3 rounded-lg border border-border p-3 sm:p-4 bg-muted/20">
          <div className="flex gap-2 items-start">
            <div className="flex-1 grid sm:grid-cols-2 gap-2">
              <Input value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} placeholder="Section title" className="font-medium bg-background" aria-label="Section title" />
              <Input value={section.description ?? ""} onChange={(e) => updateSection(section.id, { description: e.target.value || undefined })} placeholder="Directions (optional)" className="bg-background" aria-label="Section directions" />
            </div>
            {sections.length > 1 && (
              <Button type="button" size="icon" variant="ghost" onClick={() => confirm(`Delete "${section.title}" and its ${section.questions.length} questions?`) && onChange(sections.filter((s) => s.id !== section.id))} title="Delete section">
                <i className="fas fa-trash text-muted-foreground" />
              </Button>
            )}
          </div>
          {section.questions.map((q, qi) => {
            counter++;
            return (
              <QuestionEditor
                key={q.id}
                q={q}
                number={counter}
                onChange={(next) => setQuestions(section.id, (qs) => qs.map((x) => (x.id === q.id ? next : x)))}
                onRemove={() => setQuestions(section.id, (qs) => qs.filter((x) => x.id !== q.id))}
                onDuplicate={() => setQuestions(section.id, (qs) => [...qs.slice(0, qi + 1), { ...q, id: uid("q") }, ...qs.slice(qi + 1)])}
                onMove={(dir) => setQuestions(section.id, (qs) => { const c = [...qs]; [c[qi], c[qi + dir]] = [c[qi + dir], c[qi]]; return c; })}
                canMoveUp={qi > 0}
                canMoveDown={qi < section.questions.length - 1}
              />
            );
          })}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground self-center mr-1">Add:</span>
            {QUESTION_TYPES.map((t) => (
              <Button key={t.type} type="button" size="sm" variant="ghost" className="h-8" onClick={() => setQuestions(section.id, (qs) => [...qs, blankQuestion(t.type)])} data-testid={`add-${t.type}-${si}`}>
                <i className={`${t.icon} mr-1.5`} />{t.label}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <PasteDialog open={pasteOpen} onOpenChange={setPasteOpen} onImport={addToLast} />
      <CopyFromLessonDialog open={copyOpen} onOpenChange={setCopyOpen} onImport={addToLast} excludeId={lessonId} />
    </div>
  );
}
