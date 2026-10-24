/** The bundled K–12 STEM curriculum: every course, unit, and lesson the app ships with. */
import type { Course, Database, Lesson } from "../core/types";
import { buildCourse, type CourseSpec } from "./dsl";
import { mathElementary } from "./math-elementary";
import { mathSecondary } from "./math-secondary";
import { scienceElementary } from "./science-elementary";
import { scienceSecondary } from "./science-secondary";
import { electives } from "./electives";

import { extensions } from "./extensions";
import { newCourses } from "./new-courses";

/** Later units are appended to existing courses, so earlier lesson ids (and students' progress) never change. */
const specs: CourseSpec[] = [...mathElementary, ...mathSecondary, ...scienceElementary, ...scienceSecondary, ...electives, ...newCourses].map((spec) => ({
  ...spec,
  units: [...spec.units, ...(extensions[spec.id] ?? [])],
}));

export function buildCurriculum(): { courses: Course[]; lessons: Lesson[] } {
  const built = specs.map(buildCourse);
  return { courses: built.map((b) => b.course), lessons: built.flatMap((b) => b.lessons) };
}

/** Adds any bundled courses and lessons an existing database doesn't have yet. Never overwrites edits. */
export function addCurriculum(db: Database): boolean {
  const { courses, lessons } = buildCurriculum();
  const haveCourse = new Set(db.courses.map((c) => c.id));
  const haveLesson = new Set(db.lessons.map((l) => l.id));
  const newCourses = courses.filter((c) => !haveCourse.has(c.id));
  const newLessons = lessons.filter((l) => !haveLesson.has(l.id));
  db.courses.push(...newCourses);
  db.lessons.push(...newLessons);
  return newCourses.length + newLessons.length > 0;
}
