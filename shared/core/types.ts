// Domain types shared by the browser demo backend and the Node server.

export const userRoles = ["admin", "teacher", "parent", "student"] as const;
export type Role = (typeof userRoles)[number];

export const difficultyLevels = ["easy", "medium", "hard"] as const;
export type DifficultyLevel = (typeof difficultyLevels)[number];

export const questionTypes = ["choice", "truefalse", "number", "text", "code"] as const;
export type QuestionType = (typeof questionTypes)[number];

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  /** Parents only: the students this parent can see. */
  childIds: string[];
  /** Students only: free-form grade label, e.g. "Grade 7". */
  gradeLevel?: string;
  /** Students only: birth date (YYYY-MM-DD), used on transcripts and co-op age ranges. */
  birthDate?: string;
  /** Parents only: their home school's records settings, shared with co-parents. */
  family?: FamilySettings;
  active: boolean;
  /** Bumped on password change or deactivation; sessions carrying an older value are rejected. */
  sessionVersion: number;
  createdAt: string;
  lastLoginAt?: string;
}

export type PublicUser = Omit<User, "passwordHash" | "sessionVersion">;

export interface FamilySettings {
  /** e.g. "Johnson Family Academy", printed on transcripts and portfolios. */
  schoolName: string;
  /** e.g. "Ohio", for the records page's reminder of local rules. */
  state?: string;
  /** Instructional days required per school year (many states use 180). */
  requiredDays?: number;
  /** Instructional hours required per school year, if your state counts hours. */
  requiredHours?: number;
  /** Month-day the school year starts, e.g. "08-01". */
  schoolYearStart: string;
}

export interface PasswordReset {
  /** SHA-256 of the token; the token itself only ever exists in the emailed link. */
  tokenHash: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface LessonQuestion {
  id: string;
  prompt: string;
  type: QuestionType;
  /** The correct answer. For choice and true/false it is the text of the correct option. */
  expectedAnswer: string;
  options?: string[];
  /** Short-answer only: other spellings or phrasings that also count as correct. */
  acceptedAnswers?: string[];
  /** Number only: how far from the answer still counts as correct (default 0.001). */
  tolerance?: number;
  caseSensitive?: boolean;
  /** Shown after a wrong attempt. */
  hint?: string;
  /** Shown once the question is answered correctly (or after repeated misses): why the answer is right. */
  explanation?: string;
}

export interface LessonSection {
  id: string;
  title: string;
  description?: string;
  questions: LessonQuestion[];
}

export interface LessonContent {
  sections: LessonSection[];
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface Lesson {
  id: string;
  title: string;
  courseId?: string;
  unitId?: string;
  /** 0 = Kindergarten, 1–12 = grade. */
  gradeLevel?: number;
  /** "Students will be able to…" statements. */
  objectives?: string[];
  vocabulary?: VocabularyTerm[];
  /** Standards codes, e.g. CCSS.MATH.CONTENT.7.RP.A.2 or NGSS MS-LS1-1. */
  standards?: string[];
  description: string;
  /** Markdown reading material, or a JSON string of LessonContent for quiz-only lessons. */
  content: string;
  /** Optional check-for-understanding quiz shown after the reading. */
  quiz?: LessonContent;
  categoryId: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  programmingLanguage?: string;
  /** Teacher-only notes. */
  answerGuide?: string;
  /** Teacher-only rubric for the written response. */
  answer?: string;
  tags: string[];
  authorId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CourseUnit {
  id: string;
  title: string;
  description?: string;
  /** Lessons in teaching order. */
  lessonIds: string[];
}

export interface Course {
  id: string;
  title: string;
  /** A category id: science, technology, engineering, mathematics. */
  subject: string;
  /** 0 = Kindergarten, 1–12 = grade. */
  gradeLevel: number;
  /** For courses spanning grades (electives), the highest grade. */
  gradeLevelMax?: number;
  description: string;
  /** e.g. "Common Core State Standards" or "Next Generation Science Standards". */
  framework?: string;
  units: CourseUnit[];
  authorId: string;
  isActive: boolean;
  createdAt: string;
}

export const gradeLabel = (g: number | undefined, max?: number) => {
  if (g === undefined || g === null) return "";
  const one = (n: number) => (n === 0 ? "K" : String(n));
  if (max !== undefined && max !== g) return `Grades ${one(g)}–${one(max)}`;
  return g === 0 ? "Kindergarten" : `Grade ${g}`;
};

/** Reads a student's free-form grade label ("Grade 7", "K") as a number. */
export function parseGrade(label: string | undefined): number | undefined {
  if (!label) return undefined;
  if (/^\s*(k|kindergarten)\s*$/i.test(label)) return 0;
  const m = label.match(/(\d{1,2})/);
  return m ? Math.min(12, Number(m[1])) : undefined;
}

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export interface Progress {
  userId: string;
  lessonId: string;
  status: ProgressStatus;
  isCompleted: boolean;
  score: number;
  timeSpent: number;
  startedAt: string;
  lastAccessed: string;
  completedAt?: string;
}

export interface QuestionProgress {
  userId: string;
  lessonId: string;
  questionId: string;
  isCorrect: boolean;
  answer: string;
  attempts: number;
  lastUpdated: string;
}

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  studentIds: string[];
  joinCode: string;
  /** The course this class follows, if any. */
  courseId?: string;
  /** Co-op details shown to families browsing classes. */
  description?: string;
  schedule?: string;
  location?: string;
  gradeMin?: number;
  gradeMax?: number;
  capacity?: number;
  /** Free text, e.g. "$40/semester", shown to families. */
  fee?: string;
  /** Families can enroll their own children. */
  openEnrollment?: boolean;
  /** A home-school "class" a parent runs for their own children. */
  isFamily?: boolean;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classroomId: string;
  lessonId: string;
  dueDate: string;
  note?: string;
  /** If set, only these students in the class get the assignment (e.g. one child in a family). */
  studentIds?: string[];
  assignedBy: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  lessonId: string;
  answer: string;
  autoScore: number;
  status: "pending" | "reviewed";
  teacherScore?: number;
  feedback?: string;
  reviewedBy?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Note {
  id: string;
  studentId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Rating {
  userId: string;
  lessonId: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export type ActivityType =
  | "lesson_started"
  | "question_answered"
  | "lesson_completed"
  | "submission_sent"
  | "submission_reviewed"
  | "assignment_created"
  | "note_added"
  | "login";

export interface Activity {
  id: string;
  type: ActivityType;
  actorId: string;
  /** The student this activity is about, used for scoping to teachers and parents. */
  studentId?: string;
  lessonId?: string;
  classroomId?: string;
  message: string;
  createdAt: string;
}

/** Minutes of learning on a day. Logged automatically from lessons, or by hand by a parent or teacher. */
export interface AttendanceEntry {
  id: string;
  studentId: string;
  /** YYYY-MM-DD */
  date: string;
  minutes: number;
  /** A category id (mathematics, science…) or a free-text subject like "Reading" or "Field trip". */
  subject: string;
  note?: string;
  lessonId?: string;
  source: "auto" | "manual";
  loggedBy: string;
  createdAt: string;
}

export interface TranscriptEntry {
  id: string;
  studentId: string;
  courseTitle: string;
  subject: string;
  /** 9–12 */
  gradeLevel: number;
  /** e.g. "2026–2027" */
  schoolYear: string;
  credits: number;
  /** A, A-, B+, … F, or P (pass). */
  grade: string;
  courseId?: string;
  notes?: string;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  studentId: string;
  title: string;
  date: string;
  subject: string;
  description: string;
  link?: string;
  createdBy: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

export interface Database {
  version: number;
  organizationName: string;
  users: User[];
  categories: Category[];
  lessons: Lesson[];
  progress: Progress[];
  questionProgress: QuestionProgress[];
  classrooms: Classroom[];
  assignments: Assignment[];
  submissions: Submission[];
  notes: Note[];
  ratings: Rating[];
  activity: Activity[];
  passwordResets: PasswordReset[];
  courses: Course[];
  attendance: AttendanceEntry[];
  transcripts: TranscriptEntry[];
  portfolio: PortfolioItem[];
  events: CalendarEvent[];
}

export const DB_VERSION = 5;

/** US-style 4.0 scale. P (pass) counts toward credits but not GPA. */
export const gradePoints: Record<string, number> = {
  "A+": 4, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, "D-": 0.7, F: 0,
};

export function letterGrade(percent: number): string {
  const cut: [number, string][] = [[97, "A+"], [93, "A"], [90, "A-"], [87, "B+"], [83, "B"], [80, "B-"], [77, "C+"], [73, "C"], [70, "C-"], [67, "D+"], [63, "D"], [60, "D-"]];
  return cut.find(([min]) => percent >= min)?.[1] ?? "F";
}

/** "2026–2027" for a date, given the month-day the school year starts. */
export function schoolYearOf(dateIso: string, start = "08-01"): string {
  const d = dateIso.slice(0, 10);
  const year = Number(d.slice(0, 4));
  const first = d.slice(5) >= start ? year : year - 1;
  return `${first}–${first + 1}`;
}

/** Upgrades a database saved by an older release in place. */
export function migrateDatabase(db: Database): Database {
  if (db.version < 3) {
    db.passwordResets = db.passwordResets ?? [];
    for (const u of db.users) u.sessionVersion = u.sessionVersion ?? 1;
  }
  if (db.version < 4) db.courses = db.courses ?? [];
  if (db.version < 5) {
    db.attendance = db.attendance ?? [];
    db.transcripts = db.transcripts ?? [];
    db.portfolio = db.portfolio ?? [];
    db.events = db.events ?? [];
  }
  db.version = DB_VERSION;
  return db;
}
