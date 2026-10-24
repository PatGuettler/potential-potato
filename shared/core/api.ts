/**
 * The whole STEM Academy API as a transport-agnostic router.
 *
 * The Express server mounts it behind real sessions and a JSON file store; the
 * GitHub Pages demo runs the exact same code in the browser against localStorage.
 */
import type {
  AttendanceEntry,
  FamilySettings,
  Activity,
  ActivityType,
  Assignment,
  Classroom,
  Course,
  CourseUnit,
  Database,
  Lesson,
  LessonContent,
  Progress,
  PublicUser,
  Role,
  User,
} from "./types";
import { difficultyLevels, gradePoints, letterGrade, parseGrade, schoolYearOf, userRoles } from "./types";
import { lessonQuestions, parseStructuredContent } from "./lessons";
import { gradeQuestion, scoreWrittenResponse } from "./grading";

export interface Session {
  userId?: string;
  /** The user's sessionVersion at sign-in; a mismatch means the session was revoked. */
  sv?: number;
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

export interface ApiStore {
  /**
   * Runs `fn` against the database. For writes, the store must persist the result atomically
   * when `changed` is true and discard every mutation if `fn` throws.
   */
  transact<T>(write: boolean, fn: (db: Database) => Promise<{ value: T; changed: boolean }>): Promise<T>;
}

export interface ApiEnv {
  store: ApiStore;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  newId(): string;
  sha256(text: string): Promise<string>;
  /** A long, unguessable token for password-reset links. */
  randomToken(): string;
  /** Builds the URL a reset token is delivered in. */
  resetLink(token: string): string;
  /** Delivers a reset link by email. Without it, only admins can hand out reset links. */
  sendPasswordReset?(message: { to: string; name: string; link: string }): Promise<void>;
  /** Demo only: return reset links in the API response instead of emailing them. */
  exposeResetLinks?: boolean;
  /** Lets self-registration create accounts beyond the first admin. Defaults to true. */
  allowSelfRegistration?: boolean;
}

/** An in-memory store; writes run on a copy so a failed request leaves no partial changes. */
export function memoryStore(initial: Database, onSave: (db: Database) => void | Promise<void> = () => {}): ApiStore & { current(): Database } {
  let db = initial;
  return {
    current: () => db,
    async transact(write, fn) {
      if (!write) return (await fn(db)).value;
      const draft = structuredClone(db);
      const { value, changed } = await fn(draft);
      if (changed) {
        db = draft;
        await onSave(db);
      }
      return value;
    },
  };
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
  /** Runs after the transaction commits (e.g. sending email), so slow I/O never holds a lock. */
  after: (fn: () => Promise<void>) => void;
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
/** Anyone who can teach: co-op/school teachers, admins, and homeschool parents (for their own children). */
const TEACHING: readonly Role[] = ["teacher", "admin", "parent"];
const FAMILY: readonly Role[] = ["parent", "admin"];

// ---------------------------------------------------------------- helpers

const now = () => new Date().toISOString();

export function publicUser(u: User): PublicUser {
  const { passwordHash: _omit, sessionVersion: _sv, ...rest } = u;
  return rest;
}

const RESET_TTL_MS = 60 * 60 * 1000;
const ADMIN_RESET_TTL_MS = 72 * 60 * 60 * 1000;

function checkNewPassword(value: unknown) {
  const pw = str(value, "password", { max: 200 });
  if (pw.length < 8) fail(400, "Password must be at least 8 characters");
  return pw;
}

async function issueResetToken(db: Database, env: ApiEnv, user: User, ttlMs: number) {
  const token = env.randomToken();
  const t = Date.now();
  db.passwordResets = db.passwordResets.filter((r) => new Date(r.expiresAt).getTime() > t);
  db.passwordResets.push({
    tokenHash: await env.sha256(token),
    userId: user.id,
    expiresAt: new Date(t + ttlMs).toISOString(),
    createdAt: new Date(t).toISOString(),
  });
  return { link: env.resetLink(token), expiresAt: new Date(t + ttlMs).toISOString() };
}

/** Changes a password and signs the user out everywhere else. */
async function setPassword(env: ApiEnv, user: User, password: string) {
  user.passwordHash = await env.hashPassword(password);
  user.sessionVersion = (user.sessionVersion ?? 1) + 1;
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
      questions: s.questions.map(({ expectedAnswer: _e, acceptedAnswers: _a, explanation: _x, hint: _h, ...q }) => ({ ...q, expectedAnswer: "" })),
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
      // Their own children, plus students in any co-op class they volunteer to teach.
      return new Set([...user.childIds, ...db.classrooms.filter((c) => c.teacherId === user.id).flatMap((c) => c.studentIds)]);
    default:
      return new Set([user.id]);
  }
}

/** Parents who share at least one child with this parent (including the parent themself). */
function coParents(db: Database, user: User): User[] {
  if (user.childIds.length === 0) return [user];
  const kids = new Set(user.childIds);
  return db.users.filter((u) => u.id === user.id || ((u.role === "parent" || u.role === "admin") && u.childIds.some((id) => kids.has(id))));
}

function canTeachClass(db: Database, user: User, c: Classroom) {
  if (user.role === "admin" || c.teacherId === user.id) return true;
  // Co-parents share their family's home-school class.
  return !!c.isFamily && coParents(db, user).some((p) => p.id === c.teacherId);
}

function defaultFamily(user: User): FamilySettings {
  return { schoolName: `${user.lastName || user.firstName || user.username} Family School`, schoolYearStart: "08-01", requiredDays: 180 };
}

/** The home-school class a parent's children belong to, created on first use. */
function ensureFamilyClass(db: Database, env: ApiEnv, user: User): Classroom {
  const parents = coParents(db, user);
  let c = db.classrooms.find((x) => x.isFamily && parents.some((p) => p.id === x.teacherId));
  if (!c) {
    c = {
      id: env.newId(),
      name: user.family?.schoolName ?? defaultFamily(user).schoolName,
      subject: "Home school",
      teacherId: user.id,
      studentIds: [],
      joinCode: joinCode(),
      isFamily: true,
      createdAt: now(),
    };
    db.classrooms.push(c);
  }
  for (const id of user.childIds) if (!c.studentIds.includes(id)) c.studentIds.push(id);
  return c;
}

/** A parent of the student (for records like transcripts), falling back to the family settings default. */
function familyFor(db: Database, studentId: string): FamilySettings | undefined {
  return db.users.find((u) => u.childIds.includes(studentId) && u.family)?.family;
}

function assertCanViewStudent(db: Database, user: User, studentId: string) {
  const student = findUser(db, studentId);
  if (!student || student.role !== "student") fail(404, "Student not found");
  if (!visibleStudentIds(db, user).has(studentId)) fail(403, "You don't have access to this student");
  return student!;
}

function ownClassroom(db: Database, user: User, id: string): Classroom {
  const c = db.classrooms.find((x) => x.id === id) ?? fail(404, "Classroom not found");
  if (!canTeachClass(db, user, c)) fail(403, "Not your classroom");
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

/** Adds lesson time to today's automatic attendance entry for that lesson. */
function logStudyTime(db: Database, env: ApiEnv, studentId: string, lesson: Lesson, minutes: number) {
  const date = now().slice(0, 10);
  const entry = db.attendance.find((a) => a.source === "auto" && a.studentId === studentId && a.date === date && a.lessonId === lesson.id);
  if (entry) entry.minutes += minutes;
  else db.attendance.push({ id: env.newId(), studentId, date, minutes, subject: lesson.categoryId, lessonId: lesson.id, source: "auto", loggedBy: studentId, createdAt: now() });
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
    .filter((a) => classIds.has(a.classroomId) && (!a.studentIds || a.studentIds.includes(studentId)))
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

function strList(value: unknown, field: string, maxItems = 30): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) fail(400, `${field} must be a list`);
  return (value as unknown[]).map((v) => String(v).trim().slice(0, 500)).filter(Boolean).slice(0, maxItems);
}

const sanitizeQuestion = (q: any, i: number): LessonContent["sections"][number]["questions"][number] => {
  const type = ["choice", "truefalse", "number", "text", "code"].includes(q?.type) ? q.type : "text";
  const options = type === "truefalse" ? ["True", "False"] : type === "choice" ? strList(q.options, "options", 8) : undefined;
  const tolerance = Number(q?.tolerance);
  return {
    id: String(q?.id || `q${i + 1}`).slice(0, 80),
    prompt: str(q?.prompt, "question prompt", { max: 4000 }),
    type,
    expectedAnswer: str(q?.expectedAnswer, "correct answer", { max: 4000 }),
    options,
    acceptedAnswers: type === "text" ? strList(q.acceptedAnswers, "acceptedAnswers", 20) : undefined,
    tolerance: type === "number" && Number.isFinite(tolerance) && tolerance > 0 ? tolerance : undefined,
    caseSensitive: type === "text" ? !!q.caseSensitive : undefined,
    hint: str(q?.hint, "hint", { required: false, max: 2000 }) || undefined,
    explanation: str(q?.explanation, "explanation", { required: false, max: 4000 }) || undefined,
  };
};

/** Keeps course units in sync when a lesson is created, moved, or archived. */
function placeLessonInUnit(db: Database, lesson: Lesson) {
  for (const c of db.courses) for (const u of c.units) u.lessonIds = u.lessonIds.filter((id) => id !== lesson.id);
  if (!lesson.courseId || !lesson.unitId) return;
  const unit = db.courses.find((c) => c.id === lesson.courseId)?.units.find((u) => u.id === lesson.unitId);
  if (unit) unit.lessonIds.push(lesson.id);
}

function validateLessonBody(db: Database, body: any, existing?: Lesson): Partial<Lesson> {
  const difficulty = (body.difficulty ?? existing?.difficulty) as string;
  if (!difficultyLevels.includes(difficulty as any)) fail(400, "difficulty must be easy, medium, or hard");
  const categoryId = str(body.categoryId ?? existing?.categoryId, "categoryId", { max: 64 });
  const duration = Number(body.estimatedDuration ?? existing?.estimatedDuration ?? 30);
  let quiz: LessonContent | undefined = existing?.quiz;
  if (body.quiz !== undefined) {
    quiz = body.quiz && Array.isArray(body.quiz.sections)
      ? {
          sections: body.quiz.sections.map((s: any, si: number) => ({
            id: String(s?.id || `section-${si + 1}`).slice(0, 80),
            title: str(s?.title, "section title", { max: 200 }),
            description: str(s?.description, "section description", { required: false, max: 2000 }) || undefined,
            questions: Array.isArray(s?.questions) ? s.questions.map(sanitizeQuestion) : [],
          })),
        }
      : undefined;
    const choices = quiz?.sections.flatMap((s) => s.questions).filter((q) => q.type === "choice" || q.type === "truefalse") ?? [];
    for (const q of choices) {
      if ((q.options?.length ?? 0) < 2) fail(400, `"${q.prompt.slice(0, 60)}" needs at least two choices`);
      if (!q.options!.includes(q.expectedAnswer)) fail(400, `Mark the correct choice for "${q.prompt.slice(0, 60)}"`);
    }
  }
  let courseId = existing?.courseId;
  let unitId = existing?.unitId;
  if (body.courseId !== undefined) {
    courseId = body.courseId || undefined;
    unitId = body.unitId || undefined;
    const course = courseId ? db.courses.find((c) => c.id === courseId) : undefined;
    if (courseId && !course) fail(400, "Course not found");
    if (course && unitId && !course.units.some((u) => u.id === unitId)) fail(400, "Unit not found in that course");
  }
  const grade = body.gradeLevel === undefined ? existing?.gradeLevel : body.gradeLevel === null || body.gradeLevel === "" ? undefined : Number(body.gradeLevel);
  if (grade !== undefined && !(Number.isInteger(grade) && grade >= 0 && grade <= 12)) fail(400, "gradeLevel must be K (0) through 12");
  const vocabulary = body.vocabulary === undefined
    ? existing?.vocabulary
    : (Array.isArray(body.vocabulary) ? body.vocabulary : [])
        .map((v: any) => ({ term: String(v?.term ?? "").trim().slice(0, 100), definition: String(v?.definition ?? "").trim().slice(0, 500) }))
        .filter((v: { term: string }) => v.term)
        .slice(0, 30);
  return {
    courseId,
    unitId,
    gradeLevel: grade,
    objectives: body.objectives === undefined ? existing?.objectives : strList(body.objectives, "objectives", 12),
    standards: body.standards === undefined ? existing?.standards : strList(body.standards, "standards", 12),
    vocabulary,
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
  session.sv = user!.sessionVersion;
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
    // The very first account administers the site. After that, families sign up as parents
    // (homeschool) and students sign up to join a class.
    role: firstAccount ? "admin" : body?.accountType === "family" ? "parent" : "student",
    childIds: [],
    active: true,
    sessionVersion: 1,
    createdAt: now(),
    lastLoginAt: now(),
  };
  if (user.role === "parent" || user.role === "admin") {
    user.family = { ...defaultFamily(user), schoolName: str(body?.schoolName, "schoolName", { required: false, max: 120 }) || defaultFamily(user).schoolName };
  }
  db.users.push(user);
  session.userId = user.id;
  session.sv = user.sessionVersion;
  dirty();
  return publicUser(user);
});

pub("POST", "/api/logout", ({ session }) => {
  delete session.userId;
  delete session.sv;
  return { ok: true };
});

pub("POST", "/api/password/forgot", async ({ db, body, env, dirty, after }) => {
  const login = str(body?.login, "login", { max: 200 }).toLowerCase();
  const user = db.users.find((u) => u.active && (u.username.toLowerCase() === login || (u.email && u.email.toLowerCase() === login)));
  // Same answer whether or not the account exists, so this can't be used to discover accounts.
  const message = "If that account has an email address on file, a reset link is on its way. Otherwise, ask your administrator for a reset link.";
  if (!user) return { message };
  const { link } = await issueResetToken(db, env, user, RESET_TTL_MS);
  dirty();
  if (env.exposeResetLinks) return { message, demoLink: link };
  if (user.email && env.sendPasswordReset) {
    const send = env.sendPasswordReset;
    after(() => send({ to: user.email, name: displayName(user), link }));
  }
  return { message };
});

pub("POST", "/api/password/reset", async ({ db, body, session, env, dirty }) => {
  const tokenHash = await env.sha256(str(body?.token, "token", { max: 200 }));
  const reset = db.passwordResets.find((r) => r.tokenHash === tokenHash && new Date(r.expiresAt).getTime() > Date.now());
  const user = reset && findUser(db, reset.userId);
  if (!user || !user.active) fail(400, "This reset link is invalid or has expired. Request a new one.");
  await setPassword(env, user!, checkNewPassword(body?.password));
  db.passwordResets = db.passwordResets.filter((r) => r.userId !== user!.id);
  session.userId = user!.id;
  session.sv = user!.sessionVersion;
  user!.lastLoginAt = now();
  dirty();
  return publicUser(user!);
});

on("GET", "/api/auth/user", ALL, ({ user }) => publicUser(user));

on("POST", "/api/me/password", ALL, async ({ user, body, session, env, dirty }) => {
  if (!(await env.verifyPassword(str(body?.currentPassword, "currentPassword", { max: 200 }), user.passwordHash))) {
    fail(400, "Your current password is incorrect");
  }
  await setPassword(env, user, checkNewPassword(body?.newPassword));
  session.sv = user.sessionVersion;
  dirty();
  return { ok: true };
});

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

on("POST", "/api/lessons", TEACHING, ({ db, user, body, env, dirty }) => {
  const lesson: Lesson = {
    ...(validateLessonBody(db, body ?? {}) as Lesson),
    id: env.newId(),
    authorId: user.id,
    isActive: true,
    createdAt: now(),
  };
  db.lessons.push(lesson);
  placeLessonInUnit(db, lesson);
  dirty();
  return lesson;
});

on("PUT", "/api/lessons/:id", TEACHING, ({ db, user, params, body, dirty }) => {
  const lesson = findLesson(db, params.id);
  if (user.role !== "admin" && lesson.authorId !== user.id) fail(403, "Only the author or an admin can edit this lesson");
  const before = `${lesson.courseId}/${lesson.unitId}`;
  Object.assign(lesson, validateLessonBody(db, body ?? {}, lesson), { updatedAt: now() });
  if (`${lesson.courseId}/${lesson.unitId}` !== before) placeLessonInUnit(db, lesson);
  dirty();
  return lesson;
});

on("DELETE", "/api/lessons/:id", TEACHING, ({ db, user, params, dirty }) => {
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
  const attempts = qp.attempts;

  if (user.role === "student") {
    const p = ensureProgress(db, user.id, lesson.id);
    p.lastAccessed = now();
    if (!p.isCompleted) p.score = quizScore(db, user.id, lesson).percent;
  }
  dirty();
  const isLearner = user.role === "student" || user.role === "parent";
  return {
    ...result,
    questionId: question.id,
    attempts,
    hint: result.isCorrect ? undefined : question.hint,
    // Explain once it's right, or after three misses so nobody stays stuck.
    explanation: result.isCorrect || attempts >= 3 ? question.explanation : undefined,
    expectedAnswer: isLearner ? undefined : question.expectedAnswer,
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
  if (minutes > 0) logStudyTime(db, env, user.id, lesson, minutes);
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

// ---- courses

function courseView(db: Database, user: User, c: Course) {
  const lessons = new Map(db.lessons.filter((l) => l.isActive).map((l) => [l.id, l]));
  const units = c.units.map((u) => ({ ...u, lessonIds: u.lessonIds.filter((id) => lessons.has(id)) }));
  const ids = units.flatMap((u) => u.lessonIds);
  const done = user.role === "student" ? ids.filter((id) => getProgress(db, user.id, id)?.isCompleted).length : undefined;
  return { ...c, units, lessonCount: ids.length, completedCount: done };
}

function validateCourseBody(body: any, existing?: Course) {
  const grade = Number(body.gradeLevel ?? existing?.gradeLevel);
  if (!(Number.isInteger(grade) && grade >= 0 && grade <= 12)) fail(400, "gradeLevel must be K (0) through 12");
  const maxRaw = body.gradeLevelMax === undefined ? existing?.gradeLevelMax : body.gradeLevelMax === null || body.gradeLevelMax === "" ? undefined : Number(body.gradeLevelMax);
  if (maxRaw !== undefined && !(Number.isInteger(maxRaw) && maxRaw >= grade && maxRaw <= 12)) fail(400, "gradeLevelMax must be between gradeLevel and 12");
  return {
    title: str(body.title ?? existing?.title, "title", { max: 200 }),
    subject: str(body.subject ?? existing?.subject, "subject", { max: 64 }),
    gradeLevel: grade,
    gradeLevelMax: maxRaw,
    description: str(body.description ?? existing?.description, "description", { required: false, max: 4000 }),
    framework: str(body.framework ?? existing?.framework, "framework", { required: false, max: 200 }) || undefined,
  };
}

function applyUnits(env: ApiEnv, body: any, existing: CourseUnit[]): CourseUnit[] {
  if (!Array.isArray(body.units)) return existing;
  return body.units.slice(0, 40).map((u: any) => {
    const prior = existing.find((x) => x.id === u?.id);
    return {
      id: prior?.id ?? env.newId(),
      title: str(u?.title, "unit title", { max: 200 }),
      description: str(u?.description, "unit description", { required: false, max: 2000 }) || undefined,
      lessonIds: prior?.lessonIds ?? [],
    };
  });
}

on("GET", "/api/courses", ALL, ({ db, user }) =>
  db.courses
    .filter((c) => c.isActive)
    .sort((a, b) => a.gradeLevel - b.gradeLevel || a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title))
    .map((c) => courseView(db, user, c)),
);

on("GET", "/api/courses/:id", ALL, ({ db, user, params }) => {
  const c = db.courses.find((x) => x.id === params.id && x.isActive) ?? fail(404, "Course not found");
  const view = courseView(db, user, c);
  const lessonInfo = Object.fromEntries(
    view.units.flatMap((u) => u.lessonIds).map((id) => {
      const l = db.lessons.find((x) => x.id === id)!;
      const p = user.role === "student" ? getProgress(db, user.id, id) : undefined;
      return [id, { id, title: l.title, description: l.description, estimatedDuration: l.estimatedDuration, difficulty: l.difficulty, questionCount: lessonQuestions(l).length, hasWrittenResponse: !!l.answer, status: p?.status ?? (user.role === "student" ? "not_started" : undefined), score: p?.score }];
    }),
  );
  const classes = teacherClassrooms(db, user).filter((x) => x.courseId === c.id).map((x) => ({ id: x.id, name: x.name }));
  return { ...view, lessons: lessonInfo, classes };
});

on("POST", "/api/courses", TEACHING, ({ db, user, body, env, dirty }) => {
  const course: Course = {
    id: env.newId(),
    ...validateCourseBody(body ?? {}),
    units: applyUnits(env, body ?? {}, []),
    authorId: user.id,
    isActive: true,
    createdAt: now(),
  };
  if (course.units.length === 0) course.units = [{ id: env.newId(), title: "Unit 1", lessonIds: [] }];
  db.courses.push(course);
  dirty();
  return course;
});

on("PUT", "/api/courses/:id", TEACHING, ({ db, user, params, body, env, dirty }) => {
  const c = db.courses.find((x) => x.id === params.id && x.isActive) ?? fail(404, "Course not found");
  if (user.role !== "admin" && c.authorId !== user.id) fail(403, "Only the course author or an admin can edit this course");
  Object.assign(c, validateCourseBody(body ?? {}, c));
  const units = applyUnits(env, body ?? {}, c.units);
  const kept = new Set(units.map((u) => u.id));
  // Lessons in a removed unit stay in the library, just unfiled.
  for (const l of db.lessons) if (l.courseId === c.id && l.unitId && !kept.has(l.unitId)) l.unitId = undefined;
  c.units = units;
  dirty();
  return c;
});

/** Due dates for a run of lessons: one every `every` days, optionally skipping Saturdays and Sundays. */
function scheduleDates(start: Date, count: number, every: number, skipWeekends: boolean): Date[] {
  const out: Date[] = [];
  const d = new Date(start);
  const bump = () => {
    if (!skipWeekends) return;
    while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d.setUTCDate(d.getUTCDate() + 1);
  };
  bump();
  for (let i = 0; i < count; i++) {
    out.push(new Date(d));
    for (let k = 0; k < every; k++) {
      d.setUTCDate(d.getUTCDate() + 1);
      bump();
    }
  }
  return out;
}

function pickStudents(c: Classroom, raw: unknown): string[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const ids = raw.map(String).filter((id) => c.studentIds.includes(id));
  if (ids.length === 0) fail(400, "None of those students are in this class");
  return ids.length === c.studentIds.length ? undefined : ids;
}

/** Assigns a unit (or a whole course when unitId is omitted) with spaced due dates. */
function assignLessons(ctx: Ctx, wholeCourse: boolean) {
  const { db, user, params, body, env, dirty } = ctx;
  const c = ownClassroom(db, user, params.id);
  const course = db.courses.find((x) => x.id === str(body?.courseId, "courseId", { max: 100 })) ?? fail(404, "Course not found");
  const units = wholeCourse ? course.units : [course.units.find((u) => u.id === str(body?.unitId, "unitId", { max: 100 })) ?? fail(404, "Unit not found")];
  const start = new Date(str(body?.startDate, "startDate", { max: 40 }));
  if (isNaN(start.getTime())) fail(400, "startDate is not a valid date");
  const every = Math.max(1, Math.min(14, Math.round(Number(body?.spacingDays) || 2)));
  const studentIds = pickStudents(c, body?.studentIds);
  const lessons = units.flatMap((u) => u.lessonIds).map((id) => db.lessons.find((l) => l.id === id && l.isActive)).filter((l): l is Lesson => !!l);
  if (lessons.length === 0) fail(400, wholeCourse ? "That course has no lessons yet" : "That unit has no lessons yet");
  const who = studentIds ?? c.studentIds;
  // Skip lessons every chosen student already has from this class.
  const covered = (lessonId: string) => who.every((s) => db.assignments.some((a) => a.classroomId === c.id && a.lessonId === lessonId && (!a.studentIds || a.studentIds.includes(s))));
  const todo = lessons.filter((l) => !covered(l.id));
  const dates = scheduleDates(start, todo.length, every, body?.skipWeekends !== false);
  todo.forEach((l, i) => {
    const unit = course.units.find((u) => u.lessonIds.includes(l.id));
    db.assignments.push({
      id: env.newId(),
      classroomId: c.id,
      lessonId: l.id,
      dueDate: dates[i].toISOString(),
      note: `${course.title}${unit ? ` · ${unit.title}` : ""}`,
      studentIds,
      assignedBy: user.id,
      createdAt: now(),
    });
  });
  const label = wholeCourse ? `"${course.title}"` : `"${units[0].title}"`;
  log(db, env, { type: "assignment_created", actorId: user.id, classroomId: c.id, message: `assigned ${todo.length} lessons from ${label} to ${c.name}` });
  dirty();
  return { created: todo.length, skipped: lessons.length - todo.length, lastDue: dates[dates.length - 1]?.toISOString() ?? null };
}

on("POST", "/api/teacher/classrooms/:id/assign-unit", TEACHING, (ctx) => assignLessons(ctx, false));
on("POST", "/api/teacher/classrooms/:id/assign-course", TEACHING, (ctx) => assignLessons(ctx, true));

// ---- student self-service

on("GET", "/api/me/assignments", ["student"], ({ db, user }) => assignmentsForStudent(db, user.id));

on("GET", "/api/me/classrooms", ["student"], ({ db, user }) =>
  classroomsForStudent(db, user.id).map((c) => {
    const t = findUser(db, c.teacherId);
    return { id: c.id, name: c.name, subject: c.subject, courseId: c.courseId, teacherName: t ? displayName(t) : "" };
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

const targets = (c: Classroom, a: Assignment) => (a.studentIds ? c.studentIds.filter((s) => a.studentIds!.includes(s)) : c.studentIds);

function classroomCard(db: Database, c: Classroom) {
  const assignments = db.assignments.filter((a) => a.classroomId === c.id);
  const slots = assignments.reduce((n, a) => n + targets(c, a).length, 0);
  const done = assignments.reduce((n, a) => n + targets(c, a).filter((s) => getProgress(db, s, a.lessonId)?.isCompleted).length, 0);
  const teacher = findUser(db, c.teacherId);
  return {
    ...c,
    courseTitle: c.courseId ? db.courses.find((x) => x.id === c.courseId)?.title : undefined,
    teacherName: teacher ? displayName(teacher) : "",
    studentCount: c.studentIds.length,
    assignmentCount: assignments.length,
    completionRate: slots ? Math.round((done / slots) * 100) : null,
  };
}

function teacherClassrooms(db: Database, user: User) {
  return db.classrooms.filter((c) => canTeachClass(db, user, c));
}

on("GET", "/api/teacher/overview", TEACHING, ({ db, user }) => {
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

on("GET", "/api/teacher/classrooms", TEACHING, ({ db, user }) => teacherClassrooms(db, user).map((c) => classroomCard(db, c)));

on("POST", "/api/teacher/classrooms", TEACHING, ({ db, user, body, env, dirty }) => {
  const c: Classroom = {
    id: env.newId(),
    name: str(body?.name, "name", { max: 120 }),
    subject: str(body?.subject, "subject", { required: false, max: 80 }),
    teacherId: user.id,
    studentIds: [],
    joinCode: joinCode(),
    courseId: body?.courseId && db.courses.some((x) => x.id === body.courseId) ? body.courseId : undefined,
    ...coopFields(body ?? {}),
    createdAt: now(),
  };
  db.classrooms.push(c);
  dirty();
  return classroomCard(db, c);
});

function coopFields(body: any): Partial<Classroom> {
  const grade = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : Math.max(0, Math.min(12, Math.round(Number(v)))));
  const out: Partial<Classroom> = {};
  if (body.description !== undefined) out.description = str(body.description, "description", { required: false, max: 2000 }) || undefined;
  if (body.schedule !== undefined) out.schedule = str(body.schedule, "schedule", { required: false, max: 200 }) || undefined;
  if (body.location !== undefined) out.location = str(body.location, "location", { required: false, max: 200 }) || undefined;
  if (body.fee !== undefined) out.fee = str(body.fee, "fee", { required: false, max: 100 }) || undefined;
  if (body.gradeMin !== undefined) out.gradeMin = grade(body.gradeMin);
  if (body.gradeMax !== undefined) out.gradeMax = grade(body.gradeMax);
  if (body.capacity !== undefined) out.capacity = body.capacity === "" || body.capacity === null ? undefined : Math.max(1, Math.round(Number(body.capacity))) || undefined;
  if (body.openEnrollment !== undefined) out.openEnrollment = !!body.openEnrollment;
  return out;
}

on("PATCH", "/api/teacher/classrooms/:id", TEACHING, ({ db, user, params, body, dirty }) => {
  const c = ownClassroom(db, user, params.id);
  if (body?.name !== undefined) c.name = str(body.name, "name", { max: 120 });
  if (body?.subject !== undefined) c.subject = str(body.subject, "subject", { required: false, max: 80 });
  if (body?.courseId !== undefined) c.courseId = body.courseId && db.courses.some((x) => x.id === body.courseId) ? body.courseId : undefined;
  Object.assign(c, coopFields(body ?? {}));
  dirty();
  return classroomCard(db, c);
});

on("GET", "/api/teacher/classrooms/:id", TEACHING, ({ db, user, params }) => {
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
      grades: Object.fromEntries(assignments.filter((a) => !a.studentIds || a.studentIds.includes(s.id)).map((a) => [a.id, assignmentStatus(db, s.id, a)])),
    }));
  return {
    classroom: classroomCard(db, c),
    students,
    assignments: assignments.map((a) => {
      const lesson = db.lessons.find((l) => l.id === a.lessonId);
      const who = targets(c, a);
      const finished = who.map((s) => getProgress(db, s, a.lessonId)).filter((p) => p?.isCompleted);
      return {
        ...a,
        lessonTitle: lesson?.title ?? "(removed lesson)",
        categoryId: lesson?.categoryId,
        targetCount: who.length,
        targetNames: a.studentIds ? who.map((id) => { const u = findUser(db, id); return u ? u.firstName || u.username : ""; }) : undefined,
        completedCount: finished.length,
        averageScore: finished.length ? Math.round(finished.reduce((s, p) => s + (p!.score || 0), 0) / finished.length) : null,
      };
    }),
  };
});

on("DELETE", "/api/teacher/classrooms/:id", TEACHING, ({ db, user, params, dirty }) => {
  const c = ownClassroom(db, user, params.id);
  db.classrooms = db.classrooms.filter((x) => x.id !== c.id);
  db.assignments = db.assignments.filter((a) => a.classroomId !== c.id);
  dirty();
  return { ok: true };
});

on("POST", "/api/teacher/classrooms/:id/students", TEACHING, ({ db, user, params, body, dirty }) => {
  const c = ownClassroom(db, user, params.id);
  const ref = str(body?.studentId ?? body?.username, "studentId", { max: 100 }).toLowerCase();
  const student = db.users.find((u) => u.role === "student" && (u.id === ref || u.username.toLowerCase() === ref));
  if (!student) fail(404, "No student with that username");
  if (user.role === "parent" && !user.childIds.includes(student!.id)) fail(403, "Parents can only add their own children");
  if (!c.studentIds.includes(student!.id)) c.studentIds.push(student!.id);
  dirty();
  return { ok: true };
});

on("DELETE", "/api/teacher/classrooms/:id/students/:studentId", TEACHING, ({ db, user, params, dirty }) => {
  const c = ownClassroom(db, user, params.id);
  c.studentIds = c.studentIds.filter((s) => s !== params.studentId);
  dirty();
  return { ok: true };
});

on("POST", "/api/teacher/classrooms/:id/assignments", TEACHING, ({ db, user, params, body, env, dirty }) => {
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
    studentIds: pickStudents(c, body?.studentIds),
    assignedBy: user.id,
    createdAt: now(),
  };
  db.assignments.push(a);
  log(db, env, { type: "assignment_created", actorId: user.id, classroomId: c.id, lessonId: lesson.id, message: `assigned "${lesson.title}" to ${c.name}` });
  dirty();
  return a;
});

on("DELETE", "/api/teacher/assignments/:id", TEACHING, ({ db, user, params, dirty }) => {
  const a = db.assignments.find((x) => x.id === params.id) ?? fail(404, "Assignment not found");
  ownClassroom(db, user, a.classroomId);
  db.assignments = db.assignments.filter((x) => x.id !== a.id);
  dirty();
  return { ok: true };
});

on("GET", "/api/teacher/students", TEACHING, ({ db, user }) =>
  db.users
    .filter((u) => u.role === "student" && u.active && (user.role !== "parent" || user.childIds.includes(u.id)))
    .map((u) => ({ id: u.id, username: u.username, name: displayName(u), gradeLevel: u.gradeLevel })),
);

on("GET", "/api/teacher/submissions", TEACHING, ({ db, user }) => {
  const students = visibleStudentIds(db, user);
  return db.submissions
    .filter((s) => students.has(s.userId))
    .map((s) => submissionView(db, s))
    .sort((a, b) => (a.status === b.status ? b.submittedAt.localeCompare(a.submittedAt) : a.status === "pending" ? -1 : 1));
});

on("POST", "/api/teacher/submissions/:id/review", TEACHING, ({ db, user, params, body, env, dirty }) => {
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

// ---- homeschool family

function newStudentAccount(db: Database, env: ApiEnv, body: any): Promise<User> {
  return (async () => {
    const username = str(body?.username, "username", { max: 50 }).toLowerCase();
    if (!/^[a-z0-9._-]{3,50}$/.test(username)) fail(400, "Username must be 3+ letters, numbers, dots, dashes or underscores");
    if (db.users.some((u) => u.username.toLowerCase() === username)) fail(409, "That username is taken");
    const password = str(body?.password, "password", { max: 200 });
    if (password.length < 6) fail(400, "Password must be at least 6 characters");
    return {
      id: env.newId(),
      username,
      passwordHash: await env.hashPassword(password),
      firstName: str(body?.firstName, "firstName", { max: 80 }),
      lastName: str(body?.lastName, "lastName", { required: false, max: 80 }),
      email: str(body?.email, "email", { required: false, max: 200 }),
      role: "student" as Role,
      childIds: [],
      gradeLevel: str(body?.gradeLevel, "gradeLevel", { required: false, max: 40 }) || undefined,
      birthDate: str(body?.birthDate, "birthDate", { required: false, max: 10 }) || undefined,
      active: true,
      sessionVersion: 1,
      createdAt: now(),
    };
  })();
}

function familyView(db: Database, env: ApiEnv, user: User) {
  const parents = coParents(db, user);
  const familyClass = user.childIds.length ? db.classrooms.find((c) => c.isFamily && parents.some((p) => p.id === c.teacherId)) : undefined;
  return {
    settings: user.family ?? defaultFamily(user),
    parents: parents.map((p) => ({ id: p.id, name: displayName(p), username: p.username, email: p.email })),
    familyClassId: familyClass?.id ?? null,
    children: user.childIds
      .map((id) => findUser(db, id))
      .filter((c): c is User => !!c)
      .map((c) => ({ ...publicUser(c), summary: studentSummary(db, c.id), courses: enrolledCourses(db, c.id) })),
  };
}

/** Courses a student has assignments from, with progress. */
function enrolledCourses(db: Database, studentId: string) {
  const lessonIds = new Set(assignmentsForStudent(db, studentId).map((a) => a.lessonId));
  return db.courses
    .filter((c) => c.units.some((u) => u.lessonIds.some((id) => lessonIds.has(id))))
    .map((c) => {
      const ids = c.units.flatMap((u) => u.lessonIds).filter((id) => db.lessons.some((l) => l.id === id && l.isActive));
      return { id: c.id, title: c.title, subject: c.subject, lessonCount: ids.length, completedCount: ids.filter((id) => getProgress(db, studentId, id)?.isCompleted).length };
    });
}

on("GET", "/api/family", FAMILY, ({ db, user, env }) => familyView(db, env, user));

on("PUT", "/api/family/settings", FAMILY, ({ db, user, body, dirty }) => {
  const num = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : Math.max(0, Math.round(Number(v))) || undefined);
  const start = str(body?.schoolYearStart, "schoolYearStart", { required: false, max: 5 }) || "08-01";
  if (!/^\d{2}-\d{2}$/.test(start)) fail(400, "schoolYearStart must look like 08-01");
  const settings: FamilySettings = {
    schoolName: str(body?.schoolName, "schoolName", { max: 120 }),
    state: str(body?.state, "state", { required: false, max: 60 }) || undefined,
    requiredDays: num(body?.requiredDays),
    requiredHours: num(body?.requiredHours),
    schoolYearStart: start,
  };
  for (const p of coParents(db, user)) p.family = settings;
  const fc = db.classrooms.find((c) => c.isFamily && coParents(db, user).some((p) => p.id === c.teacherId));
  if (fc) fc.name = settings.schoolName;
  dirty();
  return settings;
});

on("POST", "/api/family/children", FAMILY, async ({ db, user, body, env, dirty }) => {
  const child = await newStudentAccount(db, env, body);
  if (!child.lastName) child.lastName = user.lastName;
  db.users.push(child);
  for (const p of coParents(db, user)) if (!p.childIds.includes(child.id)) p.childIds.push(child.id);
  if (!user.family) user.family = defaultFamily(user);
  ensureFamilyClass(db, env, user);
  dirty();
  return publicUser(child);
});

on("PATCH", "/api/family/children/:id", FAMILY, async ({ db, user, params, body, env, dirty }) => {
  if (!user.childIds.includes(params.id)) fail(403, "That isn't one of your children");
  const child = findUser(db, params.id) ?? fail(404, "Child not found");
  if (body?.firstName !== undefined) child.firstName = str(body.firstName, "firstName", { max: 80 });
  if (body?.lastName !== undefined) child.lastName = str(body.lastName, "lastName", { required: false, max: 80 });
  if (body?.gradeLevel !== undefined) child.gradeLevel = str(body.gradeLevel, "gradeLevel", { required: false, max: 40 }) || undefined;
  if (body?.birthDate !== undefined) child.birthDate = str(body.birthDate, "birthDate", { required: false, max: 10 }) || undefined;
  if (body?.password) {
    const pw = str(body.password, "password", { max: 200 });
    if (pw.length < 6) fail(400, "Password must be at least 6 characters");
    child.passwordHash = await env.hashPassword(pw);
    child.sessionVersion += 1;
  }
  dirty();
  return publicUser(child);
});

on("POST", "/api/family/parents", FAMILY, async ({ db, user, body, env, dirty }) => {
  const username = str(body?.username, "username", { max: 50 }).toLowerCase();
  if (!/^[a-z0-9._-]{3,50}$/.test(username)) fail(400, "Username must be 3+ letters, numbers, dots, dashes or underscores");
  if (db.users.some((u) => u.username.toLowerCase() === username)) fail(409, "That username is taken");
  const password = str(body?.password, "password", { max: 200 });
  if (password.length < 8) fail(400, "Password must be at least 8 characters");
  const parent: User = {
    id: env.newId(),
    username,
    passwordHash: await env.hashPassword(password),
    firstName: str(body?.firstName, "firstName", { max: 80 }),
    lastName: str(body?.lastName, "lastName", { required: false, max: 80 }) || user.lastName,
    email: str(body?.email, "email", { required: false, max: 200 }),
    role: "parent",
    childIds: [...user.childIds],
    family: user.family ?? defaultFamily(user),
    active: true,
    sessionVersion: 1,
    createdAt: now(),
  };
  db.users.push(parent);
  dirty();
  return publicUser(parent);
});

/** Families and co-op teachers can add a child's work and records; students can view their own. */
function assertCanRecord(db: Database, user: User, studentId: string) {
  const student = assertCanViewStudent(db, user, studentId);
  if (user.role === "student") fail(403, "Ask a parent or teacher to update records");
  return student;
}

// ---- attendance

on("GET", "/api/students/:id/attendance", ALL, ({ db, user, params }) => {
  const student = assertCanViewStudent(db, user, params.id);
  const family = familyFor(db, student.id) ?? { schoolName: db.organizationName, schoolYearStart: "08-01", requiredDays: 180 };
  const entries = db.attendance.filter((a) => a.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const years = Array.from(new Set(entries.map((e) => schoolYearOf(e.date, family.schoolYearStart)).concat(schoolYearOf(now(), family.schoolYearStart)))).sort().reverse();
  return {
    student: publicUser(student),
    settings: family,
    years,
    entries: entries.map((e) => ({ ...e, lessonTitle: e.lessonId ? db.lessons.find((l) => l.id === e.lessonId)?.title : undefined })),
  };
});

on("POST", "/api/students/:id/attendance", ALL, ({ db, user, params, body, env, dirty }) => {
  const student = assertCanRecord(db, user, params.id);
  const date = str(body?.date, "date", { max: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(400, "date must look like 2026-09-14");
  const minutes = Math.round(Number(body?.minutes));
  if (!(minutes > 0 && minutes <= 720)) fail(400, "minutes must be between 1 and 720");
  const entry: AttendanceEntry = {
    id: env.newId(),
    studentId: student.id,
    date,
    minutes,
    subject: str(body?.subject, "subject", { max: 60 }),
    note: str(body?.note, "note", { required: false, max: 500 }) || undefined,
    source: "manual",
    loggedBy: user.id,
    createdAt: now(),
  };
  db.attendance.push(entry);
  dirty();
  return entry;
});

on("DELETE", "/api/attendance/:id", ALL, ({ db, user, params, dirty }) => {
  const e = db.attendance.find((x) => x.id === params.id) ?? fail(404, "Entry not found");
  assertCanRecord(db, user, e.studentId);
  db.attendance = db.attendance.filter((x) => x.id !== e.id);
  dirty();
  return { ok: true };
});

// ---- transcripts

function transcriptView(db: Database, student: User) {
  const entries = db.transcripts.filter((t) => t.studentId === student.id).sort((a, b) => a.gradeLevel - b.gradeLevel || a.courseTitle.localeCompare(b.courseTitle));
  const graded = entries.filter((e) => e.grade in gradePoints);
  const points = graded.reduce((n, e) => n + gradePoints[e.grade] * e.credits, 0);
  const gpaCredits = graded.reduce((n, e) => n + e.credits, 0);
  const listed = new Set(entries.map((e) => e.courseId).filter(Boolean));
  // High school courses with progress that aren't on the transcript yet.
  const suggestions = db.courses
    .filter((c) => c.gradeLevel >= 9 && !listed.has(c.id))
    .map((c) => {
      const ids = c.units.flatMap((u) => u.lessonIds);
      const done = ids.map((id) => getProgress(db, student.id, id)).filter((p) => p?.isCompleted);
      if (done.length === 0) return null;
      const avg = Math.round(done.reduce((n, p) => n + (p!.score || 0), 0) / done.length);
      return { courseId: c.id, courseTitle: c.title, subject: c.subject, completion: Math.round((done.length / ids.length) * 100), averageScore: avg, suggestedGrade: letterGrade(avg), suggestedCredits: 1 };
    })
    .filter(Boolean);
  return {
    student: publicUser(student),
    school: familyFor(db, student.id)?.schoolName ?? db.organizationName,
    entries,
    totalCredits: entries.filter((e) => e.grade !== "F").reduce((n, e) => n + e.credits, 0),
    gpa: gpaCredits ? Math.round((points / gpaCredits) * 100) / 100 : null,
    suggestions,
  };
}

function transcriptFields(db: Database, body: any) {
  const grade = Math.round(Number(body?.gradeLevel));
  if (!(grade >= 9 && grade <= 12)) fail(400, "gradeLevel must be 9–12");
  const credits = Number(body?.credits);
  if (!(credits > 0 && credits <= 3)) fail(400, "credits must be between 0.25 and 3");
  const letter = str(body?.grade, "grade", { max: 3 }).toUpperCase();
  if (!(letter in gradePoints) && letter !== "P") fail(400, "grade must be a letter grade (A–F) or P");
  return {
    courseTitle: str(body?.courseTitle, "courseTitle", { max: 200 }),
    subject: str(body?.subject, "subject", { max: 60 }),
    gradeLevel: grade,
    schoolYear: str(body?.schoolYear, "schoolYear", { max: 20 }),
    credits: Math.round(credits * 100) / 100,
    grade: letter,
    courseId: body?.courseId && db.courses.some((c) => c.id === body.courseId) ? String(body.courseId) : undefined,
    notes: str(body?.notes, "notes", { required: false, max: 500 }) || undefined,
  };
}

on("GET", "/api/students/:id/transcript", ALL, ({ db, user, params }) => transcriptView(db, assertCanViewStudent(db, user, params.id)));

on("POST", "/api/students/:id/transcript", FAMILY, ({ db, user, params, body, env, dirty }) => {
  const student = assertCanRecord(db, user, params.id);
  db.transcripts.push({ id: env.newId(), studentId: student.id, ...transcriptFields(db, body), createdAt: now() });
  dirty();
  return transcriptView(db, student);
});

on("PUT", "/api/transcript/:id", FAMILY, ({ db, user, params, body, dirty }) => {
  const t = db.transcripts.find((x) => x.id === params.id) ?? fail(404, "Entry not found");
  const student = assertCanRecord(db, user, t.studentId);
  Object.assign(t, transcriptFields(db, body));
  dirty();
  return transcriptView(db, student);
});

on("DELETE", "/api/transcript/:id", FAMILY, ({ db, user, params, dirty }) => {
  const t = db.transcripts.find((x) => x.id === params.id) ?? fail(404, "Entry not found");
  const student = assertCanRecord(db, user, t.studentId);
  db.transcripts = db.transcripts.filter((x) => x.id !== t.id);
  dirty();
  return transcriptView(db, student);
});

// ---- portfolio

on("GET", "/api/students/:id/portfolio", ALL, ({ db, user, params }) => {
  const student = assertCanViewStudent(db, user, params.id);
  return db.portfolio.filter((p) => p.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date));
});

on("POST", "/api/students/:id/portfolio", ALL, ({ db, user, params, body, env, dirty }) => {
  const student = assertCanRecord(db, user, params.id);
  const link = str(body?.link, "link", { required: false, max: 500 });
  if (link && !/^https?:\/\//i.test(link)) fail(400, "Links must start with http:// or https://");
  const item = {
    id: env.newId(),
    studentId: student.id,
    title: str(body?.title, "title", { max: 200 }),
    date: str(body?.date, "date", { max: 10 }),
    subject: str(body?.subject, "subject", { max: 60 }),
    description: str(body?.description, "description", { required: false, max: 4000 }),
    link: link || undefined,
    createdBy: user.id,
    createdAt: now(),
  };
  db.portfolio.push(item);
  dirty();
  return item;
});

on("DELETE", "/api/portfolio/:id", ALL, ({ db, user, params, dirty }) => {
  const item = db.portfolio.find((x) => x.id === params.id) ?? fail(404, "Item not found");
  assertCanRecord(db, user, item.studentId);
  db.portfolio = db.portfolio.filter((x) => x.id !== item.id);
  dirty();
  return { ok: true };
});

// ---- co-op classes and calendar

on("GET", "/api/coop/classes", ALL, ({ db, user }) =>
  db.classrooms
    .filter((c) => c.openEnrollment && !c.isFamily)
    .map((c) => {
      const t = findUser(db, c.teacherId);
      return {
        id: c.id,
        name: c.name,
        subject: c.subject,
        description: c.description,
        schedule: c.schedule,
        location: c.location,
        gradeMin: c.gradeMin,
        gradeMax: c.gradeMax,
        fee: c.fee,
        capacity: c.capacity,
        enrolled: c.studentIds.length,
        seatsLeft: c.capacity ? Math.max(0, c.capacity - c.studentIds.length) : null,
        teacherName: t ? displayName(t) : "",
        courseTitle: c.courseId ? db.courses.find((x) => x.id === c.courseId)?.title : undefined,
        myChildren: user.childIds.filter((id) => c.studentIds.includes(id)),
      };
    }),
);

on("POST", "/api/coop/classes/:id/enroll", ["parent", "admin"], ({ db, user, params, body, env, dirty }) => {
  const c = db.classrooms.find((x) => x.id === params.id && x.openEnrollment) ?? fail(404, "Class not found or not open for enrollment");
  const studentId = str(body?.studentId, "studentId", { max: 100 });
  if (user.role !== "admin" && !user.childIds.includes(studentId)) fail(403, "You can only enroll your own children");
  const child = findUser(db, studentId) ?? fail(404, "Student not found");
  if (c.studentIds.includes(studentId)) return { ok: true };
  if (c.capacity && c.studentIds.length >= c.capacity) fail(409, "This class is full");
  const grade = parseGrade(child.gradeLevel);
  if (grade !== undefined && ((c.gradeMin !== undefined && grade < c.gradeMin) || (c.gradeMax !== undefined && grade > c.gradeMax))) {
    fail(400, `${child.firstName} is outside this class's grade range`);
  }
  c.studentIds.push(studentId);
  log(db, env, { type: "note_added", actorId: user.id, studentId, classroomId: c.id, message: `enrolled ${child.firstName} in ${c.name}` });
  dirty();
  return { ok: true };
});

on("DELETE", "/api/coop/classes/:id/enroll/:studentId", ["parent", "admin"], ({ db, user, params, dirty }) => {
  const c = db.classrooms.find((x) => x.id === params.id) ?? fail(404, "Class not found");
  if (user.role !== "admin" && !user.childIds.includes(params.studentId)) fail(403, "You can only withdraw your own children");
  c.studentIds = c.studentIds.filter((s) => s !== params.studentId);
  dirty();
  return { ok: true };
});

on("GET", "/api/events", ALL, ({ db }) => [...db.events].sort((a, b) => a.date.localeCompare(b.date) || (a.startTime ?? "").localeCompare(b.startTime ?? "")));

on("POST", "/api/events", STAFF, ({ db, user, body, env, dirty }) => {
  const date = str(body?.date, "date", { max: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(400, "date must look like 2026-09-14");
  const time = (v: unknown, f: string) => {
    const t = str(v, f, { required: false, max: 5 });
    if (t && !/^\d{2}:\d{2}$/.test(t)) fail(400, `${f} must look like 09:30`);
    return t || undefined;
  };
  const ev = {
    id: env.newId(),
    title: str(body?.title, "title", { max: 200 }),
    date,
    startTime: time(body?.startTime, "startTime"),
    endTime: time(body?.endTime, "endTime"),
    location: str(body?.location, "location", { required: false, max: 200 }) || undefined,
    description: str(body?.description, "description", { required: false, max: 2000 }) || undefined,
    createdBy: user.id,
    createdAt: now(),
  };
  db.events.push(ev);
  dirty();
  return ev;
});

on("DELETE", "/api/events/:id", STAFF, ({ db, user, params, dirty }) => {
  const ev = db.events.find((x) => x.id === params.id) ?? fail(404, "Event not found");
  if (user.role !== "admin" && ev.createdBy !== user.id) fail(403, "Only the organizer or an admin can delete this event");
  db.events = db.events.filter((x) => x.id !== ev.id);
  dirty();
  return { ok: true };
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
  if (body.active !== undefined) {
    if (target.active && !body.active) target.sessionVersion = (target.sessionVersion ?? 1) + 1;
    target.active = !!body.active;
  }
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
    sessionVersion: 1,
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
  if (body?.password) await setPassword(env, target, checkNewPassword(body.password));
  dirty();
  return publicUser(target);
});

on("POST", "/api/admin/users/:id/reset-link", ["admin"], async ({ db, params, env, dirty }) => {
  const target = findUser(db, params.id) ?? fail(404, "User not found");
  const result = await issueResetToken(db, env, target, ADMIN_RESET_TTL_MS);
  dirty();
  return result;
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
  passwordResets: undefined,
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

    const params = Object.fromEntries(
      route.keys.map((k, i) => [k, decodeURIComponent(path.match(route.regex)![i + 1])]),
    );
    // Work on a copy of the session so a request that fails changes nothing.
    const session: Session = { ...req.session };
    const afterCommit: (() => Promise<void>)[] = [];
    try {
      type Outcome = { status: 200 | 401 | 403; result?: unknown };
      const outcome = await env.store.transact<Outcome>(method !== "GET", async (db) => {
        const user = session.userId ? findUser(db, session.userId) : undefined;
        const valid = !!user && user.active && session.sv === user.sessionVersion;
        if (route.roles) {
          if (!valid) return { value: { status: 401 }, changed: false };
          if (!route.roles.includes(user!.role)) return { value: { status: 403 }, changed: false };
        }
        let changed = false;
        const result = await (route.handler as PublicHandler)({
          db,
          user: valid ? user : undefined,
          params,
          body: req.body ?? {},
          session,
          env,
          dirty: () => {
            changed = true;
          },
          after: (fn) => afterCommit.push(fn),
        });
        return { value: { status: 200, result }, changed };
      });

      if (outcome.status === 401) {
        delete req.session.userId;
        delete req.session.sv;
        return { status: 401, body: { message: "Unauthorized" } };
      }
      if (outcome.status === 403) return { status: 403, body: { message: "Forbidden" } };
      delete req.session.userId;
      delete req.session.sv;
      Object.assign(req.session, session);
      for (const fn of afterCommit) await fn().catch((e) => console.error("after-commit task failed:", e));
      return { status: 200, body: outcome.result ?? null };
    } catch (err) {
      if (err instanceof HttpError) return { status: err.status, body: { message: err.message } };
      console.error(err);
      return { status: 500, body: { message: "Something went wrong" } };
    }
  };
}

export type { ActivityType };
