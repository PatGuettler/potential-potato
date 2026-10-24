import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import { createApi, memoryStore, type Session } from "../shared/core/api";
import { lessonsFromCsv, parseCSV } from "../shared/core/lessons";
import { buildDemoDatabase, DEMO_PASSWORD, emptyDatabase } from "../shared/core/seed";
import { gradeQuestion } from "../shared/core/grading";
import { env } from "./helpers";

const lessons = ["science", "technology", "engineering", "mathematics"].flatMap((n) =>
  lessonsFromCsv(fs.readFileSync(`data/lessons/${n}.csv`, "utf-8")),
);
let n = 0;

async function demoApi() {
  const store = memoryStore(await buildDemoDatabase(lessons, async (p) => `h:${p}`, () => `id${++n}`));
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

test("CSV parser handles quoted multi-line fields and escaped quotes", () => {
  const rows = parseCSV('a,b\n"x\ny","say ""hi"""\n');
  assert.deepEqual(rows, [{ a: "x\ny", b: 'say "hi"' }]);
});

test("bundled lessons load with quizzes", () => {
  assert.equal(lessons.length, 13);
  assert.ok(lessons.filter((l) => l.quiz).length >= 12);
});

test("grading by question type", () => {
  assert.ok(gradeQuestion({ id: "1", prompt: "", type: "number", expectedAnswer: "97" }, " 97.0 ").isCorrect);
  assert.ok(!gradeQuestion({ id: "1", prompt: "", type: "choice", expectedAnswer: "Force" }, "Energy").isCorrect);
  assert.ok(gradeQuestion({ id: "1", prompt: "", type: "text", expectedAnswer: "energy" }, "Energy").isCorrect);
});

test("students never receive answer keys", async () => {
  const { call, as } = await demoApi();
  await as("student");
  const lesson: any = (await call("GET", "/api/lessons/sci001")).body;
  assert.equal(lesson.answer, undefined);
  assert.equal(lesson.answerGuide, undefined);
  assert.ok(lesson.quiz.sections[0].questions.every((q: any) => q.expectedAnswer === ""));
});

test("a lesson can only be completed once every question is right; score is first-try accuracy", async () => {
  const { call, as } = await demoApi();
  await as("student");
  assert.equal((await call("POST", "/api/progress", { lessonId: "sci003", isCompleted: true })).status, 400);
  await call("POST", "/api/lessons/sci003/questions/sci003-q1/validate", { answer: "A gas is produced" });
  await call("POST", "/api/lessons/sci003/questions/sci003-q2/validate", { answer: "Products" });
  await call("POST", "/api/lessons/sci003/questions/sci003-q2/validate", { answer: "Reactants" });
  const done: any = (await call("POST", "/api/progress", { lessonId: "sci003", isCompleted: true })).body;
  assert.equal(done.status, "completed");
  assert.equal(done.score, 50);
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
  const alex = subs.find((s) => s.userId === "u-student" && s.status === "pending");
  assert.equal((await call("POST", `/api/teacher/submissions/${alex.id}/review`, { score: 88, feedback: "Nice" })).status, 200);
  await as("parent");
  const report: any = (await call("GET", "/api/students/u-student/report")).body;
  assert.ok(report.submissions.some((s: any) => s.teacherScore === 88 && s.feedback === "Nice"));
});

test("first registered account becomes admin; later self-registrations are students", async () => {
  const api = createApi(env(memoryStore(emptyDatabase(lessons))));
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
  assert.equal((await call("POST", "/api/progress", { lessonId: "eng003", isCompleted: true })).status, 400);
  assert.equal(db().progress.length, before);
});
