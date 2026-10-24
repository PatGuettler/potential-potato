/**
 * A compact way to author courses. Each course file reads like a scope-and-sequence:
 * course → units → lessons → questions.
 */
import type { Course, DifficultyLevel, Lesson, LessonQuestion } from "../core/types";

type Q = Omit<LessonQuestion, "id">;

/** Stable pseudo-random order so the correct choice isn't always first, and stays put between builds. */
function shuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Multiple choice: the correct answer first, then distractors. Options are shuffled. */
export const mc = (prompt: string, correct: string, distractors: string[], explanation?: string, hint?: string): Q => ({
  type: "choice",
  prompt,
  expectedAnswer: correct,
  options: shuffle([correct, ...distractors], prompt),
  explanation,
  hint,
});

export const tf = (prompt: string, answer: boolean, explanation?: string): Q => ({
  type: "truefalse",
  prompt,
  expectedAnswer: answer ? "True" : "False",
  options: ["True", "False"],
  explanation,
});

export const num = (prompt: string, answer: number | string, explanation?: string, opts: { tolerance?: number; hint?: string } = {}): Q => ({
  type: "number",
  prompt,
  expectedAnswer: String(answer),
  tolerance: opts.tolerance,
  explanation,
  hint: opts.hint,
});

/** Short answer: the first answer is shown to teachers; all of them are accepted. */
export const short = (prompt: string, answers: string[], explanation?: string, hint?: string): Q => ({
  type: "text",
  prompt,
  expectedAnswer: answers[0],
  acceptedAnswers: answers.slice(1),
  explanation,
  hint,
});

export interface LessonSpec {
  title: string;
  summary: string;
  objectives: string[];
  vocab?: [string, string][];
  standards: string[];
  /** Markdown reading. */
  body: string;
  questions: Q[];
  /** If set, students also write a response that lands in the teacher's review queue. */
  writtenPrompt?: string;
  rubric?: string;
  guide?: string;
  minutes?: number;
  difficulty?: DifficultyLevel;
  programmingLanguage?: string;
}

export interface UnitSpec {
  title: string;
  description: string;
  lessons: LessonSpec[];
}

export interface CourseSpec {
  id: string;
  title: string;
  subject: "science" | "technology" | "engineering" | "mathematics";
  grade: number;
  gradeMax?: number;
  description: string;
  framework: string;
  units: UnitSpec[];
}

const defaultMinutes = (g: number) => (g <= 2 ? 15 : g <= 5 ? 25 : g <= 8 ? 35 : 45);
const CREATED = "2026-08-15T12:00:00.000Z";

export function buildCourse(spec: CourseSpec): { course: Course; lessons: Lesson[] } {
  const lessons: Lesson[] = [];
  const total = spec.units.reduce((n, u) => n + u.lessons.length, 0);
  let position = 0;
  const course: Course = {
    id: spec.id,
    title: spec.title,
    subject: spec.subject,
    gradeLevel: spec.grade,
    gradeLevelMax: spec.gradeMax,
    description: spec.description,
    framework: spec.framework,
    authorId: "system",
    isActive: true,
    createdAt: CREATED,
    units: spec.units.map((u, ui) => {
      const unitId = `${spec.id}-u${ui + 1}`;
      return {
        id: unitId,
        title: `Unit ${ui + 1}: ${u.title}`,
        description: u.description,
        lessonIds: u.lessons.map((l, li) => {
          const id = `${spec.id}-${ui + 1}-${li + 1}`;
          const third = position++ / Math.max(1, total);
          const body = l.writtenPrompt ? `${l.body.trim()}\n\n## Your turn\n${l.writtenPrompt}` : l.body.trim();
          lessons.push({
            id,
            title: l.title,
            description: l.summary,
            content: body,
            quiz: {
              sections: [
                {
                  id: `${id}-check`,
                  title: "Check your understanding",
                  questions: l.questions.map((q, qi) => ({ ...q, id: `${id}-q${qi + 1}` })),
                },
              ],
            },
            courseId: spec.id,
            unitId,
            gradeLevel: spec.grade,
            objectives: l.objectives,
            vocabulary: l.vocab?.map(([term, definition]) => ({ term, definition })),
            standards: l.standards,
            categoryId: spec.subject,
            difficulty: l.difficulty ?? (third < 0.34 ? "easy" : third < 0.67 ? "medium" : "hard"),
            estimatedDuration: l.minutes ?? defaultMinutes(spec.grade),
            programmingLanguage: l.programmingLanguage,
            answer: l.rubric,
            answerGuide: l.guide,
            tags: [],
            authorId: "system",
            isActive: true,
            createdAt: CREATED,
          });
          return id;
        }),
      };
    }),
  };
  return { course, lessons };
}
