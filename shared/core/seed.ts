import type { Activity, Database, Lesson, Progress, Role, User } from "./types";
import { DB_VERSION } from "./types";
import { defaultCategories, lessonQuestions } from "./lessons";

export const DEMO_PASSWORD = "demo1234";

/** Accounts shown on the demo login screen. */
export const demoAccounts: { username: string; role: Role; label: string; blurb: string }[] = [
  { username: "pat", role: "admin", label: "Pat (you)", blurb: "Your personal admin account" },
  { username: "admin", role: "admin", label: "Admin", blurb: "Manage users, families, content and backups" },
  { username: "teacher", role: "teacher", label: "Teacher", blurb: "Classes, assignments, gradebook, reviews" },
  { username: "parent", role: "parent", label: "Parent", blurb: "Follow two kids' progress and teacher notes" },
  { username: "student", role: "student", label: "Student", blurb: "Do lessons, quizzes and assignments" },
];

export function emptyDatabase(lessons: Lesson[], organizationName = "STEM Academy"): Database {
  return {
    version: DB_VERSION,
    organizationName,
    users: [],
    categories: defaultCategories,
    lessons,
    progress: [],
    questionProgress: [],
    classrooms: [],
    assignments: [],
    submissions: [],
    notes: [],
    ratings: [],
    activity: [],
  };
}

/** Small deterministic PRNG so the demo looks the same on every reset. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const DAY = 86400000;

export async function buildDemoDatabase(
  lessons: Lesson[],
  hashPassword: (p: string) => Promise<string>,
  newId: () => string,
): Promise<Database> {
  const db = emptyDatabase(lessons, "Riverside STEM Academy");
  const rand = rng(42);
  const t0 = Date.now();
  const iso = (offsetDays: number) => new Date(t0 + offsetDays * DAY).toISOString();
  const hash = await hashPassword(DEMO_PASSWORD);

  const mk = (username: string, role: Role, firstName: string, lastName: string, extra: Partial<User> = {}): User => {
    const u: User = {
      id: `u-${username}`,
      username,
      passwordHash: hash,
      firstName,
      lastName,
      email: `${username}@example.org`,
      role,
      childIds: [],
      active: true,
      createdAt: iso(-60),
      ...extra,
    };
    db.users.push(u);
    return u;
  };

  mk("pat", "admin", "Pat", "Guettler", { email: "" });
  mk("admin", "admin", "Dana", "Whitfield");
  const rivera = mk("teacher", "teacher", "Maya", "Rivera");
  const chen = mk("teacher2", "teacher", "David", "Chen");

  const studentNames: [string, string, string, string][] = [
    ["student", "Alex", "Johnson", "Grade 7"],
    ["emma", "Emma", "Johnson", "Grade 5"],
    ["jordan", "Jordan", "Lee", "Grade 7"],
    ["sam", "Sam", "Patel", "Grade 7"],
    ["riley", "Riley", "Kim", "Grade 7"],
    ["taylor", "Taylor", "Brooks", "Grade 7"],
    ["morgan", "Morgan", "Diaz", "Grade 7"],
    ["casey", "Casey", "Nguyen", "Grade 7"],
    ["avery", "Avery", "Wilson", "Grade 7"],
    ["jamie", "Jamie", "Ortiz", "Grade 5"],
    ["quinn", "Quinn", "Foster", "Grade 5"],
    ["harper", "Harper", "Singh", "Grade 5"],
  ];
  const students = studentNames.map(([u, f, l, g]) => mk(u, "student", f, l, { gradeLevel: g }));
  const [alex, emma] = students;
  // How reliably each student finishes work, so the gradebook has realistic spread.
  const diligence: Record<string, number> = Object.fromEntries(
    students.map((s, i) => [s.id, [0.85, 0.95, 0.95, 0.6, 0.85, 0.4, 0.9, 0.8, 1, 0.8, 0.6, 0.9][i]]),
  );

  const parent = mk("parent", "parent", "Jennifer", "Johnson", { childIds: [alex.id, emma.id] });
  mk("parent2", "parent", "Marcus", "Lee", { childIds: [students[2].id] });

  const classes = [
    { id: "c-p2", name: "Period 2 · Physical Science", subject: "Science", teacherId: rivera.id, studentIds: students.slice(0, 1).concat(students.slice(2, 9)).map((s) => s.id), joinCode: "SCI2RV" },
    { id: "c-p4", name: "Period 4 · Intro to Coding", subject: "Technology", teacherId: rivera.id, studentIds: [alex, ...students.slice(3, 8)].map((s) => s.id), joinCode: "CODE4R" },
    { id: "c-mc", name: "Math Club", subject: "Mathematics", teacherId: chen.id, studentIds: [emma, ...students.slice(9)].map((s) => s.id), joinCode: "MATHCB" },
  ];
  for (const c of classes) db.classrooms.push({ ...c, createdAt: iso(-45) });

  const plan: [string, string, number][] = [
    ["c-p2", "sci001", -18],
    ["c-p2", "sci002", -9],
    ["c-p2", "eng001", -2],
    ["c-p2", "sci003", 4],
    ["c-p2", "eng002", 11],
    ["c-p4", "tech001", -14],
    ["c-p4", "tech002", -3],
    ["c-p4", "tech003", 6],
    ["c-mc", "math004", -10],
    ["c-mc", "math001", -4],
    ["c-mc", "math002", 3],
    ["c-mc", "math003", 10],
  ];

  const byId = new Map(lessons.map((l) => [l.id, l]));
  const activity: Activity[] = [];
  const act = (a: Omit<Activity, "id">) => activity.push({ ...a, id: newId() });
  const progressFor = (userId: string, lessonId: string) => db.progress.find((p) => p.userId === userId && p.lessonId === lessonId);

  for (const [classroomId, lessonId, dueOffset] of plan) {
    const lesson = byId.get(lessonId);
    if (!lesson) continue;
    const classroom = db.classrooms.find((c) => c.id === classroomId)!;
    // Assigned a week before the due date, but never in the future.
    const assignedAt = Math.min(dueOffset - 7, -1);
    db.assignments.push({
      id: `a-${classroomId}-${lessonId}`,
      classroomId,
      lessonId,
      dueDate: iso(dueOffset),
      assignedBy: classroom.teacherId,
      createdAt: iso(assignedAt),
      note: dueOffset > 0 ? "Read carefully, then finish the quiz." : undefined,
    });
    act({ type: "assignment_created", actorId: classroom.teacherId, classroomId, lessonId, message: `assigned "${lesson.title}" to ${classroom.name}`, createdAt: iso(assignedAt) });

    const questions = lessonQuestions(lesson);
    for (const sid of classroom.studentIds) {
      if (progressFor(sid, lessonId)) continue;
      const d = diligence[sid];
      // Past-due work is mostly done; upcoming work is mostly not started yet.
      const chanceDone = dueOffset < 0 ? Math.min(1, d + 0.15) : d * 0.35;
      const roll = rand();
      if (roll > chanceDone + 0.2) continue;
      const startedDay = Math.min(assignedAt + 1 + rand() * 4, -0.3);
      const done = roll <= chanceDone;
      const correctCount = done ? questions.length : Math.floor(questions.length * rand());
      const firstTryRight = questions.filter(() => rand() < 0.5 + d / 2).length;
      const p: Progress = {
        userId: sid,
        lessonId,
        status: done ? "completed" : "in_progress",
        isCompleted: done,
        score: questions.length ? Math.round((done ? Math.max(60, (firstTryRight / questions.length) * 100) : (correctCount / questions.length) * 100)) : 100,
        timeSpent: Math.round(lesson.estimatedDuration * (0.6 + rand() * 0.8)),
        startedAt: iso(Math.min(startedDay, -0.2)),
        lastAccessed: iso(Math.min(startedDay + 1, -0.1)),
        completedAt: done ? iso(Math.min(startedDay + 1, -0.1)) : undefined,
      };
      db.progress.push(p);
      questions.slice(0, correctCount).forEach((q) =>
        db.questionProgress.push({ userId: sid, lessonId, questionId: q.id, isCorrect: true, answer: q.expectedAnswer, attempts: 1 + (rand() < 0.3 ? 1 : 0), lastUpdated: p.lastAccessed }),
      );
      act({ type: "lesson_started", actorId: sid, studentId: sid, lessonId, message: "started a lesson", createdAt: p.startedAt });
      if (done) act({ type: "lesson_completed", actorId: sid, studentId: sid, lessonId, message: `completed a lesson (${p.score}%)`, createdAt: p.completedAt! });
    }
  }

  // Alex is the featured demo student: guarantee a mix of finished, in-progress and overdue work.
  const ensure = (userId: string, lessonId: string, status: Progress["status"], score: number, daysAgo: number) => {
    db.progress = db.progress.filter((p) => !(p.userId === userId && p.lessonId === lessonId));
    db.questionProgress = db.questionProgress.filter((q) => !(q.userId === userId && q.lessonId === lessonId));
    if (status === "not_started") return;
    const lesson = byId.get(lessonId)!;
    const qs = lessonQuestions(lesson);
    const correct = status === "completed" ? qs.length : Math.floor(qs.length / 2);
    db.progress.push({
      userId, lessonId, status, isCompleted: status === "completed", score, timeSpent: lesson.estimatedDuration,
      startedAt: iso(-daysAgo - 1), lastAccessed: iso(-daysAgo), completedAt: status === "completed" ? iso(-daysAgo) : undefined,
    });
    qs.slice(0, correct).forEach((q) => db.questionProgress.push({ userId, lessonId, questionId: q.id, isCorrect: true, answer: q.expectedAnswer, attempts: 1, lastUpdated: iso(-daysAgo) }));
  };
  ensure(alex.id, "sci001", "completed", 100, 15);
  ensure(alex.id, "sci002", "completed", 67, 8);
  ensure(alex.id, "tech001", "completed", 100, 12);
  ensure(alex.id, "eng001", "not_started", 0, 0);
  ensure(alex.id, "tech002", "in_progress", 33, 1);
  ensure(alex.id, "sci003", "not_started", 0, 0);
  ensure(emma.id, "math004", "completed", 100, 9);
  ensure(emma.id, "math001", "completed", 100, 3);

  db.submissions.push(
    { id: newId(), userId: alex.id, lessonId: "sci001", answer: "Force is a push or pull, like when I kick a soccer ball. Motion is when something changes position over time, like a car driving. Energy is the ability to do work, like a battery powering a flashlight.", autoScore: 72, status: "reviewed", teacherScore: 92, feedback: "Great everyday examples, Alex! Next time mention gravity as a force too.", reviewedBy: rivera.id, submittedAt: iso(-15), reviewedAt: iso(-14) },
    { id: newId(), userId: alex.id, lessonId: "sci002", answer: "Water evaporates from the ocean because of the sun, then it condenses into clouds and falls as rain.", autoScore: 55, status: "pending", submittedAt: iso(-1) },
    { id: newId(), userId: students[2].id, lessonId: "sci002", answer: "Evaporation, condensation, precipitation and collection. The sun powers the cycle and it gives us fresh water.", autoScore: 81, status: "pending", submittedAt: iso(-2) },
    { id: newId(), userId: students[4].id, lessonId: "sci001", answer: "Force makes things move. Energy is power.", autoScore: 30, status: "pending", submittedAt: iso(-3) },
  );
  act({ type: "submission_sent", actorId: alex.id, studentId: alex.id, lessonId: "sci002", message: "submitted a written response", createdAt: iso(-1) });
  act({ type: "submission_reviewed", actorId: rivera.id, studentId: alex.id, lessonId: "sci001", message: "reviewed a written response (92%)", createdAt: iso(-14) });

  db.notes.push(
    { id: newId(), studentId: alex.id, authorId: rivera.id, body: "Alex has been a great lab partner this unit. The Engineering Design lesson is overdue, so please encourage Alex to finish it this weekend.", createdAt: iso(-1.5) },
    { id: newId(), studentId: alex.id, authorId: parent.id, body: "Thanks! We'll set aside time Saturday morning.", createdAt: iso(-1.2) },
    { id: newId(), studentId: emma.id, authorId: chen.id, body: "Emma is flying through Math Club. She could try the Geometry lesson early if she likes.", createdAt: iso(-2) },
  );
  act({ type: "note_added", actorId: rivera.id, studentId: alex.id, message: "left a note about Alex Johnson", createdAt: iso(-1.5) });

  for (const s of students) {
    if (rand() < 0.6) db.ratings.push({ userId: s.id, lessonId: "sci001", rating: 4 + Math.round(rand()), createdAt: iso(-10) });
    if (rand() < 0.4) db.ratings.push({ userId: s.id, lessonId: "tech001", rating: 3 + Math.round(rand() * 2), createdAt: iso(-8) });
  }

  db.activity = activity.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return db;
}
