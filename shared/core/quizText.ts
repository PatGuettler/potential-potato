/**
 * Parses questions pasted as plain text, so teachers can bring in quizzes from a doc or worksheet.
 *
 *   1. What is 3 × 4?
 *   a) 7
 *   *b) 12            ← a leading * marks the correct choice (or use "Answer: b")
 *   c) 34
 *   Explanation: Three groups of four is 12.
 *
 *   2. The sun is a star.
 *   Answer: True      ← true/false
 *
 *   3. Solve 2x = 10.
 *   Answer: 5         ← number
 *
 *   4. Which organelle holds DNA?
 *   Answer: nucleus | the nucleus   ← short answer; | separates accepted answers
 */
import type { LessonQuestion } from "./types";

export interface ParsedQuiz {
  questions: Omit<LessonQuestion, "id">[];
  errors: string[];
}

const OPTION = /^(\*)?\s*\(?([a-hA-H])[).:]\s+(.*)$/;
const FIELD = /^(answer|correct|hint|explanation|why)\s*[:\-]\s*(.*)$/i;

export function parseQuizText(text: string): ParsedQuiz {
  const blocks = text.replace(/\r/g, "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const questions: ParsedQuiz["questions"] = [];
  const errors: string[] = [];

  blocks.forEach((block, bi) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const promptLines: string[] = [];
    const options: { letter: string; text: string; starred: boolean }[] = [];
    let answer: string | undefined;
    let hint: string | undefined;
    let explanation: string | undefined;

    for (const line of lines) {
      const opt = line.match(OPTION);
      const field = line.match(FIELD);
      if (field) {
        const key = field[1].toLowerCase();
        if (key === "answer" || key === "correct") answer = field[2].trim();
        else if (key === "hint") hint = field[2].trim();
        else explanation = field[2].trim();
      } else if (opt && (options.length > 0 || promptLines.length > 0)) {
        options.push({ letter: opt[2].toLowerCase(), text: opt[3].trim(), starred: !!opt[1] });
      } else {
        promptLines.push(line);
      }
    }

    const prompt = promptLines.join(" ").replace(/^(q(uestion)?\s*)?\d+[.)]\s*/i, "").trim();
    const label = `Question ${bi + 1}`;
    if (!prompt) {
      errors.push(`${label}: missing the question text`);
      return;
    }

    if (options.length > 0) {
      let correct = options.find((o) => o.starred);
      if (!correct && answer) {
        const a = answer.toLowerCase().replace(/[).]$/, "");
        correct = options.find((o) => o.letter === a || o.text.toLowerCase() === a);
      }
      if (options.length < 2) errors.push(`${label}: needs at least two choices`);
      else if (!correct) errors.push(`${label}: mark the correct choice with * or an "Answer:" line`);
      else questions.push({ type: "choice", prompt, options: options.map((o) => o.text), expectedAnswer: correct.text, hint, explanation });
      return;
    }

    if (!answer) {
      errors.push(`${label}: add an "Answer:" line`);
      return;
    }
    if (/^(true|false|t|f)$/i.test(answer)) {
      const value = /^t/i.test(answer) ? "True" : "False";
      questions.push({ type: "truefalse", prompt, options: ["True", "False"], expectedAnswer: value, hint, explanation });
    } else if (/^-?[\d,]*\.?\d+(\s*\/\s*\d+)?$/.test(answer.replace(/\s+/g, ""))) {
      questions.push({ type: "number", prompt, expectedAnswer: answer.replace(/\s+/g, ""), hint, explanation });
    } else {
      const answers = answer.split("|").map((a) => a.trim()).filter(Boolean);
      questions.push({ type: "text", prompt, expectedAnswer: answers[0], acceptedAnswers: answers.slice(1), hint, explanation });
    }
  });

  return { questions, errors };
}
