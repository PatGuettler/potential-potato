import type { LessonQuestion } from "./types";

export interface GradeResult {
  isCorrect: boolean;
  feedback: string;
}

const squash = (s: string) => s.trim().replace(/\s+/g, " ");

/** Lowercases, drops punctuation and leading articles so "The Mitochondria." matches "mitochondria". */
function normalizeText(s: string, caseSensitive = false) {
  let t = squash(s).replace(/[.,!?;:"'()]/g, "").replace(/\s+/g, " ").trim();
  if (!caseSensitive) t = t.toLowerCase().replace(/^(the|a|an) /, "");
  return t;
}

/** Parses "12", "-3.5", "1,200", "3/4" and "2 1/2". */
export function parseNumber(raw: string): number {
  const s = raw.trim().replace(/,/g, "").replace(/\s*(units?|degrees?|°|%|cm|m|kg|g|s|in|ft)\s*$/i, "");
  const mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    return whole + Math.sign(whole || 1) * (Number(mixed[2]) / Number(mixed[3]));
  }
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  return /^-?\d*\.?\d+(e-?\d+)?$/i.test(s) ? Number(s) : NaN;
}

function keywordMatch(answer: string, expected: string): number {
  const norm = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const keywords = norm(expected).split(" ").filter((w) => w.length > 3);
  if (keywords.length === 0) return 0;
  const words = norm(answer).split(" ");
  const hits = keywords.filter((k) => words.some((w) => w.length > 3 && (w.startsWith(k) || k.startsWith(w))));
  return Math.round((hits.length / keywords.length) * 100);
}

export function gradeQuestion(question: LessonQuestion, rawAnswer: string): GradeResult {
  switch (question.type) {
    case "number": {
      const a = parseNumber(rawAnswer);
      const e = parseNumber(question.expectedAnswer);
      if (!Number.isFinite(a)) return { isCorrect: false, feedback: "Enter a number, like 12, 3.5 or 3/4." };
      const ok = Math.abs(a - e) <= (question.tolerance ?? 1e-3);
      return { isCorrect: ok, feedback: ok ? "Correct!" : "Not quite. Check your work and try again." };
    }
    case "truefalse": {
      const ok = normalizeText(rawAnswer) === normalizeText(question.expectedAnswer);
      return { isCorrect: ok, feedback: ok ? "Correct!" : "Not quite. Try again." };
    }
    case "choice": {
      // Exact match: options like "Tt" and "tt" differ only by case.
      const ok = squash(rawAnswer) === squash(question.expectedAnswer);
      return { isCorrect: ok, feedback: ok ? "Correct!" : "Not quite. Try again." };
    }
    case "code": {
      const ok = squash(rawAnswer).replace(/\s/g, "") === squash(question.expectedAnswer).replace(/\s/g, "");
      return { isCorrect: ok, feedback: ok ? "Your code matches the solution." : "Your code doesn't match yet. Check syntax and logic." };
    }
    default: {
      const cs = !!question.caseSensitive;
      const answer = normalizeText(rawAnswer, cs);
      const accepted = [question.expectedAnswer, ...(question.acceptedAnswers ?? [])].map((x) => normalizeText(x, cs)).filter(Boolean);
      if (accepted.includes(answer)) return { isCorrect: true, feedback: "Correct!" };
      // Longer model answers get credit for covering the key ideas.
      const long = question.expectedAnswer.trim().split(/\s+/).length >= 5;
      const ok = long && keywordMatch(rawAnswer, question.expectedAnswer) >= 70;
      return { isCorrect: ok, feedback: ok ? "Good answer. You've got the key idea." : "Not quite. Try again." };
    }
  }
}

/** Rough auto-score for an open written response; the teacher makes the final call. */
export function scoreWrittenResponse(answer: string, rubric: string | undefined): number {
  if (!rubric) return 0;
  return keywordMatch(answer, rubric);
}
