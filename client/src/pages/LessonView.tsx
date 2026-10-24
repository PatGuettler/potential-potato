import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Markdown } from "@/components/Markdown";
import { EmptyState, Loading, ProgressBar } from "@/components/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MonacoEditor } from "@/components/ui/monaco-editor";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { parseStructuredContent } from "@shared/core/lessons";
import { gradeLabel, type Course, type Lesson, type LessonQuestion } from "@shared/core/types";

type LessonData = Lesson & { hasWrittenResponse?: boolean; averageRating: number; totalRatings: number };
type ProgressData = {
  total: number;
  correct: number;
  percent: number;
  perQuestion: Record<string, { isCorrect: boolean; attempts: number }>;
  status: string;
  isCompleted: boolean;
};
type SubmissionData = { answer: string; status: string; teacherScore?: number; feedback?: string; reviewerName?: string } | null;
type Result = { isCorrect: boolean; feedback: string; hint?: string; explanation?: string };
type Feedback = Record<string, Result>;
const YOUR_TURN = "\n\n## Your turn\n";

function QuestionCard({
  q,
  number,
  solved,
  result,
  onCheck,
  pending,
  showAnswer,
}: {
  q: LessonQuestion;
  number: number;
  solved: boolean;
  result?: Result;
  onCheck: (answer: string) => void;
  pending: boolean;
  showAnswer: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const disabled = solved || pending;
  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (answer.trim()) onCheck(answer);
  };

  return (
    <form onSubmit={submit} className={`rounded-lg border p-4 space-y-3 ${solved ? "border-green-300 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30" : "border-border"}`} data-testid={`question-${q.id}`}>
      <div className="flex items-start gap-2">
        <span className="text-xs font-semibold text-muted-foreground mt-0.5">Q{number}</span>
        <p className="flex-1 font-medium text-sm">{q.prompt}</p>
        {solved && <i className="fas fa-check-circle text-green-600" />}
      </div>

      {(q.type === "choice" || q.type === "truefalse") && q.options?.length ? (
        <div className="grid sm:grid-cols-2 gap-2">
          {q.options.map((opt) => (
            <button
              type="button"
              key={opt}
              disabled={disabled}
              onClick={() => {
                setAnswer(opt);
                onCheck(opt);
              }}
              className={`text-left text-sm rounded-md border px-3 py-2 transition-colors disabled:cursor-default ${
                answer === opt && result && !pending
                  ? result.isCorrect ? "border-green-500 bg-green-100 dark:bg-green-950" : "border-red-400 bg-red-50 dark:bg-red-950"
                  : "border-border hover:bg-muted"
              }`}
              data-testid={`option-${q.id}-${opt}`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : q.type === "code" ? (
        <div className="space-y-2">
          <div className="rounded-md overflow-hidden border border-border">
            <MonacoEditor value={answer} onChange={setAnswer} language="javascript" height="160px" readOnly={solved} />
          </div>
          {!solved && <Button type="submit" size="sm" disabled={pending || !answer.trim()}>Check</Button>}
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="text"
            inputMode={q.type === "number" ? "decimal" : "text"}
            value={solved && !answer ? "✓" : answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={disabled}
            placeholder={q.type === "number" ? "Enter a number (fractions like 3/4 are OK)" : "Your answer"}
            data-testid={`answer-${q.id}`}
          />
          {!solved && <Button type="submit" disabled={pending || !answer.trim()} data-testid={`check-${q.id}`}>Check</Button>}
        </div>
      )}

      {result && !result.isCorrect && !solved && (
        <div className="text-sm text-red-600 dark:text-red-400 space-y-1">
          <p>{result.feedback}</p>
          {result.hint && <p className="rounded-md bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-3 py-2"><i className="fas fa-lightbulb mr-1.5" />Hint: {result.hint}</p>}
        </div>
      )}
      {result?.explanation && (
        <p className="text-sm rounded-md bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200 px-3 py-2" data-testid={`explanation-${q.id}`}>
          <i className="fas fa-circle-info mr-1.5" />{result.explanation}
        </p>
      )}
      {showAnswer && q.expectedAnswer && (
        <p className="text-xs text-muted-foreground"><i className="fas fa-key mr-1" />Answer: <span className="font-mono">{q.expectedAnswer}</span></p>
      )}
    </form>
  );
}

function Rating({ lessonId }: { lessonId: string }) {
  const { toast } = useToast();
  const [hover, setHover] = useState(0);
  const { user } = useAuth();
  const { data: ratings = [] } = useQuery<{ userId: string; rating: number }[]>({ queryKey: ["/api/lessons", lessonId, "ratings"] });
  const mine = ratings.find((r) => r.userId === user?.id)?.rating ?? 0;
  const rate = useMutation({
    mutationFn: (rating: number) => apiRequest("POST", `/api/lessons/${lessonId}/rate`, { rating }),
    onSuccess: () => {
      toast({ title: "Thanks for the feedback!" });
      queryClient.invalidateQueries({ queryKey: ["/api/lessons", lessonId, "ratings"] });
    },
  });
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onMouseEnter={() => setHover(n)} onClick={() => rate.mutate(n)} aria-label={`Rate ${n} stars`} data-testid={`rate-${n}`}>
          <i className={`fa-star text-lg ${(hover || mine) >= n ? "fas text-amber-400" : "far text-muted-foreground"}`} />
        </button>
      ))}
      <span className="text-xs text-muted-foreground ml-2">{ratings.length} rating{ratings.length === 1 ? "" : "s"}</span>
    </div>
  );
}

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isStudent = user?.role === "student";
  const isStaff = user?.role === "teacher" || user?.role === "admin";

  const { data: lesson, isLoading, error } = useQuery<LessonData>({ queryKey: ["/api/lessons", id] });
  const { data: course } = useQuery<Course & { lessons: Record<string, { title: string }> }>({ queryKey: ["/api/courses", lesson?.courseId], enabled: !!lesson?.courseId });
  const { data: progress } = useQuery<ProgressData>({ queryKey: ["/api/lessons", id, "progress"], enabled: !!lesson });
  const { data: submission } = useQuery<SubmissionData>({ queryKey: ["/api/lessons", id, "submission"], enabled: !!lesson && isStudent });

  const [feedback, setFeedback] = useState<Feedback>({});
  const [written, setWritten] = useState("");
  const startedAt = useRef(Date.now());
  const savedMinutes = useRef(0);

  const refreshProgress = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/lessons", id, "progress"] });
    queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    queryClient.invalidateQueries({ queryKey: ["/api/me/assignments"] });
  };

  const unsavedMinutes = () => Math.floor((Date.now() - startedAt.current) / 60000) - savedMinutes.current;

  // Record the visit, and on leaving log the time spent so teachers and parents can see effort.
  useEffect(() => {
    if (!isStudent || !id) return;
    startedAt.current = Date.now();
    savedMinutes.current = 0;
    apiRequest("POST", `/api/lessons/${id}/start`).then(refreshProgress).catch(() => undefined);
    return () => {
      const minutes = unsavedMinutes();
      if (minutes > 0) apiRequest("POST", "/api/progress", { lessonId: id, timeSpent: minutes }).catch(() => undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isStudent]);

  const check = useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) =>
      apiRequest<Result>("POST", `/api/lessons/${id}/questions/${questionId}/validate`, { answer }),
    onSuccess: (res, { questionId }) => {
      setFeedback((f) => ({ ...f, [questionId]: res }));
      refreshProgress();
    },
    onError: (e: Error) => toast({ title: "Couldn't check answer", description: e.message, variant: "destructive" }),
  });

  const complete = useMutation({
    mutationFn: () => {
      const minutes = Math.max(0, unsavedMinutes());
      savedMinutes.current += minutes;
      return apiRequest<{ score: number }>("POST", "/api/progress", { lessonId: id, isCompleted: true, timeSpent: minutes });
    },
    onSuccess: (p) => {
      toast({ title: "Lesson complete! 🎉", description: `Score: ${p.score}%` });
      refreshProgress();
    },
    onError: (e: Error) => toast({ title: "Not quite done", description: e.message, variant: "destructive" }),
  });

  const submitWritten = useMutation({
    mutationFn: () => apiRequest("POST", `/api/lessons/${id}/validate-answer`, { studentAnswer: written }),
    onSuccess: () => {
      toast({ title: "Response submitted", description: "Your teacher will review it." });
      setWritten("");
      queryClient.invalidateQueries({ queryKey: ["/api/lessons", id, "submission"] });
    },
    onError: (e: Error) => toast({ title: "Couldn't submit", description: e.message, variant: "destructive" }),
  });

  const archive = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/lessons/${id}`),
    onSuccess: () => {
      toast({ title: "Lesson archived" });
      queryClient.invalidateQueries();
      navigate("/library");
    },
    onError: (e: Error) => toast({ title: "Couldn't archive", description: e.message, variant: "destructive" }),
  });

  if (error) return <AppShell title="Lesson"><Card><EmptyState icon="fas fa-book" title="Lesson not found">{(error as Error).message}</EmptyState></Card></AppShell>;
  if (isLoading || !lesson) return <AppShell title="Lesson"><Loading label="Loading lesson…" /></AppShell>;

  const structured = parseStructuredContent(lesson.content);
  const sections = [...(structured?.sections ?? []), ...(lesson.quiz?.sections ?? [])];
  const questions = sections.flatMap((s) => s.questions);
  const solved = (qid: string) => !!progress?.perQuestion[qid]?.isCorrect;
  const allSolved = questions.every((q) => solved(q.id));
  const completed = !!progress?.isCompleted;
  const canEdit = isStaff && (user?.role === "admin" || lesson.authorId === user?.id);
  const writtenEnabled = isStudent ? lesson.hasWrittenResponse : !!lesson.answer;
  const [reading, writtenPrompt] = (structured ? "" : lesson.content ?? "").split(YOUR_TURN);
  const unit = course?.units.find((u) => u.id === lesson.unitId);
  const order = course?.units.flatMap((u) => u.lessonIds) ?? [];
  const pos = order.indexOf(lesson.id);
  const prevId = pos > 0 ? order[pos - 1] : undefined;
  const nextId = pos >= 0 && pos < order.length - 1 ? order[pos + 1] : undefined;
  let n = 0;

  return (
    <AppShell
      title={lesson.title}
      subtitle={
        course ? (
          <>
            <Link href={`/courses/${course.id}`} className="hover:underline">{course.title}</Link>
            {unit && <> · {unit.title}</>}
          </>
        ) : (
          <><span className="capitalize">{lesson.categoryId}</span>{lesson.gradeLevel !== undefined && <> · {gradeLabel(lesson.gradeLevel)}</>}</>
        )
      }
      actions={
        <>
          <Button size="sm" variant="ghost" onClick={() => window.history.back()}><i className="fas fa-arrow-left mr-2" />Back</Button>
          {canEdit && <Link href={`/lesson-edit/${lesson.id}`}><Button size="sm" variant="outline" data-testid="edit-lesson-button">Edit</Button></Link>}
        </>
      }
    >
      {!isStudent && (
        <div className="rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground">
          <i className="fas fa-eye mr-2" />
          {isStaff ? "Teacher preview: answers and teacher notes are visible to you only." : "Preview: you're viewing the lesson your child sees."}
        </div>
      )}
      {completed && (
        <div className="rounded-md bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200 px-4 py-3 text-sm">
          <i className="fas fa-trophy mr-2" />You completed this lesson. Nice work!
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {lesson.gradeLevel !== undefined && <Badge variant="outline">{gradeLabel(lesson.gradeLevel)}</Badge>}
                <span><i className="fas fa-clock mr-1" />{lesson.estimatedDuration} min</span>
                {questions.length > 0 && <span><i className="fas fa-question-circle mr-1" />{questions.length} questions</span>}
              </div>
              {lesson.description && <p className="text-lg">{lesson.description}</p>}
              {reading && <Markdown source={reading} />}
            </CardContent>
          </Card>

          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{section.title}</CardTitle>
                {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
              </CardHeader>
              <CardContent className="space-y-3">
                {section.questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    q={q}
                    number={++n}
                    solved={solved(q.id)}
                    result={feedback[q.id]}
                    pending={check.isPending && check.variables?.questionId === q.id}
                    onCheck={(answer) => check.mutate({ questionId: q.id, answer })}
                    showAnswer={isStaff}
                  />
                ))}
              </CardContent>
            </Card>
          ))}

          {writtenEnabled && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Written response</CardTitle>
                {writtenPrompt ? <Markdown source={writtenPrompt} className="text-sm" /> : <p className="text-sm text-muted-foreground">Explain what you learned in your own words.</p>}
                <p className="text-xs text-muted-foreground">Your teacher reviews it and leaves feedback.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {submission && (
                  <div className="rounded-md border border-border p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Your latest response</span>
                      {submission.status === "reviewed" ? <Badge>{submission.teacherScore}%</Badge> : <Badge variant="outline">Awaiting review</Badge>}
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{submission.answer}</p>
                    {submission.feedback && <div className="rounded bg-muted px-3 py-2"><span className="font-medium">{submission.reviewerName}:</span> {submission.feedback}</div>}
                  </div>
                )}
                {isStudent ? (
                  <>
                    <Textarea value={written} onChange={(e) => setWritten(e.target.value)} rows={5} placeholder="Write your answer here…" data-testid="student-answer-textarea" />
                    <Button onClick={() => submitWritten.mutate()} disabled={!written.trim() || submitWritten.isPending} data-testid="submit-answer-button">
                      {submission ? "Submit a new response" : "Submit response"}
                    </Button>
                  </>
                ) : (
                  lesson.answer && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium">Rubric (teachers only)</summary>
                      <Markdown source={lesson.answer} className="mt-2" />
                    </details>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {isStaff && lesson.answerGuide && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Teacher guide</CardTitle></CardHeader>
              <CardContent><Markdown source={lesson.answerGuide} className="text-sm" /></CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {(lesson.objectives?.length ?? 0) > 0 && (
            <Card data-testid="objectives">
              <CardHeader className="pb-2"><CardTitle className="text-base"><i className="fas fa-bullseye mr-2 text-primary" />Learning goals</CardTitle></CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">By the end of this lesson, you will be able to:</p>
                <ul className="space-y-1.5 text-sm">
                  {lesson.objectives!.map((o) => <li key={o} className="flex gap-2"><i className="fas fa-check text-green-600 mt-1 text-xs" /><span>{o}</span></li>)}
                </ul>
                {(lesson.standards?.length ?? 0) > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1.5">Standards</div>
                    <div className="flex flex-wrap gap-1">
                      {lesson.standards!.map((st) => <Badge key={st} variant="outline" className="font-mono text-[10px]">{st.replace("CCSS.MATH.CONTENT.", "CCSS ")}</Badge>)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {(lesson.vocabulary?.length ?? 0) > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base"><i className="fas fa-book mr-2 text-primary" />Vocabulary</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {lesson.vocabulary!.map((v) => (
                    <div key={v.term}><dt className="font-semibold">{v.term}</dt><dd className="text-muted-foreground">{v.definition}</dd></div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}
          <Card className="lg:sticky lg:top-4">
            <CardHeader className="pb-2"><CardTitle className="text-base">{isStudent ? "Your progress" : "Questions"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {questions.length > 0 ? (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span>Answered correctly</span>
                      <span className="text-muted-foreground">{progress?.correct ?? 0}/{questions.length}</span>
                    </div>
                    <ProgressBar value={progress?.percent ?? 0} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {questions.map((q, i) => (
                      <span
                        key={q.id}
                        className={`w-8 h-8 rounded text-xs font-medium flex items-center justify-center border ${
                          solved(q.id)
                            ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                            : feedback[q.id] ? "bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-muted border-border text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">This lesson is reading only.</p>
              )}
              {isStudent && !completed && (
                <Button className="w-full" disabled={!allSolved || complete.isPending} onClick={() => complete.mutate()} data-testid="complete-lesson-button">
                  <i className="fas fa-flag-checkered mr-2" />
                  {allSolved ? "Mark lesson complete" : "Answer every question to finish"}
                </Button>
              )}
              <div className="pt-2 border-t border-border">
                <div className="text-sm font-medium mb-1">Rate this lesson</div>
                <Rating lessonId={lesson.id} />
              </div>
            </CardContent>
          </Card>
          {canEdit && (
            <Button variant="ghost" className="w-full text-destructive" onClick={() => confirm("Archive this lesson? Students' past progress is kept.") && archive.mutate()}>
              Archive lesson
            </Button>
          )}
        </div>
      </div>

      {(prevId || nextId) && course && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between border-t border-border pt-4" data-testid="lesson-nav">
          {prevId ? (
            <Link href={`/lesson/${prevId}`}><Button variant="outline" className="w-full sm:w-auto"><i className="fas fa-arrow-left mr-2" />{course.lessons[prevId]?.title ?? "Previous"}</Button></Link>
          ) : <span />}
          {nextId && (
            <Link href={`/lesson/${nextId}`}><Button className="w-full sm:w-auto" data-testid="next-lesson">Next: {course.lessons[nextId]?.title ?? "lesson"}<i className="fas fa-arrow-right ml-2" /></Button></Link>
          )}
        </div>
      )}
    </AppShell>
  );
}
