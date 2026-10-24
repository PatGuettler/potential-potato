// Domain types shared by the browser demo backend and the Node server.

export const userRoles = ["admin", "teacher", "parent", "student"] as const;
export type Role = (typeof userRoles)[number];

export const difficultyLevels = ["easy", "medium", "hard"] as const;
export type DifficultyLevel = (typeof difficultyLevels)[number];

export const questionTypes = ["text", "number", "code", "choice"] as const;
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
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type PublicUser = Omit<User, "passwordHash">;

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
  expectedAnswer: string;
  options?: string[];
  caseSensitive?: boolean;
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

export interface Lesson {
  id: string;
  title: string;
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
  createdAt: string;
}

export interface Assignment {
  id: string;
  classroomId: string;
  lessonId: string;
  dueDate: string;
  note?: string;
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
}

export const DB_VERSION = 2;
