import { test } from "node:test";
import assert from "node:assert/strict";
import { createApi, memoryStore, type Session } from "../shared/core/api";
import { buildCurriculum } from "../shared/curriculum";
import { buildDemoDatabase, DEMO_PASSWORD, emptyDatabase } from "../shared/core/seed";
import { gradeQuestion } from "../shared/core/grading";
import { env } from "./helpers";

let n = 0;

async function demoApi() {
  const store = memoryStore(await buildDemoDatabase(async (p) => `h:${p}`, () => `id${++n}`));
  const db = () => store.current();
  const api = createApi(env(store));
  const session: Session = {};
  const call = (method: string, path: string, body?: unknown) => api({ method, path, body, session });
  const as = async (username: string) => {
    await call("POST", "/api/logout");
    const r = await call("POST", "/api/login", { username, password: DEMO_PASSWORD });
    assert.equal(r.status, 200, `login ${username}`);
  };
  return { call, as, db, api, session };
}

test("bundled curriculum covers K–12 with quizzes on every lesson", () => {
  const { courses, lessons } = buildCurriculum();
  assert.equal(courses.length, 32);
  assert.equal(lessons.length, 128);
  for (let g = 0; g <= 12; g++) {
    const subjects = new Set(courses.filter((c) => c.gradeLevel <= g && g <= (c.gradeLevelMax ?? c.gradeLevel)).map((c) => c.subject));
    assert.ok(subjects.has("mathematics") && subjects.has("science"), `grade ${g} has math and science`);
  }
  assert.ok(lessons.every((l) => l.quiz && l.quiz.sections[0].questions.length >= 4 && l.objectives?.length && l.standards?.length));
});

test("grading by question type", () => {
  assert.ok(gradeQuestion({ id: "1", prompt: "", type: "number", expectedAnswer: "97" }, " 97.0 ").isCorrect);
  assert.ok(!gradeQuestion({ id: "1", prompt: "", type: "choice", expectedAnswer: "Force" }, "Energy").isCorrect);
  assert.ok(gradeQuestion({ id: "1", prompt: "", type: "text", expectedAnswer: "energy" }, "Energy").isCorrect);
  assert.ok(gradeQuestion({ id: "1", prompt: "", type: "text", expectedAnswer: "nucleus", acceptedAnswers: ["cell nucleus"] }, "The cell nucleus.").isCorrect);
  assert.ok(gradeQuestion({ id: "1", prompt: "", type: "number", expectedAnswer: "0.75" }, "3/4").isCorrect);
  assert.ok(gradeQuestion({ id: "1", prompt: "", type: "number", expectedAnswer: "31.4", tolerance: 0.05 }, "31.42").isCorrect);
  assert.ok(!gradeQuestion({ id: "1", prompt: "", type: "choice", expectedAnswer: "Tt", options: ["Tt", "tt"] }, "tt").isCorrect);
});

test("students never receive answer keys", async () => {
  const { call, as } = await demoApi();
  await as("student");
  const lesson: any = (await call("GET", "/api/lessons/sci-7-1-2")).body;
  assert.equal(lesson.answer, undefined);
  assert.equal(lesson.hasWrittenResponse, true);
  assert.ok(lesson.quiz.sections[0].questions.every((q: any) => q.expectedAnswer === "" && !q.explanation && !q.acceptedAnswers && !q.hint));
});

test("a lesson can only be completed once every question is right; score is first-try accuracy", async () => {
  const { call, as } = await demoApi();
  await as("student");
  const L = "sci-7-2-2";
  assert.equal((await call("POST", "/api/progress", { lessonId: L, isCompleted: true })).status, 400);
  const wrong: any = (await call("POST", `/api/lessons/${L}/questions/${L}-q1/validate`, { answer: "500" })).body;
  assert.equal(wrong.isCorrect, false);
  assert.equal(wrong.explanation, undefined, "no explanation after one miss");
  const right: any = (await call("POST", `/api/lessons/${L}/questions/${L}-q1/validate`, { answer: "5000" })).body;
  assert.ok(right.isCorrect && right.explanation, "explanation shown once correct");
  await call("POST", `/api/lessons/${L}/questions/${L}-q2/validate`, { answer: "Used for life processes and lost as heat" });
  await call("POST", `/api/lessons/${L}/questions/${L}-q3/validate`, { answer: "True" });
  await call("POST", `/api/lessons/${L}/questions/${L}-q4/validate`, { answer: "Less energy is available at higher trophic levels" });
  const done: any = (await call("POST", "/api/progress", { lessonId: L, isCompleted: true })).body;
  assert.equal(done.status, "completed");
  assert.equal(done.score, 75);
});

test("courses list progress for students and teachers can assign a whole unit", async () => {
  const { call, as } = await demoApi();
  await as("student");
  const courses: any[] = (await call("GET", "/api/courses")).body as any[];
  const sci7 = courses.find((c) => c.id === "sci-7");
  assert.equal(sci7.lessonCount, 4);
  assert.equal(sci7.completedCount, 2);
  const detail: any = (await call("GET", "/api/courses/sci-7")).body;
  assert.equal(detail.lessons["sci-7-1-1"].status, "completed");
  await as("teacher");
  const r: any = (await call("POST", "/api/teacher/classrooms/c-p4/assign-unit", { courseId: "math-7", unitId: "math-7-u2", startDate: "2030-01-06", spacingDays: 3 })).body;
  assert.deepEqual(r, { created: 0, skipped: 2 }, "already-assigned lessons are skipped");
  const r2: any = (await call("POST", "/api/teacher/classrooms/c-p4/assign-unit", { courseId: "algebra-1", unitId: "algebra-1-u1", startDate: "2030-01-06", spacingDays: 3 })).body;
  assert.equal(r2.created, 2);
});

test("lesson builder: lessons file into a course unit and choice questions need a marked answer", async () => {
  const { call, as } = await demoApi();
  await as("teacher");
  const base = { title: "Ratios Review", categoryId: "mathematics", difficulty: "easy", courseId: "math-6", unitId: "math-6-u1", gradeLevel: 6 };
  const bad = await call("POST", "/api/lessons", { ...base, quiz: { sections: [{ title: "Check", questions: [{ type: "choice", prompt: "2:4 = ?", options: ["1:2", "2:1"], expectedAnswer: "3:4" }] }] } });
  assert.equal(bad.status, 400);
  const ok: any = (await call("POST", "/api/lessons", { ...base, objectives: ["Simplify ratios"], quiz: { sections: [{ title: "Check", questions: [{ type: "choice", prompt: "2:4 = ?", options: ["1:2", "2:1"], expectedAnswer: "1:2", explanation: "Divide by 2." }] }] } })).body;
  const course: any = (await call("GET", "/api/courses/math-6")).body;
  assert.ok(course.units[0].lessonIds.includes(ok.id));
  await call("PUT", `/api/lessons/${ok.id}`, { courseId: "math-6", unitId: "math-6-u2" });
  const moved: any = (await call("GET", "/api/courses/math-6")).body;
  assert.ok(!moved.units[0].lessonIds.includes(ok.id) && moved.units[1].lessonIds.includes(ok.id));
});

test("role scoping: parents see only their children, teachers only their classes", async () => {
  const { call, as } = await demoApi();
  await as("parent");
  assert.equal((await call("GET", "/api/students/u-student/report")).status, 200);
  assert.equal((await call("GET", "/api/students/u-jordan/report")).status, 403);
  assert.equal((await call("GET", "/api/admin/users")).status, 403);
  await as("teacher");
  assert.equal((await call("GET", "/api/teacher/classrooms/c-p2")).status, 200);
  assert.equal((await call("GET", "/api/teacher/classrooms/c-mc")).status, 403);
  await as("student");
  assert.equal((await call("GET", "/api/teacher/overview")).status, 403);
  await call("POST", "/api/logout");
  assert.equal((await call("GET", "/api/lessons")).status, 401);
});

test("teacher review flows through to the parent's report", async () => {
  const { call, as } = await demoApi();
  await as("teacher");
  const subs: any[] = (await call("GET", "/api/teacher/submissions")).body as any[];
  const alex = subs.find((s) => s.userId === "u-jordan" && s.status === "pending");
  assert.equal((await call("POST", `/api/teacher/submissions/${alex.id}/review`, { score: 88, feedback: "Nice" })).status, 200);
  await as("parent2");
  const report: any = (await call("GET", "/api/students/u-jordan/report")).body;
  assert.ok(report.submissions.some((s: any) => s.teacherScore === 88 && s.feedback === "Nice"));
});

test("first registered account becomes admin; later self-registrations are students", async () => {
  const api = createApi(env(memoryStore(emptyDatabase())));
  const r1: any = await api({ method: "POST", path: "/api/register", body: { username: "boss", password: "password1" }, session: {} });
  assert.equal(r1.body.role, "admin");
  const r2: any = await api({ method: "POST", path: "/api/register", body: { username: "kid", password: "password1", role: "admin" }, session: {} });
  assert.equal(r2.body.role, "student");
});

test("admin can link a parent to a child", async () => {
  const { call, as } = await demoApi();
  await as("admin");
  const r: any = await call("PATCH", "/api/admin/users/u-parent2", { childIds: ["u-jordan", "u-riley", "not-a-student"] });
  assert.deepEqual(r.body.childIds, ["u-jordan", "u-riley"]);
});

test("password reset: token works once, signs in, and revokes other sessions", async () => {
  const { call, api } = await demoApi();
  const other: Session = {};
  await api({ method: "POST", path: "/api/login", body: { username: "parent", password: DEMO_PASSWORD }, session: other });
  const forgot: any = (await call("POST", "/api/password/forgot", { login: "parent@example.org" })).body;
  const token = forgot.demoLink.split("/reset/")[1];
  const unknown: any = (await call("POST", "/api/password/forgot", { login: "nobody" })).body;
  assert.equal(unknown.message, forgot.message, "same answer for unknown accounts");
  assert.equal((await call("POST", "/api/password/reset", { token, password: "short" })).status, 400);
  assert.equal((await call("POST", "/api/password/reset", { token, password: "brand-new-pass" })).status, 200);
  assert.equal((await call("GET", "/api/auth/user")).status, 200, "reset signs you in");
  assert.equal((await call("POST", "/api/password/reset", { token, password: "another-pass" })).status, 400, "token is single-use");
  assert.equal((await api({ method: "GET", path: "/api/auth/user", session: other })).status, 401, "old session revoked");
  await call("POST", "/api/logout");
  assert.equal((await call("POST", "/api/login", { username: "parent", password: "brand-new-pass" })).status, 200);
});

test("changing your own password keeps this session and ends the others", async () => {
  const { call, as, api } = await demoApi();
  const other: Session = {};
  await api({ method: "POST", path: "/api/login", body: { username: "teacher", password: DEMO_PASSWORD }, session: other });
  await as("teacher");
  assert.equal((await call("POST", "/api/me/password", { currentPassword: "wrong", newPassword: "whatever123" })).status, 400);
  assert.equal((await call("POST", "/api/me/password", { currentPassword: DEMO_PASSWORD, newPassword: "whatever123" })).status, 200);
  assert.equal((await call("GET", "/api/teacher/overview")).status, 200);
  assert.equal((await api({ method: "GET", path: "/api/teacher/overview", session: other })).status, 401);
});

test("deactivating a user ends their sessions; admin reset links work", async () => {
  const { call, as, api } = await demoApi();
  const kid: Session = {};
  await api({ method: "POST", path: "/api/login", body: { username: "jordan", password: DEMO_PASSWORD }, session: kid });
  await as("admin");
  const r: any = (await call("POST", "/api/admin/users/u-jordan/reset-link")).body;
  assert.match(r.link, /\/reset\//);
  await call("PATCH", "/api/admin/users/u-jordan", { active: false });
  assert.equal((await api({ method: "GET", path: "/api/me/assignments", session: kid })).status, 401);
});

test("a failed request leaves no partial changes", async () => {
  const { call, as, db } = await demoApi();
  await as("student");
  const before = db().progress.length;
  // Starts progress implicitly, then fails validation: nothing should be saved.
  assert.equal((await call("POST", "/api/progress", { lessonId: "sci-7-2-2", isCompleted: true })).status, 400);
  assert.equal(db().progress.length, before);
});
