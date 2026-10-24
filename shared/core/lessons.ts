import type { Category, Lesson, LessonContent } from "./types";

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

/** Every gradable question for a lesson, whether the lesson is quiz-only or reading + quiz. */
export function lessonQuestions(lesson: Lesson) {
  const structured = parseStructuredContent(lesson.content);
  const sections = [...(structured?.sections ?? []), ...(lesson.quiz?.sections ?? [])];
  return sections.flatMap((s) => s.questions);
}
