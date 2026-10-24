import { test } from "node:test";
import assert from "node:assert/strict";
import { parseQuizText } from "../shared/core/quizText";

test("pasted questions become choice, true/false, number, and short-answer questions", () => {
  const { questions, errors } = parseQuizText(`1. What is 3 × 4?
a) 7
*b) 12
c) 34
Explanation: Three groups of four.

2. The sun is a star.
Answer: true

Q3) Solve 2x = 10.
Answer: 5

4. Which organelle holds DNA?
Answer: nucleus | the nucleus
Hint: control center

5. Pick the prime.
A. 9
B. 11
Answer: B`);
  assert.deepEqual(errors, []);
  assert.deepEqual(questions.map((q) => q.type), ["choice", "truefalse", "number", "text", "choice"]);
  assert.equal(questions[0].expectedAnswer, "12");
  assert.equal(questions[0].explanation, "Three groups of four.");
  assert.equal(questions[1].expectedAnswer, "True");
  assert.equal(questions[2].prompt, "Solve 2x = 10.");
  assert.deepEqual(questions[3].acceptedAnswers, ["the nucleus"]);
  assert.equal(questions[3].hint, "control center");
  assert.equal(questions[4].expectedAnswer, "11");
});

test("pasted questions report what's missing", () => {
  const { questions, errors } = parseQuizText("1. Pick one\na) x\nb) y\n\n2. No answer here");
  assert.equal(questions.length, 0);
  assert.equal(errors.length, 2);
});
