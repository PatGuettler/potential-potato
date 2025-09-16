import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  answer: string;
  answerGuide: string;
  setAnswer: (value: string) => void;
  setAnswerGuide: (value: string) => void;
};

export function LessonAnswerFields({ answer, answerGuide, setAnswer, setAnswerGuide }: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="answer">Answer (Passing Criteria) *</Label>
        <Textarea
          id="answer"
          data-testid="textarea-answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Expected answer or passing criteria for lesson completion..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="answerGuide">Answer Guide (Teacher Only)</Label>
        <Textarea
          id="answerGuide"
          data-testid="textarea-answer-guide"
          value={answerGuide}
          onChange={(e) => setAnswerGuide(e.target.value)}
          placeholder="Solution guide for teachers..."
          rows={4}
        />
      </div>
    </>
  );
}