import {
  users,
  schools,
  categories,
  lessons,
  userProgress,
  classrooms,
  studentClassrooms,
  lessonPermissions,
  lessonProposals,
  proposalVotes,
  lessonRatings,
  type User,
  type UpsertUser,
  type School,
  type InsertSchool,
  type Category,
  type Lesson,
  type InsertLesson,
  type UserProgress,
  type InsertUserProgress,
  type Classroom,
  type InsertClassroom,
  type LessonPermission,
  type InsertLessonPermission,
  type LessonProposal,
  type InsertLessonProposal,
  type ProposalVote,
  type InsertProposalVote,
  type LessonRating,
  type InsertLessonRating,
  type UserRole,
  type DifficultyLevel,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // School operations
  createSchool(school: InsertSchool): Promise<School>;
  getSchoolByLicenseKey(licenseKey: string): Promise<School | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  
  // Lesson operations
  getLessons(): Promise<Lesson[]>;
  getLessonsByCategory(categoryId: string): Promise<Lesson[]>;
  getLessonsByDifficulty(difficulty: DifficultyLevel): Promise<Lesson[]>;
  getLessonById(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressByCategory(userId: string, categoryId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Classroom operations
  createClassroom(classroom: InsertClassroom): Promise<Classroom>;
  getClassroomsByTeacher(teacherId: string): Promise<Classroom[]>;
  getStudentsByClassroom(classroomId: string): Promise<User[]>;
  enrollStudentInClassroom(studentId: string, classroomId: string): Promise<void>;
  
  // Permission operations
  grantLessonPermission(permission: InsertLessonPermission): Promise<LessonPermission>;
  getUserPermissions(studentId: string): Promise<string[]>; // returns lesson IDs
  checkLessonPermission(studentId: string, lessonId: string): Promise<boolean>;
  
  // Lesson proposal operations
  createLessonProposal(proposal: InsertLessonProposal): Promise<LessonProposal>;
  getLessonProposals(schoolId: string): Promise<LessonProposal[]>;
  getLessonProposalById(id: string): Promise<LessonProposal | undefined>;
  updateLessonProposalStatus(id: string, status: string): Promise<LessonProposal>;
  submitLessonProposal(id: string): Promise<LessonProposal>;
  approveLessonProposal(id: string): Promise<Lesson>; // converts proposal to lesson
  
  // Proposal voting operations
  voteOnProposal(vote: InsertProposalVote): Promise<ProposalVote>;
  getProposalVotes(proposalId: string): Promise<ProposalVote[]>;
  getUserVoteOnProposal(proposalId: string, userId: string): Promise<ProposalVote | undefined>;
  
  // Lesson rating operations
  rateLesson(rating: InsertLessonRating): Promise<LessonRating>;
  getLessonRatings(lessonId: string): Promise<LessonRating[]>;
  getUserRatingForLesson(lessonId: string, userId: string): Promise<LessonRating | undefined>;
  updateLessonAverageRating(lessonId: string): Promise<void>;
  
  // School-based access
  getLessonsBySchool(schoolId: string): Promise<Lesson[]>;
  checkSchoolAccess(userId: string, resourceSchoolId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // School operations
  async createSchool(school: InsertSchool): Promise<School> {
    const [newSchool] = await db.insert(schools).values(school).returning();
    return newSchool;
  }

  async getSchoolByLicenseKey(licenseKey: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.licenseKey, licenseKey));
    return school;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  // Lesson operations
  async getLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.isActive, true));
  }

  async getLessonsByCategory(categoryId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.categoryId, categoryId), eq(lessons.isActive, true)));
  }

  async getLessonsByDifficulty(difficulty: DifficultyLevel): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.difficulty, difficulty), eq(lessons.isActive, true)));
  }

  async getLessonById(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  // Progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.lastAccessed));
  }

  async getUserProgressByCategory(userId: string, categoryId: string): Promise<UserProgress[]> {
    return await db
      .select({
        id: userProgress.id,
        userId: userProgress.userId,
        lessonId: userProgress.lessonId,
        isCompleted: userProgress.isCompleted,
        score: userProgress.score,
        timeSpent: userProgress.timeSpent,
        lastAccessed: userProgress.lastAccessed,
        completedAt: userProgress.completedAt,
      })
      .from(userProgress)
      .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(lessons.categoryId, categoryId)
        )
      );
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [updated] = await db
      .insert(userProgress)
      .values({
        ...progress,
        lastAccessed: new Date(),
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: {
          ...progress,
          lastAccessed: new Date(),
        },
      })
      .returning();
    return updated;
  }

  // Classroom operations
  async createClassroom(classroom: InsertClassroom): Promise<Classroom> {
    const [newClassroom] = await db.insert(classrooms).values(classroom).returning();
    return newClassroom;
  }

  async getClassroomsByTeacher(teacherId: string): Promise<Classroom[]> {
    return await db
      .select()
      .from(classrooms)
      .where(and(eq(classrooms.teacherId, teacherId), eq(classrooms.isActive, true)));
  }

  async getStudentsByClassroom(classroomId: string): Promise<User[]> {
    return await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        role: users.role,
        schoolId: users.schoolId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .innerJoin(studentClassrooms, eq(users.id, studentClassrooms.studentId))
      .where(eq(studentClassrooms.classroomId, classroomId));
  }

  async enrollStudentInClassroom(studentId: string, classroomId: string): Promise<void> {
    await db.insert(studentClassrooms).values({
      studentId,
      classroomId,
    });
  }

  // Permission operations
  async grantLessonPermission(permission: InsertLessonPermission): Promise<LessonPermission> {
    const [newPermission] = await db.insert(lessonPermissions).values(permission).returning();
    return newPermission;
  }

  async getUserPermissions(studentId: string): Promise<string[]> {
    const permissions = await db
      .select({ lessonId: lessonPermissions.lessonId })
      .from(lessonPermissions)
      .where(eq(lessonPermissions.studentId, studentId));
    
    return permissions.map(p => p.lessonId);
  }

  async checkLessonPermission(studentId: string, lessonId: string): Promise<boolean> {
    const [permission] = await db
      .select()
      .from(lessonPermissions)
      .where(
        and(
          eq(lessonPermissions.studentId, studentId),
          eq(lessonPermissions.lessonId, lessonId)
        )
      );
    
    return !!permission;
  }
  
  // Lesson proposal operations
  async createLessonProposal(proposal: InsertLessonProposal): Promise<LessonProposal> {
    const [newProposal] = await db.insert(lessonProposals).values(proposal).returning();
    return newProposal;
  }

  async getLessonProposals(schoolId: string): Promise<LessonProposal[]> {
    return await db
      .select()
      .from(lessonProposals)
      .where(eq(lessonProposals.schoolId, schoolId))
      .orderBy(desc(lessonProposals.createdAt));
  }

  async getLessonProposalById(id: string): Promise<LessonProposal | undefined> {
    const [proposal] = await db
      .select()
      .from(lessonProposals)
      .where(eq(lessonProposals.id, id));
    return proposal;
  }

  async updateLessonProposalStatus(id: string, status: string): Promise<LessonProposal> {
    const [updated] = await db
      .update(lessonProposals)
      .set({ 
        status: status as any,
        updatedAt: new Date(),
        ...(status === 'submitted' && { submittedAt: new Date() }),
        ...(status === 'approved' && { approvedAt: new Date() })
      })
      .where(eq(lessonProposals.id, id))
      .returning();
    return updated;
  }

  async submitLessonProposal(id: string): Promise<LessonProposal> {
    return this.updateLessonProposalStatus(id, 'submitted');
  }

  async approveLessonProposal(id: string): Promise<Lesson> {
    const proposal = await this.getLessonProposalById(id);
    if (!proposal) throw new Error('Proposal not found');

    // Create lesson from approved proposal
    const [newLesson] = await db.insert(lessons).values({
      title: proposal.title,
      description: proposal.description,
      content: proposal.content,
      categoryId: proposal.categoryId,
      difficulty: proposal.difficulty,
      estimatedDuration: proposal.estimatedDuration,
      programmingLanguage: proposal.programmingLanguage,
      answerGuide: proposal.answerGuide,
      authorId: proposal.authorId,
      schoolId: proposal.schoolId,
    }).returning();

    // Update proposal status
    await this.updateLessonProposalStatus(id, 'approved');

    return newLesson;
  }

  // Proposal voting operations
  async voteOnProposal(vote: InsertProposalVote): Promise<ProposalVote> {
    // Check if user already voted, if so update, otherwise insert
    const existingVote = await this.getUserVoteOnProposal(vote.proposalId, vote.voterId);
    
    if (existingVote) {
      const [updated] = await db
        .update(proposalVotes)
        .set({ vote: vote.vote, comment: vote.comment, createdAt: new Date() })
        .where(eq(proposalVotes.id, existingVote.id))
        .returning();
      return updated;
    } else {
      const [newVote] = await db.insert(proposalVotes).values(vote).returning();
      return newVote;
    }
  }

  async getProposalVotes(proposalId: string): Promise<ProposalVote[]> {
    return await db
      .select()
      .from(proposalVotes)
      .where(eq(proposalVotes.proposalId, proposalId))
      .orderBy(desc(proposalVotes.createdAt));
  }

  async getUserVoteOnProposal(proposalId: string, userId: string): Promise<ProposalVote | undefined> {
    const [vote] = await db
      .select()
      .from(proposalVotes)
      .where(
        and(
          eq(proposalVotes.proposalId, proposalId),
          eq(proposalVotes.voterId, userId)
        )
      );
    return vote;
  }

  // Lesson rating operations
  async rateLesson(rating: InsertLessonRating): Promise<LessonRating> {
    // Check if user already rated, if so update, otherwise insert
    const existingRating = await this.getUserRatingForLesson(rating.lessonId, rating.userId);
    
    if (existingRating) {
      const [updated] = await db
        .update(lessonRatings)
        .set({ rating: rating.rating, comment: rating.comment, updatedAt: new Date() })
        .where(eq(lessonRatings.id, existingRating.id))
        .returning();
      
      // Update lesson average rating
      await this.updateLessonAverageRating(rating.lessonId);
      return updated;
    } else {
      const [newRating] = await db.insert(lessonRatings).values(rating).returning();
      
      // Update lesson average rating
      await this.updateLessonAverageRating(rating.lessonId);
      return newRating;
    }
  }

  async getLessonRatings(lessonId: string): Promise<LessonRating[]> {
    return await db
      .select()
      .from(lessonRatings)
      .where(eq(lessonRatings.lessonId, lessonId))
      .orderBy(desc(lessonRatings.createdAt));
  }

  async getUserRatingForLesson(lessonId: string, userId: string): Promise<LessonRating | undefined> {
    const [rating] = await db
      .select()
      .from(lessonRatings)
      .where(
        and(
          eq(lessonRatings.lessonId, lessonId),
          eq(lessonRatings.userId, userId)
        )
      );
    return rating;
  }

  async updateLessonAverageRating(lessonId: string): Promise<void> {
    const ratings = await this.getLessonRatings(lessonId);
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings)
      : 0;

    await db
      .update(lessons)
      .set({ 
        averageRating,
        totalRatings 
      })
      .where(eq(lessons.id, lessonId));
  }

  // School-based access
  async getLessonsBySchool(schoolId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(
        and(
          eq(lessons.schoolId, schoolId),
          eq(lessons.isActive, true)
        )
      )
      .orderBy(desc(lessons.createdAt));
  }

  async checkSchoolAccess(userId: string, resourceSchoolId: string): Promise<boolean> {
    const user = await this.getUser(userId);
    return user?.schoolId === resourceSchoolId;
  }
}

export const storage = new DatabaseStorage();
