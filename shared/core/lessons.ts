import type { Category, DifficultyLevel, Lesson, LessonContent } from "./types";
import { lessonQuizzes } from "./quizzes";

export const defaultCategories: Category[] = [
  {
    id: "science",
    name: "Science",
    icon: "fas fa-microscope",
    description: "Biology, chemistry, physics, and earth science",
    color: "blue",
  },
  {
    id: "technology",
    name: "Technology",
    icon: "fas fa-laptop-code",
    description: "Programming, the web, AI, and data",
    color: "purple",
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "fas fa-cogs",
    description: "Design process, structures, and robotics",
    color: "green",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "fas fa-calculator",
    description: "Algebra, geometry, and statistics",
    color: "orange",
  },
];

/** RFC 4180 CSV parser that handles quoted, multi-line fields. */
export function parseCSV(text: string): Record<string, string>[] {
  const records: string[][] = [];
  let field = "";
  let record: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      record.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      record.push(field);
      records.push(record);
      record = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field !== "" || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  const [headers, ...rows] = records.filter((r) => r.some((v) => v.trim() !== ""));
  if (!headers) return [];
  return rows.map((row) =>
    Object.fromEntries(headers.map((h, idx) => [h.trim(), (row[idx] ?? "").trim()])),
  );
}

function toDifficulty(value: string): DifficultyLevel {
  const v = value.toLowerCase().trim();
  return v === "medium" || v === "hard" ? v : "easy";
}

/** Returns structured quiz content when `content` is a JSON quiz, otherwise null. */
export function parseStructuredContent(content: string | undefined): LessonContent | null {
  if (!content || !content.trim().startsWith("{")) return null;
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed?.sections)) return { sections: parsed.sections };
  } catch {
    // Not JSON: treat as markdown.
  }
  return null;
}

export function lessonsFromCsv(csvText: string): Lesson[] {
  return parseCSV(csvText)
    .filter((row) => row.id && row.title)
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.summary || "",
      content: row.content || "",
      quiz: lessonQuizzes[row.id],
      categoryId: row.category || "science",
      difficulty: toDifficulty(row.difficulty || "easy"),
      estimatedDuration: parseInt(row.estimatedMinutes, 10) || 30,
      programmingLanguage: row.programmingLanguage || undefined,
      answerGuide: row.answerGuide || undefined,
      answer: row.answer || undefined,
      tags: (row.tags || "").split("|").filter(Boolean),
      authorId: row.authorId || "system",
      isActive: true,
      createdAt: row.createdAt || new Date(0).toISOString(),
    }));
}

/** Every gradable question for a lesson, whether the lesson is quiz-only or reading + quiz. */
export function lessonQuestions(lesson: Lesson) {
  const structured = parseStructuredContent(lesson.content);
  const sections = [...(structured?.sections ?? []), ...(lesson.quiz?.sections ?? [])];
  return sections.flatMap((s) => s.questions);
}
