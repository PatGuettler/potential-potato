import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";
import {
  setupTestEnvironment,
  buildTestApp,
  registerUser,
  loginUser,
  lessonPayload,
  structuredLessonContent,
} from "./helpers";

describe("StemGenius API", () => {
  let app: Express;

  beforeEach(async () => {
    await setupTestEnvironment();
    app = await buildTestApp();
  });

  describe("authentication", () => {
    it("reports setup needed when no users exist", async () => {
      const res = await request(app).get("/api/auth/setup-needed");
      expect(res.status).toBe(200);
      expect(res.body.setupNeeded).toBe(true);
    });

    it("registers, logs in, fetches user, updates profile theme, and logs out", async () => {
      const registerRes = await request(app).post("/api/register").send({
        username: "alice",
        password: "secret123",
        role: "teacher",
        email: "alice@example.com",
      });
      expect(registerRes.status).toBe(200);
      expect(registerRes.body.user.username).toBe("alice");
      expect(registerRes.body.user.role).toBe("teacher");

      const setupRes = await request(app).get("/api/auth/setup-needed");
      expect(setupRes.body.setupNeeded).toBe(false);

      const agent = await loginUser(app, "alice", "secret123");
      const meRes = await agent.get("/api/auth/user");
      expect(meRes.status).toBe(200);
      expect(meRes.body.themePreference).toBe("system");

      const profileRes = await agent.patch("/api/auth/profile").send({
        themePreference: "dark",
        firstName: "Alice",
      });
      expect(profileRes.status).toBe(200);
      expect(profileRes.body.themePreference).toBe("dark");
      expect(profileRes.body.firstName).toBe("Alice");

      const logoutRes = await agent.post("/api/logout");
      expect(logoutRes.status).toBe(200);

      const unauthorized = await agent.get("/api/auth/user");
      expect(unauthorized.status).toBe(401);
    });

    it("rejects invalid login credentials", async () => {
      await request(app).post("/api/register").send({
        username: "bob",
        password: "pass",
      });

      const res = await request(app).post("/api/login").send({
        username: "bob",
        password: "wrong",
      });
      expect(res.status).toBe(401);
    });

    it("rejects duplicate registration", async () => {
      await request(app).post("/api/register").send({
        username: "dup",
        password: "pass",
      });
      const res = await request(app).post("/api/register").send({
        username: "dup",
        password: "pass2",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("categories", () => {
    it("returns STEM categories for authenticated users", async () => {
      const agent = await registerUser(app, { username: "cat-user" });
      const res = await agent.get("/api/categories");
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(4);
      const ids = res.body.map((c: { id: string }) => c.id);
      expect(ids).toContain("science");
      expect(ids).toContain("mathematics");
    });
  });

  describe("lessons — create and interact", () => {
    it("lets teachers create lessons, fetch them, validate answers, and delete them", async () => {
      const teacher = await registerUser(app, {
        username: "teacher1",
        role: "teacher",
      });

      const createRes = await teacher.post("/api/lessons").send(lessonPayload());
      expect(createRes.status).toBe(200);
      const lessonId = createRes.body.id;
      expect(createRes.body.title).toBe("Unit Test Lesson");
      expect(createRes.body.categoryId).toBe("science");
      expect(createRes.body.authorId).toBe("teacher1");

      const listRes = await teacher.get("/api/lessons");
      expect(listRes.status).toBe(200);
      expect(listRes.body.some((l: { id: string }) => l.id === lessonId)).toBe(true);

      const byCategory = await teacher.get("/api/lessons/category/science");
      expect(byCategory.status).toBe(200);
      expect(byCategory.body.some((l: { id: string }) => l.id === lessonId)).toBe(true);

      const getRes = await teacher.get(`/api/lessons/${lessonId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.answer).toBe(lessonPayload().answer);

      const validateCorrect = await teacher
        .post(`/api/lessons/${lessonId}/validate-answer`)
        .send({ studentAnswer: "Photosynthesis uses chlorophyll and sunlight for energy" });
      expect(validateCorrect.status).toBe(200);
      expect(validateCorrect.body.isCorrect).toBe(true);

      const validateWrong = await teacher
        .post(`/api/lessons/${lessonId}/validate-answer`)
        .send({ studentAnswer: "gravity" });
      expect(validateWrong.status).toBe(200);
      expect(validateWrong.body.isCorrect).toBe(false);

      const deleteRes = await teacher.delete(`/api/lessons/${lessonId}`);
      expect(deleteRes.status).toBe(200);

      const missing = await teacher.get(`/api/lessons/${lessonId}`);
      expect(missing.status).toBe(404);
    });

    it("strips answers for students but allows validation when no permission lock", async () => {
      const teacher = await registerUser(app, {
        username: "t2",
        role: "teacher",
      });
      const createRes = await teacher.post("/api/lessons").send(lessonPayload());
      const lessonId = createRes.body.id;

      const student = await registerUser(app, { username: "s1", role: "student" });
      const studentView = await student.get(`/api/lessons/${lessonId}`);
      expect(studentView.status).toBe(200);
      expect(studentView.body.answer).toBeNull();
      expect(studentView.body.answerGuide).toBeNull();

      const validate = await student
        .post(`/api/lessons/${lessonId}/validate-answer`)
        .send({ studentAnswer: "photosynthesis chlorophyll sunlight" });
      expect(validate.status).toBe(200);
      expect(validate.body.isCorrect).toBe(true);
    });

    it("denies lesson creation to students", async () => {
      const student = await registerUser(app, { username: "s2", role: "student" });
      const res = await student.post("/api/lessons").send(lessonPayload());
      expect(res.status).toBe(403);
    });

    it("validates structured quiz questions and tracks progress", async () => {
      const teacher = await registerUser(app, {
        username: "t3",
        role: "teacher",
      });

      const content = structuredLessonContent();
      const createRes = await teacher.post("/api/lessons").send(
        lessonPayload({
          content: JSON.stringify(content),
          answer: null,
        }),
      );
      const lessonId = createRes.body.id;

      const student = await registerUser(app, { username: "s3", role: "student" });

      const textValidate = await student
        .post(`/api/lessons/${lessonId}/questions/q1/validate`)
        .send({ answer: "The answer is four" });
      expect(textValidate.status).toBe(200);
      expect(textValidate.body.isCorrect).toBe(true);
      expect(textValidate.body.expectedAnswer).toBeUndefined();

      const numberValidate = await student
        .post(`/api/lessons/${lessonId}/questions/q2/validate`)
        .send({ answer: "3.1" });
      expect(numberValidate.status).toBe(200);
      expect(numberValidate.body.isCorrect).toBe(true);

      const progressRes = await student.get(`/api/lessons/${lessonId}/progress`);
      expect(progressRes.status).toBe(200);
      expect(progressRes.body.total).toBe(2);
      expect(progressRes.body.correct).toBe(2);
      expect(progressRes.body.percent).toBe(100);
      expect(progressRes.body.perQuestion.q1.isCorrect).toBe(true);
    });
  });

  describe("progress", () => {
    it("records and returns user progress", async () => {
      const teacher = await registerUser(app, {
        username: "t4",
        role: "teacher",
      });
      const lesson = await teacher.post("/api/lessons").send(lessonPayload());
      const lessonId = lesson.body.id;

      const student = await registerUser(app, { username: "s4", role: "student" });
      const upsert = await student.post("/api/progress").send({
        userId: "s4",
        lessonId,
        isCompleted: true,
        score: 85,
      });
      expect(upsert.status).toBe(200);

      const allProgress = await student.get("/api/progress");
      expect(allProgress.status).toBe(200);
      expect(allProgress.body.some((p: { lessonId: string }) => p.lessonId === lessonId)).toBe(
        true,
      );

      const categoryProgress = await student.get("/api/progress/category/science");
      expect(categoryProgress.status).toBe(200);
    });
  });

  describe("teacher classrooms and permissions", () => {
    it("creates classrooms, lists students, and grants lesson permissions", async () => {
      const teacher = await registerUser(app, {
        username: "t5",
        role: "teacher",
      });
      const lesson = await teacher.post("/api/lessons").send(lessonPayload());
      const lessonId = lesson.body.id;

      const classroomRes = await teacher.post("/api/teacher/classrooms").send({
        name: "Period 1",
        description: "Morning class",
      });
      expect(classroomRes.status).toBe(200);
      const classroomId = classroomRes.body.id;

      const listClassrooms = await teacher.get("/api/teacher/classrooms");
      expect(listClassrooms.status).toBe(200);
      expect(listClassrooms.body.some((c: { id: string }) => c.id === classroomId)).toBe(true);

      const studentsRes = await teacher.get(`/api/teacher/classrooms/${classroomId}/students`);
      expect(studentsRes.status).toBe(200);
      expect(Array.isArray(studentsRes.body)).toBe(true);

      const permRes = await teacher.post("/api/teacher/permissions").send({
        studentId: "some-student",
        lessonId,
      });
      expect(permRes.status).toBe(200);
      expect(permRes.body.lessonId).toBe(lessonId);
    });
  });

  describe("proposals and ratings", () => {
    it("creates and lists lesson proposals", async () => {
      const teacher = await registerUser(app, {
        username: "t6",
        role: "teacher",
      });

      const proposalRes = await teacher.post("/api/proposals").send({
        title: "New Unit Proposal",
        description: "Draft curriculum",
        categoryId: "engineering",
        difficulty: "medium",
        content: "Proposal body",
      });
      expect(proposalRes.status).toBe(200);
      const proposalId = proposalRes.body.id;

      const listRes = await teacher.get("/api/proposals");
      expect(listRes.status).toBe(200);
      expect(listRes.body.some((p: { id: string }) => p.id === proposalId)).toBe(true);

      const getRes = await teacher.get(`/api/proposals/${proposalId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.title).toBe("New Unit Proposal");
    });

    it("rates a lesson", async () => {
      const teacher = await registerUser(app, {
        username: "t7",
        role: "teacher",
      });
      const lesson = await teacher.post("/api/lessons").send(lessonPayload());
      const lessonId = lesson.body.id;

      const rateRes = await teacher.post(`/api/lessons/${lessonId}/rate`).send({
        rating: 5,
        comment: "Excellent",
      });
      expect(rateRes.status).toBe(200);

      const ratingsRes = await teacher.get(`/api/lessons/${lessonId}/ratings`);
      expect(ratingsRes.status).toBe(200);
      expect(ratingsRes.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("admin", () => {
    it("allows admins to create lessons via admin endpoint", async () => {
      const admin = await registerUser(app, {
        username: "admin1",
        role: "admin",
      });
      const res = await admin.post("/api/admin/lessons").send(lessonPayload({ title: "Admin Lesson" }));
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Admin Lesson");
    });

    it("denies admin lesson route to teachers", async () => {
      const teacher = await registerUser(app, {
        username: "t8",
        role: "teacher",
      });
      const res = await teacher.post("/api/admin/lessons").send(lessonPayload());
      expect(res.status).toBe(403);
    });
  });
});
