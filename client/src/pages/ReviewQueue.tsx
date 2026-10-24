import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { EmptyState, Loading } from "@/components/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/components/Markdown";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { relativeTime } from "@/lib/format";

type Submission = {
  id: string;
  userId: string;
  studentName: string;
  lessonId: string;
  lessonTitle: string;
  answer: string;
  autoScore: number;
  rubric?: string;
  status: "pending" | "reviewed";
  teacherScore?: number;
  feedback?: string;
  reviewerName?: string;
  submittedAt: string;
  reviewedAt?: string;
};

function ReviewCard({ s }: { s: Submission }) {
  const { toast } = useToast();
  const [score, setScore] = useState(String(s.teacherScore ?? s.autoScore));
  const [feedback, setFeedback] = useState(s.feedback ?? "");
  const [showRubric, setShowRubric] = useState(false);
  const review = useMutation({
    mutationFn: () => apiRequest("POST", `/api/teacher/submissions/${s.id}/review`, { score: Number(score), feedback }),
    onSuccess: () => {
      toast({ title: "Feedback sent", description: `${s.studentName} and their parents can now see it.` });
      queryClient.invalidateQueries();
    },
    onError: (e: Error) => toast({ title: "Couldn't save review", description: e.message, variant: "destructive" }),
  });

  return (
    <Card data-testid={`submission-${s.id}`}>
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Link href={`/students/${s.userId}`} className="font-semibold hover:underline">{s.studentName}</Link>
            <div className="text-xs text-muted-foreground">
              <Link href={`/lesson/${s.lessonId}`} className="hover:underline">{s.lessonTitle}</Link> · submitted {relativeTime(s.submittedAt)}
            </div>
          </div>
          {s.status === "reviewed" ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">Reviewed · {s.teacherScore}%</Badge>
          ) : (
            <Badge variant="outline" title="Keyword match against the rubric. A starting point only.">Auto-check {s.autoScore}%</Badge>
          )}
        </div>
        <p className="text-sm whitespace-pre-wrap rounded-md bg-muted/60 px-3 py-2">{s.answer}</p>
        {s.rubric && (
          <div>
            <button className="text-xs text-primary hover:underline" onClick={() => setShowRubric((v) => !v)}>
              {showRubric ? "Hide" : "Show"} rubric
            </button>
            {showRubric && <Markdown source={s.rubric} className="text-sm mt-2 rounded-md border border-border p-3" />}
          </div>
        )}
        <form
          className="grid sm:grid-cols-[110px_1fr_auto] gap-2 items-start"
          onSubmit={(e) => {
            e.preventDefault();
            review.mutate();
          }}
        >
          <div className="relative">
            <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} aria-label="Score" className="pr-7" data-testid="review-score" />
            <span className="absolute right-3 top-2 text-sm text-muted-foreground">%</span>
          </div>
          <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={2} placeholder="Feedback for the student" data-testid="review-feedback" />
          <Button type="submit" disabled={review.isPending} data-testid="review-submit">{s.status === "reviewed" ? "Update" : "Send"}</Button>
        </form>
        {s.reviewerName && <div className="text-xs text-muted-foreground">Last reviewed by {s.reviewerName} {relativeTime(s.reviewedAt)}</div>}
      </CardContent>
    </Card>
  );
}

export default function ReviewQueue() {
  const { data = [], isLoading } = useQuery<Submission[]>({ queryKey: ["/api/teacher/submissions"] });
  const pending = data.filter((s) => s.status === "pending");
  const reviewed = data.filter((s) => s.status === "reviewed");

  return (
    <AppShell title="Review queue" subtitle="Written responses from your students">
      {isLoading ? (
        <Loading />
      ) : (
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Waiting ({pending.length})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed ({reviewed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            {pending.length === 0 ? <Card><EmptyState icon="fas fa-mug-hot" title="You're all caught up">New responses will appear here.</EmptyState></Card> : pending.map((s) => <ReviewCard key={s.id} s={s} />)}
          </TabsContent>
          <TabsContent value="reviewed" className="space-y-4">
            {reviewed.length === 0 ? <Card><EmptyState icon="fas fa-inbox" title="Nothing reviewed yet" /></Card> : reviewed.map((s) => <ReviewCard key={s.id} s={s} />)}
          </TabsContent>
        </Tabs>
      )}
    </AppShell>
  );
}
