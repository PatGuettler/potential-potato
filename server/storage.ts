import {
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
  type LessonContent,
  type LessonContentUnion,
  lessonContentSchema,
} from "@shared/schema";
import { nanoid } from "nanoid";
import * as fs from "fs";
import * as path from "path";
import { getDataDir } from "./paths";

// Types for question progress tracking
export interface QuestionProgress {
  userId: string;
  lessonId: string;
  questionId: string;
  isCorrect: boolean;
  answer: string;
  lastUpdated: Date;
}

export interface LessonScore {
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  questionProgress: Map<string, QuestionProgress>;
}

// CSV parsing utility that properly handles multiline quoted fields
function parseCSV(content: string): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const chars = content.trim();
  let i = 0;
  
  // Parse headers first
  const headers: string[] = [];
  let currentHeader = '';
  let inQuotes = false;
  
  // Parse header row
  while (i < chars.length && chars[i] !== '\n') {
    const char = chars[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      headers.push(currentHeader.trim());
      currentHeader = '';
    } else if (char !== '\r') {
      currentHeader += char;
    }
    i++;
  }
  headers.push(currentHeader.trim());
  
  // Skip the newline after headers
  if (chars[i] === '\n') i++;
  
  // Parse data rows
  while (i < chars.length) {
    const row: Record<string, string> = {};
    let headerIndex = 0;
    let currentValue = '';
    inQuotes = false;
    
    while (i < chars.length && headerIndex < headers.length) {
      const char = chars[i];
      
      if (char === '"') {
        if (inQuotes && i + 1 < chars.length && chars[i + 1] === '"') {
          // Handle escaped quotes ("")
          currentValue += '"';
          i++; // Skip the second quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        row[headers[headerIndex]] = currentValue.trim();
        currentValue = '';
        headerIndex++;
      } else if ((char === '\n' || char === '\r\n') && !inQuotes) {
        // End of row
        row[headers[headerIndex]] = currentValue.trim();
        break;
      } else if (char !== '\r') {
        // Regular character (skip \r)
        currentValue += char;
      }
      i++;
    }
    
    // Handle last field in row
    if (headerIndex < headers.length) {
      row[headers[headerIndex]] = currentValue.trim();
    }
    
    // Only add non-empty rows
    if (Object.keys(row).length > 0 && Object.values(row).some(v => v !== '')) {
      rows.push(row);
    }
    
    // Skip any remaining newlines
    while (i < chars.length && (chars[i] === '\n' || chars[i] === '\r')) {
      i++;
    }
  }
  
  return rows;
}

// Load lessons from CSV files
function loadLessonsFromCSV(): Lesson[] {
  const lessons: Lesson[] = [];
  const dataDir = path.join(getDataDir(), 'data', 'lessons');
  const csvFiles = ['science.csv', 'technology.csv', 'engineering.csv', 'mathematics.csv'];
  
  for (const csvFile of csvFiles) {
    const filePath = path.join(dataDir, csvFile);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const rows = parseCSV(content);
        
        for (const row of rows) {
          if (row.id && row.title) {
            // Map difficulty from CSV format to expected format
            const mapDifficulty = (csvDifficulty: string): DifficultyLevel => {
              const normalized = csvDifficulty.toLowerCase().trim();
              if (normalized === 'easy') return 'easy';
              if (normalized === 'medium') return 'medium';
              if (normalized === 'hard') return 'hard';
              return 'easy'; // default fallback
            };

            const lesson: Lesson = {
              id: row.id,
              title: row.title,
              description: row.summary || '',
              content: serializeLessonContent(parseLessonContent(row.content || '')),
              categoryId: row.category || 'science', // Map 'category' to 'categoryId'
              difficulty: mapDifficulty(row.difficulty || 'easy'),
              estimatedDuration: parseInt(row.estimatedMinutes) || 30,
              programmingLanguage: row.programmingLanguage || null,
              answerGuide: row.answerGuide || null,
              answer: row.answer || null,
              authorId: row.authorId || 'system',
              schoolId: row.schoolId || 'default-school',
              averageRating: 0,
              totalRatings: 0,
              isActive: true,
              createdAt: new Date(row.createdAt || Date.now()),
            };
            
            lessons.push(lesson);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to load lessons from ${csvFile}:`, error);
    }
  }
  
  return lessons;
}

// Load question progress from CSV file
function loadQuestionProgressFromCSV(): QuestionProgress[] {
  const progressFile = path.join(getDataDir(), 'data', 'progress', 'questions.csv');
  const questionProgress: QuestionProgress[] = [];
  
  try {
    if (fs.existsSync(progressFile)) {
      const content = fs.readFileSync(progressFile, 'utf-8');
      const rows = parseCSV(content);
      
      for (const row of rows) {
        if (row.userId && row.lessonId && row.questionId) {
          const progress: QuestionProgress = {
            userId: row.userId,
            lessonId: row.lessonId,
            questionId: row.questionId,
            isCorrect: row.isCorrect === 'true',
            answer: row.answer || '',
            lastUpdated: new Date(row.lastUpdated || Date.now()),
          };
          questionProgress.push(progress);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load question progress from CSV:', error);
  }
  
  return questionProgress;
}

function loadUserProgressFromCSV(): UserProgress[] {
  const progressFile = path.join(getDataDir(), 'data', 'progress', 'progress.csv');
  const records: UserProgress[] = [];

  try {
    if (!fs.existsSync(progressFile)) {
      return records;
    }

    const content = fs.readFileSync(progressFile, 'utf-8');
    if (!content.trim()) {
      return records;
    }

    const rows = parseCSV(content);
    for (const row of rows) {
      if (!row.userId || !row.lessonId) {
        continue;
      }

      const status = (row.status || '').toLowerCase();
      records.push({
        id: `${row.userId}-${row.lessonId}`,
        userId: row.userId,
        lessonId: row.lessonId,
        isCompleted: status === 'completed' || row.isCompleted === 'true',
        score: row.score ? parseInt(row.score, 10) : null,
        timeSpent: row.attempts ? parseInt(row.attempts, 10) : null,
        lastAccessed: new Date(row.lastUpdated || Date.now()),
        completedAt: status === 'completed' ? new Date(row.lastUpdated || Date.now()) : null,
      });
    }
  } catch (error) {
    console.warn('Failed to load user progress from CSV:', error);
  }

  return records;
}

function upsertUserProgressToCSV(progress: UserProgress): void {
  const progressFile = path.join(getDataDir(), 'data', 'progress', 'progress.csv');

  try {
    const dir = path.dirname(progressFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let existingRows: Record<string, string>[] = [];
    if (fs.existsSync(progressFile)) {
      const content = fs.readFileSync(progressFile, 'utf-8');
      if (content.trim()) {
        existingRows = parseCSV(content);
      }
    }

    const rowKey = `${progress.userId}-${progress.lessonId}`;
    let foundExisting = false;
    const status = progress.isCompleted ? 'completed' : 'in-progress';

    const updatedRows = existingRows.map(row => {
      const currentKey = `${row.userId}-${row.lessonId}`;
      if (currentKey === rowKey) {
        foundExisting = true;
        return {
          userId: progress.userId,
          lessonId: progress.lessonId,
          status,
          score: progress.score?.toString() || '',
          attempts: progress.timeSpent?.toString() || '0',
          lastUpdated: (progress.lastAccessed || new Date()).toISOString(),
        };
      }
      return row;
    });

    if (!foundExisting) {
      updatedRows.push({
        userId: progress.userId,
        lessonId: progress.lessonId,
        status,
        score: progress.score?.toString() || '',
        attempts: progress.timeSpent?.toString() || '0',
        lastUpdated: (progress.lastAccessed || new Date()).toISOString(),
      });
    }

    let csvContent = 'userId,lessonId,status,score,attempts,lastUpdated\n';
    for (const row of updatedRows) {
      csvContent += [
        row.userId,
        row.lessonId,
        row.status,
        row.score,
        row.attempts,
        row.lastUpdated,
      ].join(',') + '\n';
    }

    fs.writeFileSync(progressFile, csvContent, 'utf-8');
  } catch (error) {
    console.error('Failed to write user progress to CSV:', error);
    throw error;
  }
}

// Write question progress to CSV file
function upsertQuestionProgressToCSV(progress: QuestionProgress): void {
  const progressFile = path.join(getDataDir(), 'data', 'progress', 'questions.csv');
  
  try {
    // Ensure directory exists
    const dir = path.dirname(progressFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Read existing content
    let csvContent = '';
    let existingRows: Record<string, string>[] = [];
    
    if (fs.existsSync(progressFile)) {
      csvContent = fs.readFileSync(progressFile, 'utf-8');
      if (csvContent.trim()) {
        existingRows = parseCSV(csvContent);
      }
    }
    
    // If file doesn't exist or is empty, create headers
    if (!csvContent.trim()) {
      csvContent = 'userId,lessonId,questionId,isCorrect,answer,lastUpdated\n';
    }
    
    // Find existing row for this user/lesson/question
    const rowKey = `${progress.userId}-${progress.lessonId}-${progress.questionId}`;
    let foundExisting = false;
    
    // Update existing rows or mark for update
    const updatedRows = existingRows.map(row => {
      const currentKey = `${row.userId}-${row.lessonId}-${row.questionId}`;
      if (currentKey === rowKey) {
        foundExisting = true;
        return {
          userId: progress.userId,
          lessonId: progress.lessonId,
          questionId: progress.questionId,
          isCorrect: progress.isCorrect.toString(),
          answer: progress.answer.replace(/"/g, '""'), // Escape quotes
          lastUpdated: progress.lastUpdated.toISOString(),
        };
      }
      return row;
    });
    
    // If not found, add new row
    if (!foundExisting) {
      updatedRows.push({
        userId: progress.userId,
        lessonId: progress.lessonId,
        questionId: progress.questionId,
        isCorrect: progress.isCorrect.toString(),
        answer: progress.answer.replace(/"/g, '""'), // Escape quotes
        lastUpdated: progress.lastUpdated.toISOString(),
      });
    }
    
    // Rebuild CSV content
    csvContent = 'userId,lessonId,questionId,isCorrect,answer,lastUpdated\n';
    
    for (const row of updatedRows) {
      const csvLine = [
        row.userId,
        row.lessonId,
        row.questionId,
        row.isCorrect,
        `"${row.answer}"`,
        row.lastUpdated
      ].join(',') + '\n';
      csvContent += csvLine;
    }
    
    // Write the updated content
    fs.writeFileSync(progressFile, csvContent, 'utf-8');
    
    console.log(`Question progress updated for ${progress.userId}/${progress.lessonId}/${progress.questionId}`);
  } catch (error) {
    console.error('Failed to write question progress to CSV:', error);
    throw error;
  }
}

// Utility function to parse lesson content (handles both string and JSON)
function parseLessonContent(content: string | null): LessonContentUnion | null {
  if (!content) return null;
  
  try {
    const parsed = JSON.parse(content);
    // Validate it matches our schema
    return lessonContentSchema.parse(parsed);
  } catch {
    // If JSON parsing fails, return as string (legacy format)
    return content;
  }
}

// Utility function to serialize lesson content for CSV storage
function serializeLessonContent(content: LessonContentUnion | null): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  return JSON.stringify(content);
}

// Write a lesson to CSV file
function appendLessonToCSV(lesson: Lesson): void {
  const csvFile = path.join(getDataDir(), 'data', 'lessons', `${lesson.categoryId}.csv`);
  
  try {
    // Read existing content to get headers
    let csvContent = '';
    if (fs.existsSync(csvFile)) {
      csvContent = fs.readFileSync(csvFile, 'utf-8');
    }
    
    // If file doesn't exist or is empty, create headers
    if (!csvContent.trim()) {
      const headers = 'id,title,category,summary,content,answerGuide,answer,difficulty,estimatedMinutes,tags,authorId,createdAt,schoolId';
      csvContent = headers + '\n';
    }
    
    // Prepare lesson data for CSV
    const csvRow = {
      id: lesson.id,
      title: lesson.title,
      category: lesson.categoryId,
      summary: lesson.description || '',
      content: lesson.content ? serializeLessonContent(lesson.content) : '',
      answerGuide: lesson.answerGuide || '',
      answer: lesson.answer || '',
      difficulty: lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1), // Easy/Medium/Hard format
      estimatedMinutes: lesson.estimatedDuration?.toString() || '30',
      tags: '', // Default empty for now
      authorId: lesson.authorId || 'default-admin',
      createdAt: lesson.createdAt?.toISOString() || new Date().toISOString(),
      schoolId: lesson.schoolId || 'default-school'
    };
    
    // Convert to CSV format with proper quoting for multiline content
    const quotedValues = [
      csvRow.id,
      `"${csvRow.title.replace(/"/g, '""')}"`,
      csvRow.category,
      `"${csvRow.summary.replace(/"/g, '""')}"`,
      `"${csvRow.content.replace(/"/g, '""')}"`,
      `"${csvRow.answerGuide.replace(/"/g, '""')}"`,
      `"${csvRow.answer.replace(/"/g, '""')}"`,
      csvRow.difficulty,
      csvRow.estimatedMinutes,
      csvRow.tags,
      csvRow.authorId,
      csvRow.createdAt,
      csvRow.schoolId
    ];
    
    const csvLine = quotedValues.join(',') + '\n';
    
    // Append to file
    csvContent += csvLine;
    
    // Ensure directory exists
    const dir = path.dirname(csvFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the updated content
    fs.writeFileSync(csvFile, csvContent, 'utf-8');
    
    console.log(`Lesson ${lesson.id} successfully written to ${csvFile}`);
  } catch (error) {
    console.error(`Failed to write lesson ${lesson.id} to CSV:`, error);
    throw error;
  }
}

function deleteLessonFromCSV(lessonId: string, categoryId?: string): boolean {
  const categories = categoryId
    ? [categoryId]
    : ['science', 'technology', 'engineering', 'mathematics'];

  for (const category of categories) {
    const csvFile = path.join(getDataDir(), 'data', 'lessons', `${category}.csv`);
    if (!fs.existsSync(csvFile)) {
      continue;
    }

    const content = fs.readFileSync(csvFile, 'utf-8');
    if (!content.trim()) {
      continue;
    }

    const rows = parseCSV(content);
    const filtered = rows.filter(row => row.id !== lessonId);
    if (filtered.length === rows.length) {
      continue;
    }

    const headerLine = content.split('\n').find(line => line.startsWith('id,')) || 'id,title,category,summary,content,answerGuide,answer,difficulty,estimatedMinutes,tags,authorId,createdAt,schoolId';
    let newContent = headerLine + '\n';

    for (const row of filtered) {
      const values = [
        row.id,
        `"${(row.title || '').replace(/"/g, '""')}"`,
        row.category,
        `"${(row.summary || '').replace(/"/g, '""')}"`,
        `"${(row.content || '').replace(/"/g, '""')}"`,
        `"${(row.answerGuide || '').replace(/"/g, '""')}"`,
        `"${(row.answer || '').replace(/"/g, '""')}"`,
        row.difficulty,
        row.estimatedMinutes,
        row.tags || '',
        row.authorId,
        row.createdAt,
        row.schoolId || 'default-school',
      ];
      newContent += values.join(',') + '\n';
    }

    fs.writeFileSync(csvFile, newContent, 'utf-8');
    return true;
  }

  return false;
}

export interface IStorage {
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
  deleteLesson(id: string): Promise<boolean>;
  
  // Progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressByCategory(userId: string, categoryId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Classroom operations
  createClassroom(classroom: InsertClassroom): Promise<Classroom>;
  getClassroomById(id: string): Promise<Classroom | undefined>;
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
  
  // Quiz functionality
  getQuestionProgress(userId: string, lessonId: string): Promise<Map<string, QuestionProgress>>;
  upsertQuestionProgress(progress: QuestionProgress): Promise<QuestionProgress>;
  computeLessonScore(userId: string, lessonId: string): Promise<LessonScore>;
}

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private schools: Map<string, School> = new Map();
  private categories: Map<string, Category> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private classrooms: Map<string, Classroom> = new Map();
  private studentClassrooms: Map<string, { studentId: string; classroomId: string }> = new Map();
  private lessonPermissions: Map<string, LessonPermission> = new Map();
  private lessonProposals: Map<string, LessonProposal> = new Map();
  private proposalVotes: Map<string, ProposalVote> = new Map();
  private lessonRatings: Map<string, LessonRating> = new Map();
  private questionProgress: Map<string, QuestionProgress> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default school
    const defaultSchool: School = {
      id: "default-school",
      name: "STEM Academy",
      licenseKey: "STEM-DEFAULT-KEY",
      isActive: true,
      createdAt: new Date(),
    };
    this.schools.set(defaultSchool.id, defaultSchool);

    // Initialize categories
    const defaultCategories: Category[] = [
      {
        id: "science",
        name: "Science",
        icon: "flask-conical",
        description: "Explore the natural world through observation, experimentation, and analysis",
        color: "green",
      },
      {
        id: "technology",
        name: "Technology",
        icon: "laptop-code",
        description: "Learn about digital tools, programming, and computational thinking",
        color: "blue",
      },
      {
        id: "engineering",
        name: "Engineering",
        icon: "wrench",
        description: "Design and build solutions to real-world problems",
        color: "orange",
      },
      {
        id: "mathematics",
        name: "Mathematics",
        icon: "calculator",
        description: "Develop logical reasoning and problem-solving through numbers and patterns",
        color: "purple",
      },
    ];

    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });

    // Load lessons from CSV files
    const sampleLessons: Lesson[] = loadLessonsFromCSV();

    // Add lessons to the Map
    sampleLessons.forEach(lesson => {
      this.lessons.set(lesson.id, lesson);
    });
    
    // Load question progress from CSV
    const questionProgressData = loadQuestionProgressFromCSV();
    questionProgressData.forEach(progress => {
      const key = `${progress.userId}-${progress.lessonId}-${progress.questionId}`;
      this.questionProgress.set(key, progress);
    });

    // Load lesson progress from CSV
    const userProgressData = loadUserProgressFromCSV();
    userProgressData.forEach(progress => {
      const key = `${progress.userId}-${progress.lessonId}`;
      this.userProgress.set(key, progress);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      id: userData.id!,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: userData.role || "student",
      schoolId: userData.schoolId || "default-school",
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id!, user);
    return user;
  }

  // School operations
  async createSchool(school: InsertSchool): Promise<School> {
    const newSchool: School = {
      id: nanoid(),
      name: school.name,
      licenseKey: school.licenseKey || null,
      isActive: school.isActive || null,
      createdAt: new Date(),
    };
    this.schools.set(newSchool.id, newSchool);
    return newSchool;
  }

  async getSchoolByLicenseKey(licenseKey: string): Promise<School | undefined> {
    return Array.from(this.schools.values()).find(s => s.licenseKey === licenseKey);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  // Lesson operations
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(l => l.isActive);
  }

  async getLessonsByCategory(categoryId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(l => 
      l.categoryId === categoryId && l.isActive
    );
  }

  async getLessonsByDifficulty(difficulty: DifficultyLevel): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(l => 
      l.difficulty === difficulty && l.isActive
    );
  }

  async getLessonById(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const newLesson: Lesson = {
      id: nanoid(),
      title: lesson.title,
      description: lesson.description || null,
      content: lesson.content ? serializeLessonContent(lesson.content) : null,
      categoryId: lesson.categoryId,
      difficulty: lesson.difficulty,
      estimatedDuration: lesson.estimatedDuration || null,
      programmingLanguage: lesson.programmingLanguage || null,
      answerGuide: lesson.answerGuide || null,
      answer: lesson.answer || null,
      authorId: lesson.authorId || null,
      schoolId: lesson.schoolId || "default-school",
      isActive: true,
      averageRating: 0,
      totalRatings: 0,
      createdAt: new Date(),
    };
    
    // Save to memory storage
    this.lessons.set(newLesson.id, newLesson);
    
    // Save to CSV file
    try {
      appendLessonToCSV(newLesson);
    } catch (error) {
      console.error('Failed to save lesson to CSV:', error);
      // Don't throw error to avoid breaking the API, but log it
    }
    
    return newLesson;
  }

  async deleteLesson(id: string): Promise<boolean> {
    const lesson = this.lessons.get(id);
    if (!lesson) {
      return false;
    }

    this.lessons.delete(id);

    try {
      deleteLessonFromCSV(id, lesson.categoryId);
    } catch (error) {
      console.error(`Failed to remove lesson ${id} from CSV:`, error);
    }

    return true;
  }

  // Progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0));
  }

  async getUserProgressByCategory(userId: string, categoryId: string): Promise<UserProgress[]> {
    const categoryLessons = await this.getLessonsByCategory(categoryId);
    const categoryLessonIds = new Set(categoryLessons.map(l => l.id));
    
    return Array.from(this.userProgress.values()).filter(p => 
      p.userId === userId && categoryLessonIds.has(p.lessonId)
    );
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const key = `${progress.userId}-${progress.lessonId}`;
    const existing = this.userProgress.get(key);
    
    const updated: UserProgress = {
      id: existing?.id || nanoid(),
      userId: progress.userId,
      lessonId: progress.lessonId,
      isCompleted: progress.isCompleted || false,
      score: progress.score || null,
      timeSpent: progress.timeSpent || null,
      lastAccessed: new Date(),
      completedAt: progress.isCompleted ? (progress.completedAt || new Date()) : (existing?.completedAt || null),
    };
    
    this.userProgress.set(key, updated);

    try {
      upsertUserProgressToCSV(updated);
    } catch (error) {
      console.error('Failed to save user progress to CSV:', error);
    }

    return updated;
  }

  // Classroom operations
  async createClassroom(classroom: InsertClassroom): Promise<Classroom> {
    const newClassroom: Classroom = {
      id: nanoid(),
      ...classroom,
      isActive: true,
      createdAt: new Date(),
    };
    this.classrooms.set(newClassroom.id, newClassroom);
    return newClassroom;
  }

  async getClassroomById(id: string): Promise<Classroom | undefined> {
    return this.classrooms.get(id);
  }

  async getClassroomsByTeacher(teacherId: string): Promise<Classroom[]> {
    return Array.from(this.classrooms.values()).filter(c => 
      c.teacherId === teacherId && c.isActive
    );
  }

  async getStudentsByClassroom(classroomId: string): Promise<User[]> {
    const enrollments = Array.from(this.studentClassrooms.values())
      .filter(sc => sc.classroomId === classroomId);
    
    return enrollments
      .map(e => this.users.get(e.studentId))
      .filter((user): user is User => user !== undefined);
  }

  async enrollStudentInClassroom(studentId: string, classroomId: string): Promise<void> {
    const key = `${studentId}-${classroomId}`;
    this.studentClassrooms.set(key, { studentId, classroomId });
  }

  // Permission operations
  async grantLessonPermission(permission: InsertLessonPermission): Promise<LessonPermission> {
    const newPermission: LessonPermission = {
      id: nanoid(),
      studentId: permission.studentId,
      lessonId: permission.lessonId,
      grantedBy: permission.grantedBy,
      grantedAt: new Date(),
    };
    this.lessonPermissions.set(newPermission.id, newPermission);
    return newPermission;
  }

  async getUserPermissions(studentId: string): Promise<string[]> {
    const permissions = Array.from(this.lessonPermissions.values())
      .filter(p => p.studentId === studentId);
    return permissions.map(p => p.lessonId);
  }

  async checkLessonPermission(studentId: string, lessonId: string): Promise<boolean> {
    const studentPermissions = Array.from(this.lessonPermissions.values())
      .filter(p => p.studentId === studentId);
    // Standalone/local mode: no explicit grants means all lessons are available
    if (studentPermissions.length === 0) {
      return true;
    }
    return studentPermissions.some(p => p.lessonId === lessonId);
  }

  // Lesson proposal operations
  async createLessonProposal(proposal: InsertLessonProposal): Promise<LessonProposal> {
    const newProposal: LessonProposal = {
      id: nanoid(),
      title: proposal.title,
      description: proposal.description || null,
      content: proposal.content ? serializeLessonContent(proposal.content) : null,
      categoryId: proposal.categoryId,
      difficulty: proposal.difficulty,
      estimatedDuration: proposal.estimatedDuration || null,
      programmingLanguage: proposal.programmingLanguage || null,
      answerGuide: proposal.answerGuide || null,
      answer: proposal.answer || null,
      authorId: proposal.authorId,
      schoolId: proposal.schoolId,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: null,
      approvedAt: null,
    };
    this.lessonProposals.set(newProposal.id, newProposal);
    return newProposal;
  }

  async getLessonProposals(schoolId: string): Promise<LessonProposal[]> {
    return Array.from(this.lessonProposals.values())
      .filter(p => p.schoolId === schoolId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getLessonProposalById(id: string): Promise<LessonProposal | undefined> {
    return this.lessonProposals.get(id);
  }

  async updateLessonProposalStatus(id: string, status: string): Promise<LessonProposal> {
    const proposal = this.lessonProposals.get(id);
    if (!proposal) throw new Error('Proposal not found');

    const updated: LessonProposal = {
      ...proposal,
      status: status as any,
      updatedAt: new Date(),
      ...(status === 'submitted' && { submittedAt: new Date() }),
      ...(status === 'approved' && { approvedAt: new Date() })
    };
    
    this.lessonProposals.set(id, updated);
    return updated;
  }

  async submitLessonProposal(id: string): Promise<LessonProposal> {
    return this.updateLessonProposalStatus(id, 'submitted');
  }

  async approveLessonProposal(id: string): Promise<Lesson> {
    const proposal = await this.getLessonProposalById(id);
    if (!proposal) throw new Error('Proposal not found');

    // Create lesson from approved proposal
    const newLesson = await this.createLesson({
      title: proposal.title,
      description: proposal.description,
      content: proposal.content ? parseLessonContent(proposal.content) || undefined : undefined,
      categoryId: proposal.categoryId,
      difficulty: proposal.difficulty,
      estimatedDuration: proposal.estimatedDuration,
      programmingLanguage: proposal.programmingLanguage,
      answerGuide: proposal.answerGuide,
      answer: proposal.answer,
      authorId: proposal.authorId,
      schoolId: proposal.schoolId,
    });

    // Update proposal status
    await this.updateLessonProposalStatus(id, 'approved');

    return newLesson;
  }

  // Proposal voting operations
  async voteOnProposal(vote: InsertProposalVote): Promise<ProposalVote> {
    const key = `${vote.proposalId}-${vote.voterId}`;
    const existing = Array.from(this.proposalVotes.values())
      .find(v => v.proposalId === vote.proposalId && v.voterId === vote.voterId);

    if (existing) {
      const updated: ProposalVote = {
        ...existing,
        vote: vote.vote,
        comment: vote.comment || null,
        createdAt: new Date(),
      };
      this.proposalVotes.set(existing.id, updated);
      return updated;
    } else {
      const newVote: ProposalVote = {
        id: nanoid(),
        proposalId: vote.proposalId,
        voterId: vote.voterId,
        vote: vote.vote,
        comment: vote.comment || null,
        createdAt: new Date(),
      };
      this.proposalVotes.set(newVote.id, newVote);
      return newVote;
    }
  }

  async getProposalVotes(proposalId: string): Promise<ProposalVote[]> {
    return Array.from(this.proposalVotes.values())
      .filter(v => v.proposalId === proposalId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getUserVoteOnProposal(proposalId: string, userId: string): Promise<ProposalVote | undefined> {
    return Array.from(this.proposalVotes.values())
      .find(v => v.proposalId === proposalId && v.voterId === userId);
  }

  // Lesson rating operations
  async rateLesson(rating: InsertLessonRating): Promise<LessonRating> {
    const existing = Array.from(this.lessonRatings.values())
      .find(r => r.lessonId === rating.lessonId && r.userId === rating.userId);

    if (existing) {
      const updated: LessonRating = {
        ...existing,
        rating: rating.rating,
        comment: rating.comment || null,
        updatedAt: new Date(),
      };
      this.lessonRatings.set(existing.id, updated);
      await this.updateLessonAverageRating(rating.lessonId);
      return updated;
    } else {
      const newRating: LessonRating = {
        id: nanoid(),
        lessonId: rating.lessonId,
        userId: rating.userId,
        rating: rating.rating,
        comment: rating.comment || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.lessonRatings.set(newRating.id, newRating);
      await this.updateLessonAverageRating(rating.lessonId);
      return newRating;
    }
  }

  async getLessonRatings(lessonId: string): Promise<LessonRating[]> {
    return Array.from(this.lessonRatings.values())
      .filter(r => r.lessonId === lessonId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getUserRatingForLesson(lessonId: string, userId: string): Promise<LessonRating | undefined> {
    return Array.from(this.lessonRatings.values())
      .find(r => r.lessonId === lessonId && r.userId === userId);
  }

  async updateLessonAverageRating(lessonId: string): Promise<void> {
    const ratings = await this.getLessonRatings(lessonId);
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings)
      : 0;

    const lesson = this.lessons.get(lessonId);
    if (lesson) {
      const updated: Lesson = {
        ...lesson,
        averageRating,
        totalRatings,
      };
      this.lessons.set(lessonId, updated);
    }
  }

  // School-based access
  async getLessonsBySchool(schoolId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(l => l.schoolId === schoolId && l.isActive)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async checkSchoolAccess(userId: string, resourceSchoolId: string): Promise<boolean> {
    const user = await this.getUser(userId);
    return user?.schoolId === resourceSchoolId;
  }
  
  // Quiz functionality
  async getQuestionProgress(userId: string, lessonId: string): Promise<Map<string, QuestionProgress>> {
    const progressMap = new Map<string, QuestionProgress>();
    
    for (const [key, progress] of Array.from(this.questionProgress.entries())) {
      if (progress.userId === userId && progress.lessonId === lessonId) {
        progressMap.set(progress.questionId, progress);
      }
    }
    
    return progressMap;
  }
  
  async upsertQuestionProgress(progress: QuestionProgress): Promise<QuestionProgress> {
    const key = `${progress.userId}-${progress.lessonId}-${progress.questionId}`;
    const updatedProgress: QuestionProgress = {
      ...progress,
      lastUpdated: new Date(),
    };
    
    // Update in memory
    this.questionProgress.set(key, updatedProgress);
    
    // Persist to CSV
    try {
      upsertQuestionProgressToCSV(updatedProgress);
    } catch (error) {
      console.error('Failed to save question progress to CSV:', error);
      // Don't throw error to avoid breaking the API, but log it
    }
    
    return updatedProgress;
  }
  
  async computeLessonScore(userId: string, lessonId: string): Promise<LessonScore> {
    // Get the lesson content to determine total questions
    const lesson = await this.getLessonById(lessonId);
    let totalQuestions = 0;
    
    if (lesson?.content) {
      try {
        const parsedContent = parseLessonContent(lesson.content);
        if (parsedContent && typeof parsedContent !== 'string') {
          // Count questions in all sections
          totalQuestions = parsedContent.sections.reduce(
            (total, section) => total + section.questions.length,
            0
          );
        }
      } catch (error) {
        console.warn('Failed to parse lesson content for scoring:', error);
      }
    }
    
    // Get user's progress for this lesson
    const questionProgress = await this.getQuestionProgress(userId, lessonId);
    
    // Count correct answers
    const correctAnswers = Array.from(questionProgress.values())
      .filter(progress => progress.isCorrect).length;
    
    // Calculate percentage
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    return {
      correctAnswers,
      totalQuestions,
      percentage,
      questionProgress,
    };
  }
}

let storageInstance: MemoryStorage | null = null;

export function getStorage(): MemoryStorage {
  if (!storageInstance) {
    storageInstance = new MemoryStorage();
  }
  return storageInstance;
}

/** Clears the singleton so the next access reloads from STEMGENIUS_DATA_DIR. */
export function resetStorageForTests(): void {
  storageInstance = null;
}

export const storage: IStorage = new Proxy({} as MemoryStorage, {
  get(_target, prop) {
    const instance = getStorage() as Record<string | symbol, unknown>;
    const value = instance[prop as string];
    return typeof value === "function" ? (value as Function).bind(getStorage()) : value;
  },
});