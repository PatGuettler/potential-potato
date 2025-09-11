import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoles = ["student", "teacher", "admin"] as const;

// Users table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: userRoles }).default("student"),
  schoolId: varchar("school_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schools table
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  licenseKey: varchar("license_key").unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// STEM categories
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // Science, Technology, Engineering, Mathematics
  icon: varchar("icon").notNull(),
  description: text("description"),
  color: varchar("color").notNull(),
});

// Lesson difficulty levels
export const difficultyLevels = ["easy", "medium", "hard"] as const;

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"), // JSON content for lesson structure
  categoryId: varchar("category_id").notNull(),
  difficulty: varchar("difficulty", { enum: difficultyLevels }).notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  programmingLanguage: varchar("programming_language"), // for coding lessons
  answerGuide: text("answer_guide"), // teacher-only content
  authorId: varchar("author_id"), // who created the lesson
  schoolId: varchar("school_id"), // which school owns the lesson
  averageRating: integer("average_rating").default(0), // calculated average from ratings
  totalRatings: integer("total_ratings").default(0), // count of ratings
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student progress tracking
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  lessonId: varchar("lesson_id").notNull(),
  isCompleted: boolean("is_completed").default(false),
  score: integer("score"), // percentage or points
  timeSpent: integer("time_spent"), // in minutes
  lastAccessed: timestamp("last_accessed").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Classroom management
export const classrooms = pgTable("classrooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  teacherId: varchar("teacher_id").notNull(),
  schoolId: varchar("school_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student-Classroom relationships
export const studentClassrooms = pgTable("student_classrooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  classroomId: varchar("classroom_id").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

// Lesson permissions (what lessons a student can access)
export const lessonPermissions = pgTable("lesson_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  lessonId: varchar("lesson_id").notNull(),
  grantedBy: varchar("granted_by").notNull(), // teacher ID
  grantedAt: timestamp("granted_at").defaultNow(),
});

// Lesson proposals for collaborative creation
export const lessonProposals = pgTable("lesson_proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  categoryId: varchar("category_id").notNull(),
  difficulty: varchar("difficulty", { enum: difficultyLevels }).notNull(),
  estimatedDuration: integer("estimated_duration"),
  programmingLanguage: varchar("programming_language"),
  answerGuide: text("answer_guide"),
  authorId: varchar("author_id").notNull(),
  schoolId: varchar("school_id").notNull(),
  status: varchar("status", { enum: ["draft", "submitted", "approved", "rejected"] }).default("draft"),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Approval votes for lesson proposals (like GitHub PR reviews)
export const proposalVotes = pgTable("proposal_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").notNull(),
  voterId: varchar("voter_id").notNull(),
  vote: varchar("vote", { enum: ["approve", "reject", "request_changes"] }).notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lesson ratings (1-5 stars)
export const lessonRatings = pgTable("lesson_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").notNull(),
  userId: varchar("user_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Database configuration for deployment
export const dbConfig = pgTable("db_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configKey: varchar("config_key").notNull().unique(),
  configValue: text("config_value"),
  description: text("description"),
  isEncrypted: boolean("is_encrypted").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  progress: many(userProgress),
  teacherClassrooms: many(classrooms, { relationName: "teacherClassrooms" }),
  studentClassrooms: many(studentClassrooms),
  lessonPermissions: many(lessonPermissions),
  authoredLessons: many(lessons),
  proposalsCreated: many(lessonProposals),
  proposalVotes: many(proposalVotes),
  lessonRatings: many(lessonRatings),
}));

export const schoolsRelations = relations(schools, ({ many }) => ({
  users: many(users),
  classrooms: many(classrooms),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  category: one(categories, {
    fields: [lessons.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [lessons.authorId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [lessons.schoolId],
    references: [schools.id],
  }),
  progress: many(userProgress),
  permissions: many(lessonPermissions),
  ratings: many(lessonRatings),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classrooms.teacherId],
    references: [users.id],
    relationName: "teacherClassrooms",
  }),
  school: one(schools, {
    fields: [classrooms.schoolId],
    references: [schools.id],
  }),
  studentClassrooms: many(studentClassrooms),
}));

export const studentClassroomsRelations = relations(studentClassrooms, ({ one }) => ({
  student: one(users, {
    fields: [studentClassrooms.studentId],
    references: [users.id],
  }),
  classroom: one(classrooms, {
    fields: [studentClassrooms.classroomId],
    references: [classrooms.id],
  }),
}));

export const lessonPermissionsRelations = relations(lessonPermissions, ({ one }) => ({
  student: one(users, {
    fields: [lessonPermissions.studentId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonPermissions.lessonId],
    references: [lessons.id],
  }),
  grantedByUser: one(users, {
    fields: [lessonPermissions.grantedBy],
    references: [users.id],
  }),
}));

export const lessonProposalsRelations = relations(lessonProposals, ({ one, many }) => ({
  author: one(users, {
    fields: [lessonProposals.authorId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [lessonProposals.schoolId],
    references: [schools.id],
  }),
  category: one(categories, {
    fields: [lessonProposals.categoryId],
    references: [categories.id],
  }),
  votes: many(proposalVotes),
}));

export const proposalVotesRelations = relations(proposalVotes, ({ one }) => ({
  proposal: one(lessonProposals, {
    fields: [proposalVotes.proposalId],
    references: [lessonProposals.id],
  }),
  voter: one(users, {
    fields: [proposalVotes.voterId],
    references: [users.id],
  }),
}));

export const lessonRatingsRelations = relations(lessonRatings, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonRatings.lessonId],
    references: [lessons.id],
  }),
  user: one(users, {
    fields: [lessonRatings.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});

export const insertClassroomSchema = createInsertSchema(classrooms).omit({
  id: true,
  createdAt: true,
});

export const insertLessonPermissionSchema = createInsertSchema(lessonPermissions).omit({
  id: true,
  grantedAt: true,
});

export const insertLessonProposalSchema = createInsertSchema(lessonProposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  submittedAt: true,
  approvedAt: true,
});

export const insertProposalVoteSchema = createInsertSchema(proposalVotes).omit({
  id: true,
  createdAt: true,
});

export const insertLessonRatingSchema = createInsertSchema(lessonRatings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type Category = typeof categories.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Classroom = typeof classrooms.$inferSelect;
export type InsertClassroom = z.infer<typeof insertClassroomSchema>;
export type LessonPermission = typeof lessonPermissions.$inferSelect;
export type InsertLessonPermission = z.infer<typeof insertLessonPermissionSchema>;
export type LessonProposal = typeof lessonProposals.$inferSelect;
export type InsertLessonProposal = z.infer<typeof insertLessonProposalSchema>;
export type ProposalVote = typeof proposalVotes.$inferSelect;
export type InsertProposalVote = z.infer<typeof insertProposalVoteSchema>;
export type LessonRating = typeof lessonRatings.$inferSelect;
export type InsertLessonRating = z.infer<typeof insertLessonRatingSchema>;
export type UserRole = typeof userRoles[number];
export type DifficultyLevel = typeof difficultyLevels[number];
