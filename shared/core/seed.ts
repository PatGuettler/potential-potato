import type { Activity, Database, Progress, Role, User } from "./types";
import { DB_VERSION, letterGrade, schoolYearOf } from "./types";
import { defaultCategories, lessonQuestions } from "./lessons";
import { buildCurriculum } from "../curriculum";

export const DEMO_PASSWORD = "demo1234";

/** Accounts shown on the demo login screen. */
export const demoAccounts: { username: string; role: Role; label: string; blurb: string }[] = [
  { username: "pat", role: "admin", label: "Pat (you)", blurb: "Your personal admin account" },
  { username: "admin", role: "admin", label: "Admin", blurb: "Manage users, families, content and backups" },
  { username: "parent", role: "parent", label: "Homeschool parent", blurb: "Jennifer teaches 3 kids: plans, attendance, transcripts" },
  { username: "teacher", role: "teacher", label: "Co-op teacher", blurb: "Co-op classes, gradebook, reviews, calendar" },
  { username: "student", role: "student", label: "Student", blurb: "Alex, Grade 7: lessons, quizzes, assignments" },
];

export function emptyDatabase(organizationName = "STEM Academy"): Database {
  const { courses, lessons } = buildCurriculum();
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
    passwordResets: [],
    courses,
    attendance: [],
    transcripts: [],
    portfolio: [],
    events: [],
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
  hashPassword: (p: string) => Promise<string>,
  newId: () => string,
): Promise<Database> {
  const db = emptyDatabase("Riverside Homeschool Co-op");
  const lessons = db.lessons;
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
      sessionVersion: 1,
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
  alex.birthDate = "2013-04-12";
  emma.birthDate = "2015-09-03";
  const liam = mk("liam", "student", "Liam", "Johnson", { gradeLevel: "Grade 10", birthDate: "2010-02-21" });
  // How reliably each student finishes work, so the gradebook has realistic spread.
  const diligence: Record<string, number> = Object.fromEntries(
    students.map((s, i) => [s.id, [0.85, 0.95, 0.95, 0.6, 0.85, 0.4, 0.9, 0.8, 1, 0.8, 0.6, 0.9][i]]),
  );
  diligence[liam.id] = 0.95;

  const family = { schoolName: "Johnson Family Academy", state: "Ohio", requiredDays: 180, requiredHours: 900, schoolYearStart: "08-01" };
  const parent = mk("parent", "parent", "Jennifer", "Johnson", { childIds: [alex.id, emma.id, liam.id], family });
  mk("parent2", "parent", "Marcus", "Lee", { childIds: [students[2].id] });

  const classes = [
    {
      id: "c-p2", name: "Life Science Lab", subject: "Science", courseId: "sci-7", teacherId: rivera.id, studentIds: students.slice(0, 1).concat(students.slice(2, 9)).map((s) => s.id), joinCode: "SCI2RV",
      openEnrollment: true, schedule: "Tuesdays 10:00–11:30", location: "Fellowship Hall", gradeMin: 6, gradeMax: 8, capacity: 12, fee: "$45/semester (lab supplies)",
      description: "Hands-on labs to go with Grade 7 Life Science: microscopes, dissections, and an ecosystem-in-a-jar project.",
    },
    {
      id: "c-p4", name: "Middle School Math Circle", subject: "Mathematics", courseId: "math-7", teacherId: rivera.id, studentIds: [alex, ...students.slice(3, 8)].map((s) => s.id), joinCode: "MATH4R",
      openEnrollment: true, schedule: "Thursdays 1:00–2:00", location: "Room 4", gradeMin: 6, gradeMax: 8, capacity: 10, fee: "Free",
      description: "Small-group problem solving that follows Grade 7 Math. Bring your questions from the week.",
    },
    {
      id: "c-mc", name: "Grade 5 Math Lab", subject: "Mathematics", courseId: "math-5", teacherId: chen.id, studentIds: [emma, ...students.slice(9)].map((s) => s.id), joinCode: "MATH5C",
      openEnrollment: true, schedule: "Tuesdays 1:00–2:00", location: "Room 2", gradeMin: 4, gradeMax: 6, capacity: 10, fee: "$15/semester",
      description: "Manipulatives and games for fractions, volume, and the coordinate plane.",
    },
    {
      id: "c-robo", name: "Lego Robotics Club", subject: "Engineering", courseId: "eng-35", teacherId: chen.id, studentIds: [emma, students[10], students[11]].map((s) => s.id), joinCode: "ROBO35",
      openEnrollment: true, schedule: "Fridays 10:00–11:30", location: "Maker Room", gradeMin: 3, gradeMax: 6, capacity: 8, fee: "$60/semester (kits provided)",
      description: "Build and program robots, then compete in a friendly end-of-term challenge.",
    },
    {
      id: "c-fam", name: family.schoolName, subject: "Home school", teacherId: parent.id, studentIds: [alex.id, emma.id, liam.id], joinCode: "JFAM01", isFamily: true,
    },
  ];
  for (const c of classes) db.classrooms.push({ ...c, createdAt: iso(-45) });

  // [class, lesson, days until due, optional: only these students]
  const plan: [string, string, number, string[]?][] = [
    ["c-p2", "sci-7-1-1", -18],
    ["c-p2", "sci-7-1-2", -9],
    ["c-p2", "sci-7-2-1", -2],
    ["c-p2", "sci-7-2-2", 5],
    ["c-p4", "math-7-1-1", -14],
    ["c-p4", "math-7-1-2", -3],
    ["c-p4", "math-7-2-1", 4],
    ["c-p4", "math-7-2-2", 11],
    ["c-mc", "math-5-1-1", -10],
    ["c-mc", "math-5-1-2", -4],
    ["c-mc", "math-5-2-1", 3],
    ["c-mc", "math-5-2-2", 10],
    // Johnson Family Academy: each child has their own plan.
    ["c-fam", "geometry-1-1", -20, [liam.id]],
    ["c-fam", "geometry-1-2", -13, [liam.id]],
    ["c-fam", "geometry-2-1", -6, [liam.id]],
    ["c-fam", "geometry-2-2", 1, [liam.id]],
    ["c-fam", "chemistry-1-1", -4, [liam.id]],
    ["c-fam", "chemistry-1-2", 3, [liam.id]],
    ["c-fam", "sci-5-1-1", -12, [emma.id]],
    ["c-fam", "sci-5-1-2", -5, [emma.id]],
    ["c-fam", "sci-5-2-1", 2, [emma.id]],
    ["c-fam", "cs-68-1-1", -8, [alex.id]],
    ["c-fam", "cs-68-1-2", 2, [alex.id]],
    ["c-robo", "eng-35-1-1", -7],
    ["c-robo", "eng-35-1-2", 7],
  ];

  const byId = new Map(lessons.map((l) => [l.id, l]));
  const activity: Activity[] = [];
  const act = (a: Omit<Activity, "id">) => activity.push({ ...a, id: newId() });
  const progressFor = (userId: string, lessonId: string) => db.progress.find((p) => p.userId === userId && p.lessonId === lessonId);

  for (const [classroomId, lessonId, dueOffset, only] of plan) {
    const lesson = byId.get(lessonId);
    if (!lesson) continue;
    const classroom = db.classrooms.find((c) => c.id === classroomId)!;
    // Assigned a week before the due date, but never in the future.
    const assignedAt = Math.min(dueOffset - 7, -1);
    db.assignments.push({
      id: `a-${classroomId}-${lessonId}`,
      classroomId,
      lessonId,
      studentIds: only,
      dueDate: iso(dueOffset),
      assignedBy: classroom.teacherId,
      createdAt: iso(assignedAt),
      note: dueOffset > 0 ? "Read carefully, then finish the quiz." : undefined,
    });
    act({ type: "assignment_created", actorId: classroom.teacherId, classroomId, lessonId, message: `assigned "${lesson.title}" to ${classroom.name}`, createdAt: iso(assignedAt) });

    const questions = lessonQuestions(lesson);
    for (const sid of only ?? classroom.studentIds) {
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
  ensure(alex.id, "sci-7-1-1", "completed", 100, 15);
  ensure(alex.id, "sci-7-1-2", "completed", 75, 8);
  ensure(alex.id, "math-7-1-1", "completed", 100, 12);
  ensure(alex.id, "sci-7-2-1", "not_started", 0, 0);
  ensure(alex.id, "math-7-1-2", "in_progress", 50, 1);
  ensure(alex.id, "sci-7-2-2", "not_started", 0, 0);
  ensure(emma.id, "math-5-1-1", "completed", 100, 9);
  ensure(emma.id, "math-5-1-2", "completed", 75, 3);

  db.submissions.push(
    { id: newId(), userId: alex.id, lessonId: "sci-7-1-2", answer: "When I eat, my digestive system breaks food into nutrients like glucose. My circulatory system carries the glucose and oxygen to my muscles. When I run, my respiratory system breathes faster to get more oxygen and get rid of carbon dioxide, and my heart beats faster.", autoScore: 74, status: "reviewed", teacherScore: 92, feedback: "Excellent, Alex! You connected three systems clearly. Next time, mention that the nervous system coordinates all of this.", reviewedBy: rivera.id, submittedAt: iso(-8), reviewedAt: iso(-7) },
    { id: newId(), userId: students[2].id, lessonId: "sci-7-1-2", answer: "The digestive system turns food into glucose, the circulatory system carries it with oxygen from the lungs, and muscles use it for energy. The nervous system tells everything to speed up when I run.", autoScore: 81, status: "pending", submittedAt: iso(-2) },
    { id: newId(), userId: students[4].id, lessonId: "sci-7-1-2", answer: "You eat food and then you run. Your heart beats.", autoScore: 22, status: "pending", submittedAt: iso(-3) },
    { id: newId(), userId: students[6].id, lessonId: "sci-7-2-1", answer: "I disagree. Plants do cellular respiration in their mitochondria, which needs oxygen and glucose, so they need oxygen too. They just make more oxygen than they use during the day.", autoScore: 86, status: "pending", submittedAt: iso(-1) },
  );
  act({ type: "submission_sent", actorId: students[6].id, studentId: students[6].id, lessonId: "sci-7-2-1", message: "submitted a written response", createdAt: iso(-1) });
  act({ type: "submission_reviewed", actorId: rivera.id, studentId: alex.id, lessonId: "sci-7-1-2", message: "reviewed a written response (92%)", createdAt: iso(-7) });

  db.notes.push(
    { id: newId(), studentId: alex.id, authorId: rivera.id, body: "Alex has been a great lab partner during our cells unit. The Photosynthesis lesson is overdue, so please encourage Alex to finish it this weekend.", createdAt: iso(-1.5) },
    { id: newId(), studentId: alex.id, authorId: parent.id, body: "Thanks for letting us know! We'll set aside time Saturday morning.", createdAt: iso(-1.2) },
    { id: newId(), studentId: emma.id, authorId: chen.id, body: "Emma is doing great with fractions. She's ready to try the Volume lesson early if she'd like a challenge.", createdAt: iso(-2) },
  );
  act({ type: "note_added", actorId: rivera.id, studentId: alex.id, message: "left a note about Alex Johnson", createdAt: iso(-1.5) });

  for (const s of students) {
    if (rand() < 0.6) db.ratings.push({ userId: s.id, lessonId: "sci-7-1-1", rating: 4 + Math.round(rand()), createdAt: iso(-10) });
    if (rand() < 0.4) db.ratings.push({ userId: s.id, lessonId: "math-7-1-1", rating: 3 + Math.round(rand() * 2), createdAt: iso(-8) });
  }

  // Liam finished Algebra I and Biology last school year at home.
  const lastYear = schoolYearOf(iso(-330), family.schoolYearStart);
  const finishCourse = (courseId: string, fromDay: number, scoreBase: number) => {
    const course = db.courses.find((c) => c.id === courseId)!;
    const ids = course.units.flatMap((u) => u.lessonIds);
    ids.forEach((lessonId, i) => {
      const lesson = byId.get(lessonId)!;
      const day = fromDay + Math.floor((i * 200) / ids.length);
      const qs = lessonQuestions(lesson);
      db.progress.push({
        userId: liam.id, lessonId, status: "completed", isCompleted: true,
        score: Math.min(100, Math.round(scoreBase + rand() * 12)), timeSpent: Math.round(lesson.estimatedDuration * (0.8 + rand() * 0.5)),
        startedAt: iso(day - 1), lastAccessed: iso(day), completedAt: iso(day),
      });
      qs.forEach((q) => db.questionProgress.push({ userId: liam.id, lessonId, questionId: q.id, isCorrect: true, answer: q.expectedAnswer, attempts: 1, lastUpdated: iso(day) }));
    });
  };
  finishCourse("algebra-1", -400, 84);
  finishCourse("biology", -395, 80);
  const avgFor = (courseId: string) => {
    const ids = new Set(db.courses.find((c) => c.id === courseId)!.units.flatMap((u) => u.lessonIds));
    const ps = db.progress.filter((p) => p.userId === liam.id && ids.has(p.lessonId));
    return Math.round(ps.reduce((n, p) => n + p.score, 0) / ps.length);
  };
  const tx = (courseTitle: string, subject: string, grade: string, credits = 1, courseId?: string, notes?: string) =>
    db.transcripts.push({ id: newId(), studentId: liam.id, courseTitle, subject, gradeLevel: 9, schoolYear: lastYear, credits, grade, courseId, notes, createdAt: iso(-90) });
  tx("Algebra I", "mathematics", letterGrade(avgFor("algebra-1")), 1, "algebra-1");
  tx("Biology", "science", letterGrade(avgFor("biology")), 1, "biology", "Lab science");
  tx("English 9: Literature & Composition", "English", "A");
  tx("World History", "Social studies", "B+");
  tx("Spanish I", "Foreign language", "A-");
  tx("Physical Education", "Physical education", "P", 0.5);

  // Attendance: lesson time becomes automatic entries; parents log everything else.
  for (const p of db.progress) {
    const lesson = byId.get(p.lessonId);
    if (!lesson || p.timeSpent <= 0) continue;
    db.attendance.push({ id: newId(), studentId: p.userId, date: (p.completedAt ?? p.lastAccessed).slice(0, 10), minutes: p.timeSpent, subject: lesson.categoryId, lessonId: lesson.id, source: "auto", loggedBy: p.userId, createdAt: p.lastAccessed });
  }
  const homeSubjects: Record<string, [string, number, string][]> = {
    [emma.id]: [["Reading", 40, "Read aloud: Charlotte's Web"], ["Writing", 30, "Journal entry"], ["History", 30, "Ancient Egypt unit"], ["Art", 45, "Watercolor landscapes"], ["Physical education", 30, "Bike ride"]],
    [alex.id]: [["Reading", 45, "Independent reading: Hatchet"], ["Writing", 40, "Persuasive essay draft"], ["History", 45, "American Revolution"], ["Music", 30, "Piano practice"], ["Physical education", 45, "Soccer practice"]],
    [liam.id]: [["Reading", 60, "The Odyssey, books 9–12"], ["Writing", 45, "Literary analysis essay"], ["History", 50, "U.S. History: Reconstruction"], ["Foreign language", 40, "Spanish II, chapter 3"], ["Physical education", 45, "Cross-country training"]],
  };
  for (const [sid, list] of Object.entries(homeSubjects)) {
    for (let back = 1; back <= 45; back++) {
      const d = new Date(t0 - back * DAY);
      if (d.getUTCDay() === 0 || d.getUTCDay() === 6) continue;
      const date = d.toISOString().slice(0, 10);
      list.forEach(([subject, minutes, note], i) => {
        if ((back + i) % 2 === 0 && i > 1) return; // not every subject every day
        db.attendance.push({ id: newId(), studentId: sid, date, minutes: minutes + Math.round(rand() * 15), subject, note, source: "manual", loggedBy: parent.id, createdAt: d.toISOString() });
      });
    }
  }
  db.attendance.push({ id: newId(), studentId: emma.id, date: iso(-9).slice(0, 10), minutes: 180, subject: "Field trip", note: "COSI science museum with the co-op", source: "manual", loggedBy: parent.id, createdAt: iso(-9) });
  db.attendance.push({ id: newId(), studentId: alex.id, date: iso(-9).slice(0, 10), minutes: 180, subject: "Field trip", note: "COSI science museum with the co-op", source: "manual", loggedBy: parent.id, createdAt: iso(-9) });

  db.portfolio.push(
    { id: newId(), studentId: emma.id, title: "Rain-gauge weather journal", date: iso(-16).slice(0, 10), subject: "science", description: "Built a rain gauge from a bottle and recorded rainfall and temperature for two weeks, then graphed the results.", createdBy: parent.id, createdAt: iso(-16) },
    { id: newId(), studentId: emma.id, title: "Fraction pizza poster", date: iso(-6).slice(0, 10), subject: "mathematics", description: "Showed equivalent fractions with paper pizzas and explained how 2/4 = 1/2.", createdBy: parent.id, createdAt: iso(-6) },
    { id: newId(), studentId: alex.id, title: "Cell model (edible)", date: iso(-12).slice(0, 10), subject: "science", description: "Made a plant cell out of gelatin and candy, labeling the nucleus, chloroplasts, cell wall, and vacuole.", createdBy: parent.id, createdAt: iso(-12) },
    { id: newId(), studentId: liam.id, title: "Geometry proof portfolio", date: iso(-5).slice(0, 10), subject: "mathematics", description: "Two-column proofs of triangle congruence using SAS and ASA, with diagrams.", createdBy: parent.id, createdAt: iso(-5) },
  );

  const nextWeekday = (from: number, weekday: number) => {
    const d = new Date(t0 + from * DAY);
    while (d.getUTCDay() !== weekday) d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  };
  const ev = (title: string, date: string, extra: Partial<Database["events"][number]> = {}) =>
    db.events.push({ id: newId(), title, date, createdBy: rivera.id, createdAt: iso(-20), ...extra });
  for (let w = 0; w < 6; w++) ev("Co-op class day", nextWeekday(w * 7, 2), { startTime: "09:30", endTime: "14:30", location: "Grace Fellowship Hall", description: "Classes run all day. Bring a lunch and a snack to share." });
  ev("Field trip: COSI science museum", iso(-9).slice(0, 10), { startTime: "10:00", endTime: "13:00", location: "COSI, Columbus" });
  ev("Park day & nature walk", nextWeekday(3, 5), { startTime: "13:00", endTime: "15:00", location: "Highbanks Metro Park", description: "Bring field guides for the leaf-identification challenge." });
  ev("Parent planning meeting", nextWeekday(10, 4), { startTime: "19:00", endTime: "20:00", location: "Online (link in email)" });
  ev("Co-op science fair", nextWeekday(24, 5), { startTime: "10:00", endTime: "12:00", location: "Grace Fellowship Hall", description: "Every student presents a project. Judges from the local university." });

  db.activity = activity.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return db;
}
