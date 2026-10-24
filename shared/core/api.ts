/**
 * The whole STEM Academy API as a transport-agnostic router.
 *
 * The Express server mounts it behind real sessions and a JSON file store; the
 * GitHub Pages demo runs the exact same code in the browser against localStorage.
 */
import type {
  Activity,
  ActivityType,
  Assignment,
  Classroom,
  Database,
  Lesson,
  LessonContent,
  Progress,
  PublicUser,
  Role,
  User,
} from "./types";
import { difficultyLevels, userRoles } from "./types";
import { lessonQuestions, parseStructuredContent } from "./lessons";
import { gradeQuestion, scoreWrittenResponse } from "./grading";

export interface Session {
  userId?: string;
}

export interface ApiRequest {
  method: string;
  path: string;
  body?: any;
  session: Session;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

export interface ApiEnv {
  load(): Promise<Database>;
  save(db: Database): Promise<void>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  newId(): string;
  /** Lets self-registration create accounts beyond the first admin. Defaults to true. */
  allowSelfRegistration?: boolean;
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const fail = (status: number, message: string): never => {
  throw new HttpError(status, message);
};

type Ctx = {
  db: Database;
  user: User;
  params: Record<string, string>;
  body: any;
  session: Session;
  env: ApiEnv;
  dirty: () => void;
};

type Handler = (ctx: Ctx) => unknown | Promise<unknown>;
type PublicHandler = (ctx: Omit<Ctx, "user"> & { user?: User }) => unknown | Promise<unknown>;

interface Route {
  method: string;
  regex: RegExp;
  keys: string[];
  roles: readonly Role[] | null;
  handler: Handler | PublicHandler;
}

const MAX_ACTIVITY = 1000;
const ALL: readonly Role[] = userRoles;
const STAFF: readonly Role[] = ["teacher", "admin"];

// ---------------------------------------------------------------- helpers

const now = () => new Date().toISOString();

export function publicUser(u: User): PublicUser {
  const { passwordHash: _omit, ...rest } = u;
  return rest;
}

export const displayName = (u: Pick<User, "firstName" | "lastName" | "username">) =>
  `${u.firstName} ${u.lastName}`.trim() || u.username;

function str(value: unknown, field: string, { required = true, max = 20000 } = {}): string {
  if (value === undefined || value === null || value === "") {
    if (required) fail(400, `${field} is required`);
    return "";
  }
  if (typeof value !== "string") fail(400, `${field} must be text`);
  const s = (value as string).trim();
  if (required && !s) fail(400, `${field} is required`);
  if (s.length > max) fail(400, `${field} is too long`);
  return s;
}

function findUser(db: Database, id: string) {
  return db.users.find((u) => u.id === id);
}

function findLesson(db: Database, id: string, includeArchived = false) {
  const lesson = db.lessons.find((l) => l.id === id && (includeArchived || l.isActive));
  return lesson ?? fail(404, "Lesson not found");
}

function stripQuiz(content: LessonContent): LessonContent {
  return {
    sections: content.sections.map((s) => ({
      ...s,
      questions: s.questions.map(({ expectedAnswer: _e, ...q }) => ({ ...q, expectedAnswer: "" })),
    })),
  };
}

/** Students and parents never receive answer keys or teacher notes. */
function lessonFor(user: User, lesson: Lesson) {
  if (user.role === "teacher" || user.role === "admin") return lesson;
  const structured = parseStructuredContent(lesson.content);
  return {
    ...lesson,
    content: structured ? JSON.stringify(stripQuiz(structured)) : lesson.content,
    quiz: lesson.quiz ? stripQuiz(lesson.quiz) : undefined,
    answerGuide: undefined,
    answer: undefined,
    hasWrittenResponse: !!lesson.answer,
  };
}

function classroomsForStudent(db: Database, studentId: string) {
  return db.classrooms.filter((c) => c.studentIds.includes(studentId));
}

function visibleStudentIds(db: Database, user: User): Set<string> {
  switch (user.role) {
    case "admin":
      return new Set(db.users.filter((u) => u.role === "student").map((u) => u.id));
    case "teacher":
      return new Set(db.classrooms.filter((c) => c.teacherId === user.id).flatMap((c) => c.studentIds));
    case "parent":
      return new Set(user.childIds);
    default:
      return new Set([user.id]);
  }
}

function assertCanViewStudent(db: Database, user: User, studentId: string) {
  const student = findUser(db, studentId);
  if (!student || student.role !== "student") fail(404, "Student not found");
  if (!visibleStudentIds(db, user).has(studentId)) fail(403, "You don't have access to this student");
  return student!;
}

function ownClassroom(db: Database, user: User, id: string): Classroom {
  const c = db.classrooms.find((x) => x.id === id) ?? fail(404, "Classroom not found");
  if (user.role !== "admin" && c.teacherId !== user.id) fail(403, "Not your classroom");
  return c;
}

function getProgress(db: Database, userId: string, lessonId: string) {
  return db.progress.find((p) => p.userId === userId && p.lessonId === lessonId);
}

function ensureProgress(db: Database, userId: string, lessonId: string): Progress {
  let p = getProgress(db, userId, lessonId);
  if (!p) {
    p = {
      userId,
      lessonId,
      status: "in_progress",
      isCompleted: false,
      score: 0,
      timeSpent: 0,
      startedAt: now(),
      lastAccessed: now(),
    };
    db.progress.push(p);
  }
  return p;
}

function quizScore(db: Database, userId: string, lesson: Lesson) {
  const questions = lessonQuestions(lesson);
  const perQuestion: Record<string, { isCorrect: boolean; attempts: number }> = {};
  for (const qp of db.questionProgress) {
    if (qp.userId === userId && qp.lessonId === lesson.id) {
      perQuestion[qp.questionId] = { isCorrect: qp.isCorrect, attempts: qp.attempts };
    }
  }
  const correct = questions.filter((q) => perQuestion[q.id]?.isCorrect).length;
  const firstTry = questions.filter((q) => perQuestion[q.id]?.isCorrect && perQuestion[q.id].attempts === 1).length;
  const pct = (n: number) => (questions.length ? Math.round((n / questions.length) * 100) : 0);
  return {
    total: questions.length,
    correct,
    percent: pct(correct),
    /** Share answered right on the first try: the score recorded when a lesson is completed. */
    masteryPercent: pct(firstTry),
    perQuestion,
  };
}

function log(db: Database, env: ApiEnv, entry: Omit<Activity, "id" | "createdAt">) {
  db.activity.unshift({ ...entry, id: env.newId(), createdAt: now() });
  if (db.activity.length > MAX_ACTIVITY) db.activity.length = MAX_ACTIVITY;
}

function assignmentStatus(db: Database, studentId: string, a: Assignment) {
  const p = getProgress(db, studentId, a.lessonId);
  const status = p?.status ?? "not_started";
  const overdue = status !== "completed" && new Date(a.dueDate).getTime() < Date.now();
  return { status, score: p?.score ?? null, completedAt: p?.completedAt ?? null, overdue };
}

function assignmentsForStudent(db: Database, studentId: string) {
  const classes = classroomsForStudent(db, studentId);
  const classIds = new Set(classes.map((c) => c.id));
  return db.assignments
    .filter((a) => classIds.has(a.classroomId))
    .map((a) => {
      const lesson = db.lessons.find((l) => l.id === a.lessonId);
      const classroom = classes.find((c) => c.id === a.classroomId)!;
      return {
        ...a,
        lessonTitle: lesson?.title ?? "(removed lesson)",
        categoryId: lesson?.categoryId,
        estimatedDuration: lesson?.estimatedDuration,
        classroomName: classroom.name,
        ...assignmentStatus(db, studentId, a),
      };
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function studentSummary(db: Database, studentId: string) {
  const progress = db.progress.filter((p) => p.userId === studentId);
  const completed = progress.filter((p) => p.isCompleted);
  const assignments = assignmentsForStudent(db, studentId);
  const lastActive = db.activity.find((a) => a.studentId === studentId)?.createdAt ?? null;
  return {
    lessonsCompleted: completed.length,
    lessonsInProgress: progress.filter((p) => p.status === "in_progress").length,
    averageScore: completed.length
      ? Math.round(completed.reduce((s, p) => s + (p.score || 0), 0) / completed.length)
      : null,
    minutesSpent: progress.reduce((s, p) => s + (p.timeSpent || 0), 0),
    assignmentsTotal: assignments.length,
    assignmentsDone: assignments.filter((a) => a.status === "completed").length,
    assignmentsOverdue: assignments.filter((a) => a.overdue).length,
    pendingReviews: db.submissions.filter((s) => s.userId === studentId && s.status === "pending").length,
    lastActive,
  };
}

function categoryBreakdown(db: Database, studentId: string) {
  return db.categories.map((c) => {
    const lessons = db.lessons.filter((l) => l.isActive && l.categoryId === c.id);
    const done = lessons.filter((l) => getProgress(db, studentId, l.id)?.isCompleted);
    return { categoryId: c.id, name: c.name, total: lessons.length, completed: done.length };
  });
}

function decorateActivity(db: Database, items: Activity[]) {
  return items.map((a) => {
    const actor = findUser(db, a.actorId);
    const student = a.studentId ? findUser(db, a.studentId) : undefined;
    return {
      ...a,
      actorName: actor ? displayName(actor) : "Someone",
      studentName: student ? displayName(student) : undefined,
      lessonTitle: a.lessonId ? db.lessons.find((l) => l.id === a.lessonId)?.title : undefined,
    };
  });
}

function scopedActivity(db: Database, user: User, limit = 25) {
  if (user.role === "admin") return decorateActivity(db, db.activity.slice(0, limit));
  const students = visibleStudentIds(db, user);
  return decorateActivity(
    db,
    db.activity
      .filter((a) => a.actorId === user.id || (a.studentId && students.has(a.studentId)))
      .slice(0, limit),
  );
}

function submissionView(db: Database, s: Database["submissions"][number]) {
  const student = findUser(db, s.userId);
  const lesson = db.lessons.find((l) => l.id === s.lessonId);
  const reviewer = s.reviewedBy ? findUser(db, s.reviewedBy) : undefined;
  return {
    ...s,
    studentName: student ? displayName(student) : "Unknown",
    lessonTitle: lesson?.title ?? "(removed lesson)",
    rubric: lesson?.answer,
    reviewerName: reviewer ? displayName(reviewer) : undefined,
  };
}

function validateLessonBody(body: any, existing?: Lesson): Partial<Lesson> {
  const difficulty = (body.difficulty ?? existing?.difficulty) as string;
  if (!difficultyLevels.includes(difficulty as any)) fail(400, "difficulty must be easy, medium, or hard");
  const categoryId = str(body.categoryId ?? existing?.categoryId, "categoryId", { max: 64 });
  const duration = Number(body.estimatedDuration ?? existing?.estimatedDuration ?? 30);
  let quiz: LessonContent | undefined = existing?.quiz;
  if (body.quiz !== undefined) {
    quiz = body.quiz && Array.isArray(body.quiz.sections) ? { sections: body.quiz.sections } : undefined;
  }
  return {
    title: str(body.title ?? existing?.title, "title", { max: 200 }),
    description: str(body.description ?? existing?.description, "description", { required: false, max: 2000 }),
    content: str(body.content ?? existing?.content, "content", { required: false, max: 200000 }),
    quiz,
    categoryId,
    difficulty: difficulty as Lesson["difficulty"],
    estimatedDuration: Number.isFinite(duration) && duration > 0 ? Math.round(duration) : 30,
    programmingLanguage: str(body.programmingLanguage ?? existing?.programmingLanguage, "programmingLanguage", { required: false, max: 40 }) || undefined,
    answerGuide: str(body.answerGuide ?? existing?.answerGuide, "answerGuide", { required: false, max: 50000 }) || undefined,
    answer: str(body.answer ?? existing?.answer, "answer", { required: false, max: 50000 }) || undefined,
    tags: Array.isArray(body.tags) ? body.tags.map(String).slice(0, 20) : existing?.tags ?? [],
  };
}

function joinCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

// ---------------------------------------------------------------- routes

const routes: Route[] = [];

function on(method: string, pattern: string, roles: readonly Role[], handler: Handler) {
  addRoute(method, pattern, roles, handler);
}

/** Registers a route that works without signing in. */
function pub(method: string, pattern: string, handler: PublicHandler) {
  addRoute(method, pattern, null, handler);
}

function addRoute(method: string, pattern: string, roles: readonly Role[] | null, handler: Handler | PublicHandler) {
  const keys: string[] = [];
  const regex = new RegExp(
    "^" + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), "([^/]+)")) + "/?$",
  );
  routes.push({ method, regex, keys, roles, handler });
}

// ---- auth

pub("GET", "/api/org", ({ db }) => ({ organizationName: db.organizationName }));

pub("GET", "/api/auth/setup-needed", ({ db }) => ({
  setupNeeded: !db.users.some((u) => u.role === "admin"),
}));

pub("POST", "/api/login", async ({ db, body, session, env, dirty }) => {
  const username = str(body?.username, "username", { max: 100 }).toLowerCase();
  const password = str(body?.password, "password", { max: 200 });
  const user = db.users.find((u) => u.username.toLowerCase() === username);
  if (!user || !(await env.verifyPassword(password, user.passwordHash))) {
    fail(401, "Invalid username or password");
  }
  if (!user!.active) fail(403, "This account has been deactivated. Contact your administrator.");
  user!.lastLoginAt = now();
  session.userId = user!.id;
  dirty();
  return publicUser(user!);
});

pub("POST", "/api/register", async ({ db, body, session, env, dirty }) => {
  const firstAccount = !db.users.some((u) => u.role === "admin");
  if (!firstAccount && env.allowSelfRegistration === false) {
    fail(403, "Self-registration is disabled. Ask your administrator for an account.");
  }
  const username = str(body?.username, "username", { max: 50 }).toLowerCase();
  if (!/^[a-z0-9._-]{3,50}$/.test(username)) fail(400, "Username must be 3+ letters, numbers, dots, dashes or underscores");
  const password = str(body?.password, "password", { max: 200 });
  if (password.length < 8) fail(400, "Password must be at least 8 characters");
  if (db.users.some((u) => u.username.toLowerCase() === username)) fail(409, "That username is taken");
  const user: User = {
    id: env.newId(),
    username,
    passwordHash: await env.hashPassword(password),
    firstName: str(body?.firstName, "firstName", { required: false, max: 80 }),
    lastName: str(body?.lastName, "lastName", { required: false, max: 80 }),
    email: str(body?.email, "email", { required: false, max: 200 }),
    // The very first account administers the site; everyone after that self-registers as a student.
    role: firstAccount ? "admin" : "student",
    childIds: [],
    active: true,
    createdAt: now(),
    lastLoginAt: now(),
  };
  db.users.push(user);
  session.userId = user.id;
  dirty();
  return publicUser(user);
});

pub("POST", "/api/logout", ({ session }) => {
  delete session.userId;
  return { ok: true };
});

on("GET", "/api/auth/user", ALL, ({ user }) => publicUser(user));

// ---- catalog

on("GET", "/api/categories", ALL, ({ db }) =>
  db.categories.map((c) => {
    const lessons = db.lessons.filter((l) => l.isActive && l.categoryId === c.id);
    return {
      ...c,
      lessonCount: lessons.length,
      byDifficulty: Object.fromEntries(difficultyLevels.map((d) => [d, lessons.filter((l) => l.difficulty === d).length])),
    };
  }),
);

function lessonList(db: Database, user: User, lessons: Lesson[]) {
  return lessons.map((l) => {
    const ratings = db.ratings.filter((r) => r.lessonId === l.id);
    return {
      ...lessonFor(user, l),
      averageRating: ratings.length ? Math.round((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) * 10) / 10 : 0,
      totalRatings: ratings.length,
      questionCount: lessonQuestions(l).length,
    };
  });
}

on("GET", "/api/lessons", ALL, ({ db, user }) => lessonList(db, user, db.lessons.filter((l) => l.isActive)));

on("GET", "/api/lessons/category/:categoryId", ALL, ({ db, user, params }) =>
  lessonList(db, user, db.lessons.filter((l) => l.isActive && l.categoryId === params.categoryId)),
);

on("GET", "/api/lessons/:id", ALL, ({ db, user, params }) => lessonList(db, user, [findLesson(db, params.id)])[0]);

on("POST", "/api/lessons", STAFF, ({ db, user, body, env, dirty }) => {
  const lesson: Lesson = {
    ...(validateLessonBody(body ?? {}) as Lesson),
    id: env.newId(),
    authorId: user.id,
    isActive: true,
    createdAt: now(),
  };
  db.lessons.push(lesson);
  dirty();
  return lesson;
});

on("PUT", "/api/lessons/:id", STAFF, ({ db, user, params, body, dirty }) => {
  const lesson = findLesson(db, params.id);
  if (user.role !== "admin" && lesson.authorId !== user.id) fail(403, "Only the author or an admin can edit this lesson");
  Object.assign(lesson, validateLessonBody(body ?? {}, lesson), { updatedAt: now() });
  dirty();
  return lesson;
});

on("DELETE", "/api/lessons/:id", STAFF, ({ db, user, params, dirty }) => {
  const lesson = findLesson(db, params.id);
  if (user.role !== "admin" && lesson.authorId !== user.id) fail(403, "Only the author or an admin can delete this lesson");
  // Archive rather than delete so historical progress and grades stay intact.
  lesson.isActive = false;
  db.assignments = db.assignments.filter((a) => a.lessonId !== lesson.id);
  dirty();
  return { ok: true };
});

// ---- learning

on("POST", "/api/lessons/:id/start", ALL, ({ db, user, params, env, dirty }) => {
  const lesson = findLesson(db, params.id);
  if (user.role !== "student") return { ok: true };
  const existing = getProgress(db, user.id, lesson.id);
  const p = ensureProgress(db, user.id, lesson.id);
  p.lastAccessed = now();
  if (!existing) {
    log(db, env, { type: "lesson_started", actorId: user.id, studentId: user.id, lessonId: lesson.id, message: "started a lesson" });
  }
  dirty();
  return p;
});

on("GET", "/api/lessons/:id/progress", ALL, ({ db, user, params }) => {
  const lesson = findLesson(db, params.id);
  const p = getProgress(db, user.id, lesson.id);
  return { ...quizScore(db, user.id, lesson), status: p?.status ?? "not_started", isCompleted: !!p?.isCompleted, timeSpent: p?.timeSpent ?? 0 };
});

on("POST", "/api/lessons/:id/questions/:questionId/validate", ALL, ({ db, user, params, body, env, dirty }) => {
  const lesson = findLesson(db, params.id);
  const question = lessonQuestions(lesson).find((q) => q.id === params.questionId) ?? fail(404, "Question not found");
  const answer = str(body?.answer, "answer", { max: 20000 });
  const result = gradeQuestion(question, answer);

  let qp = db.questionProgress.find((x) => x.userId === user.id && x.lessonId === lesson.id && x.questionId === question.id);
  if (!qp) {
    qp = { userId: user.id, lessonId: lesson.id, questionId: question.id, isCorrect: false, answer: "", attempts: 0, lastUpdated: now() };
    db.questionProgress.push(qp);
  }
  qp.attempts += 1;
  qp.answer = answer;
  qp.isCorrect = qp.isCorrect || result.isCorrect;
  qp.lastUpdated = now();

  if (user.role === "student") {
    const p = ensureProgress(db, user.id, lesson.id);
    p.lastAccessed = now();
    if (!p.isCompleted) p.score = quizScore(db, user.id, lesson).percent;
  }
  dirty();
  return {
    ...result,
    questionId: question.id,
    expectedAnswer: user.role === "student" || user.role === "parent" ? undefined : question.expectedAnswer,
  };
});

on("POST", "/api/lessons/:id/validate-answer", ALL, ({ db, user, params, body, env, dirty }) => {
  const lesson = findLesson(db, params.id);
  const answer = str(body?.studentAnswer, "studentAnswer", { max: 20000 });
  const autoScore = scoreWrittenResponse(answer, lesson.answer);
  if (user.role === "student") {
    db.submissions.push({
      id: env.newId(),
      userId: user.id,
      lessonId: lesson.id,
      answer,
      autoScore,
      status: "pending",
      submittedAt: now(),
    });
    ensureProgress(db, user.id, lesson.id).lastAccessed = now();
    log(db, env, { type: "submission_sent", actorId: user.id, studentId: user.id, lessonId: lesson.id, message: "submitted a written response" });
    dirty();
  }
  return {
    isCorrect: true,
    score: autoScore,
    feedback: "Response submitted! Your teacher will review it and leave feedback.",
  };
});

on("GET", "/api/lessons/:id/submission", ALL, ({ db, user, params }) => {
  const mine = db.submissions.filter((s) => s.userId === user.id && s.lessonId === params.id);
  return mine.length ? submissionView(db, mine[mine.length - 1]) : null;
});

on("POST", "/api/lessons/:id/rate", ALL, ({ db, user, params, body, dirty }) => {
  findLesson(db, params.id);
  const rating = Math.round(Number(body?.rating));
  if (!(rating >= 1 && rating <= 5)) fail(400, "rating must be 1-5");
  const review = str(body?.review, "review", { required: false, max: 2000 }) || undefined;
  const existing = db.ratings.find((r) => r.userId === user.id && r.lessonId === params.id);
  if (existing) Object.assign(existing, { rating, review, createdAt: now() });
  else db.ratings.push({ userId: user.id, lessonId: params.id, rating, review, createdAt: now() });
  dirty();
  return { ok: true };
});

on("GET", "/api/lessons/:id/ratings", ALL, ({ db, params }) =>
  db.ratings
    .filter((r) => r.lessonId === params.id)
    .map((r) => {
      const u = findUser(db, r.userId);
      return { ...r, userName: u ? displayName(u) : "Former user" };
    }),
);

on("GET", "/api/progress", ALL, ({ db, user }) => db.progress.filter((p) => p.userId === user.id));

on("GET", "/api/progress/category/:categoryId", ALL, ({ db, user, params }) => {
  const ids = new Set(db.lessons.filter((l) => l.categoryId === params.categoryId).map((l) => l.id));
  return db.progress.filter((p) => p.userId === user.id && ids.has(p.lessonId));
});

on("POST", "/api/progress", ALL, ({ db, user, body, env, dirty }) => {
  const lesson = findLesson(db, str(body?.lessonId, "lessonId", { max: 100 }));
  if (user.role !== "student") return { ok: true };
  const p = ensureProgress(db, user.id, lesson.id);
  const quiz = quizScore(db, user.id, lesson);
  const minutes = Math.max(0, Math.min(600, Math.round(Number(body?.timeSpent) || 0)));
  p.timeSpent += minutes;
  p.lastAccessed = now();
  if (body?.isCompleted && !p.isCompleted) {
    if (quiz.total > 0 && quiz.correct < quiz.total) fail(400, "Answer every question correctly before completing the lesson");
    p.isCompleted = true;
    p.status = "completed";
    p.completedAt = now();
    p.score = quiz.total > 0 ? quiz.masteryPercent : 100;
    log(db, env, { type: "lesson_completed", actorId: user.id, studentId: user.id, lessonId: lesson.id, message: `completed a lesson (${p.score}%)` });
  } else if (!p.isCompleted) {
    p.score = quiz.percent;
  }
  dirty();
  return p;
});

// ---- student self-service

on("GET", "/api/me/assignments", ["student"], ({ db, user }) => assignmentsForStudent(db, user.id));

on("GET", "/api/me/classrooms", ["student"], ({ db, user }) =>
  classroomsForStudent(db, user.id).map((c) => {
    const t = findUser(db, c.teacherId);
    return { id: c.id, name: c.name, subject: c.subject, teacherName: t ? displayName(t) : "" };
  }),
);

on("POST", "/api/me/join", ["student"], ({ db, user, body, dirty }) => {
  const code = str(body?.code, "code", { max: 20 }).toUpperCase();
  const c = db.classrooms.find((x) => x.joinCode === code) ?? fail(404, "No class found with that code");
  if (!c.studentIds.includes(user.id)) c.studentIds.push(user.id);
  dirty();
  return { id: c.id, name: c.name };
});

on("GET", "/api/activity", ALL, ({ db, user }) => scopedActivity(db, user));

// ---- student reports (teacher, parent, admin, self)

on("GET", "/api/students/:id/report", ALL, ({ db, user, params }) => {
  const student = assertCanViewStudent(db, user, params.id);
  const progress = db.progress
    .filter((p) => p.userId === student.id)
    .map((p) => {
      const l = db.lessons.find((x) => x.id === p.lessonId);
      return { ...p, lessonTitle: l?.title ?? "(removed lesson)", categoryId: l?.categoryId };
    })
    .sort((a, b) => b.lastAccessed.localeCompare(a.lastAccessed));
  return {
    student: publicUser(student),
    classrooms: classroomsForStudent(db, student.id).map((c) => {
      const t = findUser(db, c.teacherId);
      return { id: c.id, name: c.name, subject: c.subject, teacherName: t ? displayName(t) : "" };
    }),
    parents: db.users.filter((u) => u.role === "parent" && u.childIds.includes(student.id)).map((u) => ({ id: u.id, name: displayName(u), email: u.email })),
    summary: studentSummary(db, student.id),
    categories: categoryBreakdown(db, student.id),
    assignments: assignmentsForStudent(db, student.id),
    progress,
    submissions: db.submissions
      .filter((s) => s.userId === student.id)
      .map((s) => submissionView(db, s))
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    notes: db.notes
      .filter((n) => n.studentId === student.id)
      .map((n) => {
        const a = findUser(db, n.authorId);
        return { ...n, authorName: a ? displayName(a) : "Former user", authorRole: a?.role };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    activity: decorateActivity(db, db.activity.filter((a) => a.studentId === student.id).slice(0, 30)),
  };
});

on("POST", "/api/students/:id/notes", ["teacher", "parent", "admin"], ({ db, user, params, body, env, dirty }) => {
  const student = assertCanViewStudent(db, user, params.id);
  const note = { id: env.newId(), studentId: student.id, authorId: user.id, body: str(body?.body, "body", { max: 4000 }), createdAt: now() };
  db.notes.push(note);
  log(db, env, { type: "note_added", actorId: user.id, studentId: student.id, message: `left a note about ${displayName(student)}` });
  dirty();
  return note;
});

// ---- parent

on("GET", "/api/parent/children", ["parent"], ({ db, user }) =>
  user.childIds
    .map((id) => findUser(db, id))
    .filter((s): s is User => !!s)
    .map((s) => ({
      ...publicUser(s),
      summary: studentSummary(db, s.id),
      upcoming: assignmentsForStudent(db, s.id).filter((a) => a.status !== "completed").slice(0, 3),
    })),
);

// ---- teacher

function classroomCard(db: Database, c: Classroom) {
  const assignments = db.assignments.filter((a) => a.classroomId === c.id);
  const slots = assignments.length * c.studentIds.length;
  const done = assignments.reduce(
    (n, a) => n + c.studentIds.filter((s) => getProgress(db, s, a.lessonId)?.isCompleted).length,
    0,
  );
  const teacher = findUser(db, c.teacherId);
  return {
    ...c,
    teacherName: teacher ? displayName(teacher) : "",
    studentCount: c.studentIds.length,
    assignmentCount: assignments.length,
    completionRate: slots ? Math.round((done / slots) * 100) : null,
  };
}

function teacherClassrooms(db: Database, user: User) {
  return db.classrooms.filter((c) => user.role === "admin" || c.teacherId === user.id);
}

on("GET", "/api/teacher/overview", STAFF, ({ db, user }) => {
  const classes = teacherClassrooms(db, user);
  const students = visibleStudentIds(db, user);
  const classIds = new Set(classes.map((c) => c.id));
  const atRisk = Array.from(students)
    .map((id) => findUser(db, id))
    .filter((s): s is User => !!s)
    .map((s) => ({ id: s.id, name: displayName(s), summary: studentSummary(db, s.id) }))
    .filter((s) => s.summary.assignmentsOverdue > 0)
    .sort((a, b) => b.summary.assignmentsOverdue - a.summary.assignmentsOverdue)
    .slice(0, 5);
  return {
    classrooms: classes.map((c) => classroomCard(db, c)),
    studentCount: students.size,
    activeAssignments: db.assignments.filter((a) => classIds.has(a.classroomId) && new Date(a.dueDate).getTime() >= Date.now()).length,
    pendingReviews: db.submissions.filter((s) => s.status === "pending" && students.has(s.userId)).length,
    atRisk,
    activity: scopedActivity(db, user, 15),
  };
});

on("GET", "/api/teacher/classrooms", STAFF, ({ db, user }) => teacherClassrooms(db, user).map((c) => classroomCard(db, c)));

on("POST", "/api/teacher/classrooms", STAFF, ({ db, user, body, env, dirty }) => {
  const c: Classroom = {
    id: env.newId(),
    name: str(body?.name, "name", { max: 120 }),
    subject: str(body?.subject, "subject", { required: false, max: 80 }),
    teacherId: user.id,
    studentIds: [],
    joinCode: joinCode(),
    createdAt: now(),
  };
  db.classrooms.push(c);
  dirty();
  return classroomCard(db, c);
});

on("GET", "/api/teacher/classrooms/:id", STAFF, ({ db, user, params }) => {
  const c = ownClassroom(db, user, params.id);
  const assignments = db.assignments
    .filter((a) => a.classroomId === c.id)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const students = c.studentIds
    .map((id) => findUser(db, id))
    .filter((s): s is User => !!s)
    .sort((a, b) => a.lastName.localeCompare(b.lastName))
    .map((s) => ({
      ...publicUser(s),
      summary: studentSummary(db, s.id),
      grades: Object.fromEntries(assignments.map((a) => [a.id, assignmentStatus(db, s.id, a)])),
    }));
  return {
    classroom: classroomCard(db, c),
    students,
    assignments: assignments.map((a) => {
      const lesson = db.lessons.find((l) => l.id === a.lessonId);
      const finished = c.studentIds.map((s) => getProgress(db, s, a.lessonId)).filter((p) => p?.isCompleted);
      return {
        ...a,
        lessonTitle: lesson?.title ?? "(removed lesson)",
        categoryId: lesson?.categoryId,
        completedCount: finished.length,
        averageScore: finished.length ? Math.round(finished.reduce((s, p) => s + (p!.score || 0), 0) / finished.length) : null,
      };
    }),
  };
});

on("DELETE", "/api/teacher/classrooms/:id", STAFF, ({ db, user, params, dirty }) => {
  const c = ownClassroom(db, user, params.id);
  db.classrooms = db.classrooms.filter((x) => x.id !== c.id);
  db.assignments = db.assignments.filter((a) => a.classroomId !== c.id);
  dirty();
  return { ok: true };
});

on("POST", "/api/teacher/classrooms/:id/students", STAFF, ({ db, user, params, body, dirty }) => {
  const c = ownClassroom(db, user, params.id);
  const ref = str(body?.studentId ?? body?.username, "studentId", { max: 100 }).toLowerCase();
  const student = db.users.find((u) => u.role === "student" && (u.id === ref || u.username.toLowerCase() === ref));
  if (!student) fail(404, "No student with that username");
  if (!c.studentIds.includes(student!.id)) c.studentIds.push(student!.id);
  dirty();
  return { ok: true };
});

on("DELETE", "/api/teacher/classrooms/:id/students/:studentId", STAFF, ({ db, user, params, dirty }) => {
  const c = ownClassroom(db, user, params.id);
  c.studentIds = c.studentIds.filter((s) => s !== params.studentId);
  dirty();
  return { ok: true };
});

on("POST", "/api/teacher/classrooms/:id/assignments", STAFF, ({ db, user, params, body, env, dirty }) => {
  const c = ownClassroom(db, user, params.id);
  const lesson = findLesson(db, str(body?.lessonId, "lessonId", { max: 100 }));
  const due = new Date(str(body?.dueDate, "dueDate", { max: 40 }));
  if (isNaN(due.getTime())) fail(400, "dueDate is not a valid date");
  const a: Assignment = {
    id: env.newId(),
    classroomId: c.id,
    lessonId: lesson.id,
    dueDate: due.toISOString(),
    note: str(body?.note, "note", { required: false, max: 1000 }) || undefined,
    assignedBy: user.id,
    createdAt: now(),
  };
  db.assignments.push(a);
  log(db, env, { type: "assignment_created", actorId: user.id, classroomId: c.id, lessonId: lesson.id, message: `assigned "${lesson.title}" to ${c.name}` });
  dirty();
  return a;
});

on("DELETE", "/api/teacher/assignments/:id", STAFF, ({ db, user, params, dirty }) => {
  const a = db.assignments.find((x) => x.id === params.id) ?? fail(404, "Assignment not found");
  ownClassroom(db, user, a.classroomId);
  db.assignments = db.assignments.filter((x) => x.id !== a.id);
  dirty();
  return { ok: true };
});

on("GET", "/api/teacher/students", STAFF, ({ db }) =>
  db.users
    .filter((u) => u.role === "student" && u.active)
    .map((u) => ({ id: u.id, username: u.username, name: displayName(u), gradeLevel: u.gradeLevel })),
);

on("GET", "/api/teacher/submissions", STAFF, ({ db, user }) => {
  const students = visibleStudentIds(db, user);
  return db.submissions
    .filter((s) => students.has(s.userId))
    .map((s) => submissionView(db, s))
    .sort((a, b) => (a.status === b.status ? b.submittedAt.localeCompare(a.submittedAt) : a.status === "pending" ? -1 : 1));
});

on("POST", "/api/teacher/submissions/:id/review", STAFF, ({ db, user, params, body, env, dirty }) => {
  const s = db.submissions.find((x) => x.id === params.id) ?? fail(404, "Submission not found");
  if (!visibleStudentIds(db, user).has(s.userId)) fail(403, "This student isn't in your classes");
  const score = Math.round(Number(body?.score));
  if (!(score >= 0 && score <= 100)) fail(400, "score must be 0-100");
  Object.assign(s, {
    status: "reviewed",
    teacherScore: score,
    feedback: str(body?.feedback, "feedback", { required: false, max: 4000 }),
    reviewedBy: user.id,
    reviewedAt: now(),
  });
  log(db, env, { type: "submission_reviewed", actorId: user.id, studentId: s.userId, lessonId: s.lessonId, message: `reviewed a written response (${score}%)` });
  dirty();
  return submissionView(db, s);
});

// ---- admin

on("GET", "/api/admin/stats", ["admin"], ({ db, user }) => {
  const byRole = Object.fromEntries(userRoles.map((r) => [r, db.users.filter((u) => u.role === r).length]));
  const weekAgo = Date.now() - 7 * 86400000;
  return {
    organizationName: db.organizationName,
    users: byRole,
    lessons: db.lessons.filter((l) => l.isActive).length,
    classrooms: db.classrooms.length,
    assignments: db.assignments.length,
    completionsThisWeek: db.progress.filter((p) => p.completedAt && new Date(p.completedAt).getTime() > weekAgo).length,
    activeStudentsThisWeek: new Set(
      db.activity.filter((a) => a.studentId && new Date(a.createdAt).getTime() > weekAgo).map((a) => a.studentId),
    ).size,
    pendingReviews: db.submissions.filter((s) => s.status === "pending").length,
    activity: scopedActivity(db, user, 20),
  };
});

on("GET", "/api/admin/users", ["admin"], ({ db }) =>
  db.users
    .map((u) => ({
      ...publicUser(u),
      classroomNames: u.role === "teacher"
        ? db.classrooms.filter((c) => c.teacherId === u.id).map((c) => c.name)
        : classroomsForStudent(db, u.id).map((c) => c.name),
    }))
    .sort((a, b) => userRoles.indexOf(a.role) - userRoles.indexOf(b.role) || a.lastName.localeCompare(b.lastName)),
);

function applyUserFields(db: Database, target: User, body: any) {
  if (body.firstName !== undefined) target.firstName = str(body.firstName, "firstName", { required: false, max: 80 });
  if (body.lastName !== undefined) target.lastName = str(body.lastName, "lastName", { required: false, max: 80 });
  if (body.email !== undefined) target.email = str(body.email, "email", { required: false, max: 200 });
  if (body.gradeLevel !== undefined) target.gradeLevel = str(body.gradeLevel, "gradeLevel", { required: false, max: 40 }) || undefined;
  if (body.role !== undefined) {
    if (!userRoles.includes(body.role)) fail(400, "Invalid role");
    target.role = body.role;
  }
  if (body.active !== undefined) target.active = !!body.active;
  if (body.childIds !== undefined) {
    if (!Array.isArray(body.childIds)) fail(400, "childIds must be a list");
    const students = new Set(db.users.filter((u) => u.role === "student").map((u) => u.id));
    target.childIds = body.childIds.map(String).filter((id: string) => students.has(id));
  }
  if (target.role !== "parent") target.childIds = [];
}

on("POST", "/api/admin/users", ["admin"], async ({ db, body, env, dirty }) => {
  const username = str(body?.username, "username", { max: 50 }).toLowerCase();
  if (!/^[a-z0-9._-]{3,50}$/.test(username)) fail(400, "Username must be 3+ letters, numbers, dots, dashes or underscores");
  if (db.users.some((u) => u.username.toLowerCase() === username)) fail(409, "That username is taken");
  const password = str(body?.password, "password", { max: 200 });
  if (password.length < 8) fail(400, "Password must be at least 8 characters");
  const user: User = {
    id: env.newId(),
    username,
    passwordHash: await env.hashPassword(password),
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    childIds: [],
    active: true,
    createdAt: now(),
  };
  applyUserFields(db, user, body);
  db.users.push(user);
  dirty();
  return publicUser(user);
});

on("PATCH", "/api/admin/users/:id", ["admin"], async ({ db, user, params, body, env, dirty }) => {
  const target = findUser(db, params.id) ?? fail(404, "User not found");
  if (target.id === user.id && (body?.role && body.role !== "admin" || body?.active === false)) {
    fail(400, "You can't demote or deactivate your own account");
  }
  applyUserFields(db, target, body ?? {});
  if (body?.password) {
    const pw = str(body.password, "password", { max: 200 });
    if (pw.length < 8) fail(400, "Password must be at least 8 characters");
    target.passwordHash = await env.hashPassword(pw);
  }
  dirty();
  return publicUser(target);
});

on("DELETE", "/api/admin/users/:id", ["admin"], ({ db, user, params, dirty }) => {
  if (params.id === user.id) fail(400, "You can't delete your own account");
  findUser(db, params.id) ?? fail(404, "User not found");
  db.users = db.users.filter((u) => u.id !== params.id);
  for (const u of db.users) u.childIds = u.childIds.filter((id) => id !== params.id);
  for (const c of db.classrooms) c.studentIds = c.studentIds.filter((id) => id !== params.id);
  dirty();
  return { ok: true };
});

on("PATCH", "/api/admin/settings", ["admin"], ({ db, body, dirty }) => {
  db.organizationName = str(body?.organizationName, "organizationName", { max: 120 });
  dirty();
  return { organizationName: db.organizationName };
});

on("GET", "/api/admin/export", ["admin"], ({ db }) => ({
  ...db,
  exportedAt: now(),
  users: db.users.map(publicUser),
}));

// ---------------------------------------------------------------- entry point

export function createApi(env: ApiEnv) {
  return async function handle(req: ApiRequest): Promise<ApiResponse> {
    const path = req.path.split("?")[0];
    const method = req.method.toUpperCase();
    const candidates = routes.filter((r) => r.regex.test(path));
    if (candidates.length === 0) return { status: 404, body: { message: "Not found" } };
    const route = candidates.find((r) => r.method === method);
    if (!route) return { status: 405, body: { message: "Method not allowed" } };

    try {
      const db = await env.load();
      const params = Object.fromEntries(
        route.keys.map((k, i) => [k, decodeURIComponent(path.match(route.regex)![i + 1])]),
      );
      const user = req.session.userId ? findUser(db, req.session.userId) : undefined;
      if (route.roles) {
        if (!user || !user.active) {
          delete req.session.userId;
          return { status: 401, body: { message: "Unauthorized" } };
        }
        if (!route.roles.includes(user.role)) return { status: 403, body: { message: "Forbidden" } };
      }
      let changed = false;
      const result = await (route.handler as PublicHandler)({
        db,
        user,
        params,
        body: req.body ?? {},
        session: req.session,
        env,
        dirty: () => {
          changed = true;
        },
      });
      if (changed) await env.save(db);
      return { status: 200, body: result ?? null };
    } catch (err) {
      if (err instanceof HttpError) return { status: err.status, body: { message: err.message } };
      console.error(err);
      return { status: 500, body: { message: "Something went wrong" } };
    }
  };
}

export type { ActivityType };
