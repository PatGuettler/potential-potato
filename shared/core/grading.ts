import type { LessonQuestion } from "./types";

export interface GradeResult {
  isCorrect: boolean;
  feedback: string;
}

const squash = (s: string) => s.trim().replace(/\s+/g, " ");

function keywordMatch(answer: string, expected: string): number {
  const norm = (s: string) =>
    s.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const keywords = norm(expected).split(" ").filter((w) => w.length > 3);
  if (keywords.length === 0) return 0;
  const words = new Set(norm(answer).split(" "));
  const hits = keywords.filter((k) => words.has(k) || Array.from(words).some((w) => w.length > 3 && (w.startsWith(k) || k.startsWith(w))));
  return Math.round((hits.length / keywords.length) * 100);
}

export function gradeQuestion(question: LessonQuestion, rawAnswer: string): GradeResult {
  const cs = question.caseSensitive && question.type === "text";
  const answer = cs ? squash(rawAnswer) : squash(rawAnswer).toLowerCase();
  const expected = cs ? squash(question.expectedAnswer) : squash(question.expectedAnswer).toLowerCase();

  switch (question.type) {
    case "number": {
      const a = parseFloat(answer.replace(/,/g, ""));
      const e = parseFloat(expected.replace(/,/g, ""));
      if (!Number.isFinite(a)) return { isCorrect: false, feedback: "Please enter a number." };
      const ok = Math.abs(a - e) < 1e-3;
      return { isCorrect: ok, feedback: ok ? "Correct! Nice work." : "Not quite. Check your work and try again." };
    }
    case "choice": {
      const ok = answer === expected;
      return { isCorrect: ok, feedback: ok ? "Correct!" : "Not quite. Re-read the lesson and try again." };
    }
    case "code": {
      const ok = answer.replace(/\s/g, "") === expected.replace(/\s/g, "");
      return { isCorrect: ok, feedback: ok ? "Your code matches the solution." : "Your code doesn't match yet. Check syntax and logic." };
    }
    default: {
      if (answer === expected) return { isCorrect: true, feedback: "Correct!" };
      const ok = keywordMatch(answer, expected) >= 70;
      return { isCorrect: ok, feedback: ok ? "Good answer. You've got the key idea." : "Not quite. Try again." };
    }
  }
}

/** Rough auto-score for an open written response; the teacher makes the final call. */
export function scoreWrittenResponse(answer: string, rubric: string | undefined): number {
  if (!rubric) return 0;
  return keywordMatch(answer, rubric);
}
