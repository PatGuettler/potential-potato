import fs from "fs/promises";
import path from "path";
import os from "os";
import request from "supertest";
import type { Express } from "express";

const LESSON_CSV_HEADER =
  "id,title,category,summary,content,answerGuide,answer,difficulty,estimatedMinutes,tags,authorId,createdAt,schoolId\n";

const CATEGORIES = ["science", "technology", "engineering", "mathematics"] as const;

export async function initTestDataDir(root: string): Promise<void> {
  const lessonsDir = path.join(root, "data", "lessons");
  const progressDir = path.join(root, "data", "progress");
  await fs.mkdir(lessonsDir, { recursive: true });
  await fs.mkdir(progressDir, { recursive: true });

  for (const category of CATEGORIES) {
    await fs.writeFile(path.join(lessonsDir, `${category}.csv`), LESSON_CSV_HEADER);
  }

  await fs.writeFile(
    path.join(progressDir, "progress.csv"),
    "userId,lessonId,isCompleted,score,lastAccessed\n",
  );
  await fs.writeFile(
    path.join(progressDir, "questions.csv"),
    "userId,lessonId,questionId,isCorrect,lastAnswered\n",
  );
}

export async function setupTestEnvironment(): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "stemgenius-test-"));
  process.env.STEMGENIUS_DATA_DIR = tmpDir;
  process.env.STEMGENIUS_USERS_FILE = path.join(tmpDir, "users.json");
  process.env.NODE_ENV = "test";

  await initTestDataDir(tmpDir);

  const { resetStorageForTests } = await import("../server/storage");
  resetStorageForTests();

  const { fileUserManager } = await import("../server/fileAuth");
  fileUserManager.clearCache();

  return tmpDir;
}

export async function buildTestApp(): Promise<Express> {
  const { createApp } = await import("../server/createApp");
  return createApp();
}

export type UserRole = "student" | "teacher" | "admin";

export function lessonPayload(overrides: Record<string, unknown> = {}) {
  return {
    title: "Unit Test Lesson",
    description: "Summary for automated tests",
    categoryId: "science",
    difficulty: "easy",
    estimatedDuration: 20,
    content: "Read the material and answer the prompt.",
    answer: "photosynthesis chlorophyll sunlight energy",
    answerGuide: "Discuss light-dependent reactions.",
    schoolId: "default-school",
    ...overrides,
  };
}

export function structuredLessonContent() {
  return {
    sections: [
      {
        id: "section-1",
        title: "Quiz",
        questions: [
          {
            id: "q1",
            type: "text",
            prompt: "What is 2+2?",
            expectedAnswer: "four",
            caseSensitive: false,
          },
          {
            id: "q2",
            type: "number",
            prompt: "Enter pi to one decimal",
            expectedAnswer: "3.1",
            caseSensitive: false,
          },
        ],
      },
    ],
  };
}

/** Register (auto-login) and return a supertest agent with session cookie. */
export async function registerUser(
  app: Express,
  opts: {
    username: string;
    password?: string;
    role?: UserRole;
  },
): Promise<request.SuperAgentTest> {
  const agent = request.agent(app);
  const password = opts.password ?? "test-password-123";
  const res = await agent.post("/api/register").send({
    username: opts.username,
    password,
    role: opts.role ?? "student",
  });
  if (res.status >= 400) {
    throw new Error(`Register failed (${res.status}): ${JSON.stringify(res.body)}`);
  }
  return agent;
}

export async function loginUser(
  app: Express,
  username: string,
  password = "test-password-123",
): Promise<request.SuperAgentTest> {
  const agent = request.agent(app);
  const res = await agent.post("/api/login").send({ username, password });
  if (res.status >= 400) {
    throw new Error(`Login failed (${res.status}): ${JSON.stringify(res.body)}`);
  }
  return agent;
}
