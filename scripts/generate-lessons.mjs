#!/usr/bin/env node
/**
 * Generates data/lessons/*.csv with 20 curriculum lessons per STEM category.
 * Run: node scripts/generate-lessons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { scienceLessons } from "./lessons/science.mjs";
import { technologyLessons } from "./lessons/technology.mjs";
import { engineeringLessons } from "./lessons/engineering.mjs";
import { mathematicsLessons } from "./lessons/mathematics.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "data", "lessons");

const HEADER =
  "id,title,category,summary,content,answerGuide,answer,difficulty,estimatedMinutes,tags,authorId,createdAt,schoolId";

function csvEscape(value) {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function lessonToRow(lesson, category) {
  return [
    lesson.id,
    lesson.title,
    category,
    lesson.summary,
    lesson.content,
    lesson.answerGuide,
    lesson.answer,
    lesson.difficulty,
    lesson.estimatedMinutes,
    lesson.tags,
    "stemgenius-curriculum",
    "2025-05-24T12:00:00.000Z",
    "default-school",
  ]
    .map(csvEscape)
    .join(",");
}

function writeCategory(filename, category, lessons) {
  const lines = [HEADER, ...lessons.map((l) => lessonToRow(l, category))];
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");
  console.log(`Wrote ${lessons.length} lessons → ${filePath}`);
}

writeCategory("science.csv", "science", scienceLessons);
writeCategory("technology.csv", "technology", technologyLessons);
writeCategory("engineering.csv", "engineering", engineeringLessons);
writeCategory("mathematics.csv", "mathematics", mathematicsLessons);

console.log("Done. Restart the dev server to load new lessons.");
