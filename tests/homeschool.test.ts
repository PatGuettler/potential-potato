import { test } from "node:test";
import assert from "node:assert/strict";
import { createApi, memoryStore, type Session } from "../shared/core/api";
import { emptyDatabase } from "../shared/core/seed";
import { env } from "./helpers";

async function freshFamily() {
  const store = memoryStore(emptyDatabase("Test Co-op"));
  const api = createApi(env(store));
  const s: Session = {};
  const call = (method: string, path: string, body?: unknown, session = s) => api({ method, path, body, session });
  await call("POST", "/api/register", { username: "boss", password: "password1" }, {}); // first account: admin
  const r: any = await call("POST", "/api/register", { username: "mom", password: "password1", lastName: "Rivera", accountType: "family", schoolName: "Rivera Academy" });
  assert.equal(r.body.role, "parent");
  const kidA: any = (await call("POST", "/api/family/children", { firstName: "Ana", username: "ana", password: "secret1", gradeLevel: "Grade 3" })).body;
  const kidB: any = (await call("POST", "/api/family/children", { firstName: "Ben", username: "ben", password: "secret1", gradeLevel: "Grade 9" })).body;
  return { store, call, s, kidA, kidB };
}

test("a family signs up, adds children, and gets a home-school class", async () => {
  const { call, kidA, kidB } = await freshFamily();
  const fam: any = (await call("GET", "/api/family")).body;
  assert.equal(fam.settings.schoolName, "Rivera Academy");
  assert.deepEqual(fam.children.map((c: any) => c.firstName), ["Ana", "Ben"]);
  const cls: any = (await call("GET", `/api/teacher/classrooms/${fam.familyClassId}`)).body;
  assert.deepEqual(cls.students.map((x: any) => x.id).sort(), [kidA.id, kidB.id].sort());
  assert.equal(cls.students[0].lastName, "Rivera", "children inherit the family last name");
});

test("parents assign a course to one child; the other child doesn't get it", async () => {
  const { call, kidA, kidB } = await freshFamily();
  const fam: any = (await call("GET", "/api/family")).body;
  const r: any = (await call("POST", `/api/teacher/classrooms/${fam.familyClassId}/assign-course`, { courseId: "math-3", studentIds: [kidA.id], startDate: "2030-09-02", spacingDays: 1 })).body;
  assert.ok(r.created >= 4);
  const ana: any = (await call("GET", `/api/students/${kidA.id}/report`)).body;
  const ben: any = (await call("GET", `/api/students/${kidB.id}/report`)).body;
  assert.equal(ana.assignments.length, r.created);
  assert.equal(ben.assignments.length, 0);
  // 2030-09-07 is a Saturday: due dates skip weekends.
  assert.ok(ana.assignments.every((a: any) => ![0, 6].includes(new Date(a.dueDate).getUTCDay())));
  const fam2: any = (await call("GET", "/api/family")).body;
  assert.equal(fam2.children.find((c: any) => c.id === kidA.id).courses[0].id, "math-3");
});

test("parents can't see or add other families' children", async () => {
  const { call, kidA } = await freshFamily();
  const other: Session = {};
  await call("POST", "/api/register", { username: "dad2", password: "password1", accountType: "family" }, other);
  assert.equal((await call("GET", `/api/students/${kidA.id}/report`, undefined, other)).status, 403);
  const kids: any = (await call("GET", "/api/teacher/students", undefined, other)).body;
  assert.equal(kids.length, 0);
  assert.equal((await call("POST", `/api/students/${kidA.id}/attendance`, { date: "2030-09-02", minutes: 30, subject: "Reading" }, other)).status, 403);
});

test("lesson time is logged as attendance automatically, plus manual entries", async () => {
  const { call, kidA } = await freshFamily();
  const kid: Session = {};
  await call("POST", "/api/login", { username: "ana", password: "secret1" }, kid);
  await call("POST", "/api/lessons/math-3-1-1/start", undefined, kid);
  await call("POST", "/api/progress", { lessonId: "math-3-1-1", timeSpent: 25 }, kid);
  await call("POST", "/api/progress", { lessonId: "math-3-1-1", timeSpent: 10 }, kid);
  await call("POST", `/api/students/${kidA.id}/attendance`, { date: "2030-09-02", minutes: 60, subject: "Field trip", note: "Science museum" });
  const att: any = (await call("GET", `/api/students/${kidA.id}/attendance`)).body;
  const auto = att.entries.find((e: any) => e.source === "auto");
  assert.equal(auto.minutes, 35, "same-day lesson time is merged");
  assert.equal(auto.subject, "mathematics");
  assert.ok(att.entries.some((e: any) => e.subject === "Field trip"));
  assert.equal((await call("POST", `/api/students/${kidA.id}/attendance`, { date: "2030-09-02", minutes: 30, subject: "x" }, kid)).status, 403, "students can't edit records");
});

test("transcripts compute credits and GPA and suggest finished high school courses", async () => {
  const { call, kidB } = await freshFamily();
  await call("POST", `/api/students/${kidB.id}/transcript`, { courseTitle: "Algebra I", subject: "mathematics", gradeLevel: 9, schoolYear: "2030–2031", credits: 1, grade: "A" });
  const t: any = (await call("POST", `/api/students/${kidB.id}/transcript`, { courseTitle: "Biology", subject: "science", gradeLevel: 9, schoolYear: "2030–2031", credits: 1, grade: "B" })).body;
  assert.equal(t.totalCredits, 2);
  assert.equal(t.gpa, 3.5);
  assert.equal((await call("POST", `/api/students/${kidB.id}/transcript`, { courseTitle: "X", subject: "x", gradeLevel: 7, schoolYear: "y", credits: 1, grade: "A" })).status, 400);
});

test("co-op classes respect capacity and grade range", async () => {
  const { call, kidA, kidB } = await freshFamily();
  const admin: Session = {};
  await call("POST", "/api/login", { username: "boss", password: "password1" }, admin);
  const cls: any = (await call("POST", "/api/teacher/classrooms", { name: "Lego Robotics", openEnrollment: true, capacity: 1, gradeMin: 3, gradeMax: 5, fee: "$20" }, admin)).body;
  const list: any = (await call("GET", "/api/coop/classes")).body;
  assert.equal(list[0].seatsLeft, 1);
  assert.equal((await call("POST", `/api/coop/classes/${cls.id}/enroll`, { studentId: kidB.id })).status, 400, "Grade 9 is out of range");
  assert.equal((await call("POST", `/api/coop/classes/${cls.id}/enroll`, { studentId: kidA.id })).status, 200);
  const other: Session = {};
  await call("POST", "/api/register", { username: "dad2", password: "password1", accountType: "family" }, other);
  const kidC: any = (await call("POST", "/api/family/children", { firstName: "Cy", username: "cyrus", password: "secret1", gradeLevel: "Grade 4" }, other)).body;
  assert.equal((await call("POST", `/api/coop/classes/${cls.id}/enroll`, { studentId: kidC.id }, other)).status, 409, "class is full");
  assert.equal((await call("POST", `/api/coop/classes/${cls.id}/enroll`, { studentId: kidA.id }, other)).status, 403);
});
