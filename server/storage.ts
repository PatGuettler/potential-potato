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
} from "@shared/schema";
import { nanoid } from "nanoid";

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

    // Initialize sample lessons with real content
    const sampleLessons: Lesson[] = [
      {
        id: nanoid(),
        title: "Cell Structure and Function",
        description: "Learn about the basic building blocks of life and how cells work",
        content: `# Cell Structure and Function

## Introduction
All living things are made up of cells - the smallest units of life. Understanding cell structure is fundamental to biology.

## Learning Objectives
- Identify major cell organelles
- Understand the function of each organelle
- Compare plant and animal cells

## Cell Organelles

### Nucleus
The control center of the cell containing DNA and controlling cell activities.

### Mitochondria
The "powerhouses" that produce energy (ATP) for the cell.

### Cell Membrane
Controls what enters and exits the cell - acts like a security guard.

### Cytoplasm
The jelly-like substance that fills the cell and holds organelles.

## Activity
Draw and label a cell diagram including:
1. Nucleus
2. Mitochondria
3. Cell membrane
4. Cytoplasm

## Assessment
What organelle would you expect to find more of in a muscle cell that needs lots of energy?

**Answer:** Mitochondria - because muscles need lots of energy to contract.`,
        categoryId: "science",
        difficulty: "easy",
        estimatedDuration: 45,
        programmingLanguage: null,
        answerGuide: "Mitochondria are responsible for cellular energy production through ATP synthesis.",
        authorId: "system",
        schoolId: "default-school",
        isActive: true,
        averageRating: 0,
        totalRatings: 0,
        createdAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Introduction to Python Programming",
        description: "Learn the basics of Python syntax and write your first programs",
        content: `# Introduction to Python Programming

## Introduction
Python is a beginner-friendly programming language used for web development, data science, and automation.

## Learning Objectives
- Write basic Python syntax
- Use variables and data types
- Create simple programs

## Getting Started

### Variables
\`\`\`python
name = "Alice"
age = 16
height = 5.6
is_student = True
\`\`\`

### Data Types
- **String**: Text data ("Hello")
- **Integer**: Whole numbers (42)
- **Float**: Decimal numbers (3.14)
- **Boolean**: True/False

### Basic Operations
\`\`\`python
# Math operations
result = 5 + 3 * 2  # 11
area = 3.14 * radius ** 2

# String operations
greeting = "Hello, " + name
\`\`\`

## Your First Program
\`\`\`python
# Get user input
name = input("What is your name? ")
age = int(input("How old are you? "))

# Calculate birth year
birth_year = 2024 - age

# Display result
print(f"Hi {name}! You were born in {birth_year}.")
\`\`\`

## Challenge
Write a program that:
1. Asks for two numbers
2. Calculates their sum, difference, and product
3. Displays all results`,
        categoryId: "technology",
        difficulty: "easy",
        estimatedDuration: 45,
        programmingLanguage: "python",
        answerGuide: "Focus on proper syntax, variable naming, and user input validation.",
        authorId: "system",
        schoolId: "default-school",
        isActive: true,
        averageRating: 0,
        totalRatings: 0,
        createdAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Simple Machines and Mechanical Advantage",
        description: "Explore how levers, pulleys, and inclined planes make work easier",
        content: `# Simple Machines and Mechanical Advantage

## Introduction
Simple machines are basic mechanical devices that make work easier by changing the direction or magnitude of forces.

## Learning Objectives
- Identify six types of simple machines
- Calculate mechanical advantage
- Apply simple machines to real-world problems

## The Six Simple Machines

### 1. Lever
- Classes: First, second, third class
- Example: Crowbar, scissors, tweezers
- MA = Length of effort arm / Length of load arm

### 2. Wheel and Axle
- Example: Steering wheel, doorknob
- MA = Radius of wheel / Radius of axle

### 3. Pulley
- Fixed: Changes direction only (MA = 1)
- Movable: Reduces force needed (MA = 2)
- Compound: Multiple pulleys (MA = number of supporting ropes)

### 4. Inclined Plane
- Example: Ramp, stairs
- MA = Length of ramp / Height of ramp

## Practice Problems

### Problem 1: Lever
A crowbar is 1.2m long. If you apply 200N of force 1.0m from the fulcrum, what load can you lift at 0.2m from the fulcrum?

Solution:
MA = 1.0m / 0.2m = 5
Load = 200N × 5 = 1000N

## Design Challenge
Design a compound machine using at least 3 simple machines to lift a heavy object 3 meters high.`,
        categoryId: "engineering",
        difficulty: "easy",
        estimatedDuration: 50,
        programmingLanguage: null,
        answerGuide: "Focus on understanding mechanical advantage calculations and real-world applications.",
        authorId: "system",
        schoolId: "default-school",
        isActive: true,
        averageRating: 0,
        totalRatings: 0,
        createdAt: new Date(),
      },
      {
        id: nanoid(),
        title: "Linear Equations and Graphing",
        description: "Master solving linear equations and understanding their graphical representations",
        content: `# Linear Equations and Graphing

## Introduction
Linear equations create straight lines when graphed and model many real-world relationships with constant rates of change.

## Learning Objectives
- Solve linear equations in one variable
- Graph linear equations in two variables
- Interpret slope and y-intercept

## Solving Linear Equations

### One Variable
Example: 3x + 5 = 17

Steps:
1. Subtract 5 from both sides: 3x = 12
2. Divide by 3: x = 4
3. Check: 3(4) + 5 = 17 ✓

### Two Variables
Standard Form: Ax + By = C
Slope-Intercept Form: y = mx + b
- m = slope (rise over run)
- b = y-intercept (where line crosses y-axis)

## Graphing Linear Equations

### Method 1: Slope-Intercept
For y = 2x + 3:
1. Start at y-intercept (0, 3)
2. Use slope: up 2, right 1
3. Plot points and draw line

### Method 2: Intercepts
For 2x + 3y = 6:
1. x-intercept: Set y = 0 → x = 3
2. y-intercept: Set x = 0 → y = 2
3. Plot (3, 0) and (0, 2)
4. Draw line through points

## Real-World Applications

### Phone Plan
Monthly cost = $30 + $0.10 per minute
Equation: C = 30 + 0.1m
- Slope: $0.10 per minute
- Y-intercept: $30 base fee

## Practice Problems
1. Solve: 2x - 7 = 15
2. Graph: y = -3x + 4
3. Find equation of line through (2, 5) with slope 3

Solutions:
1. x = 11
2. Start at (0, 4), slope = -3
3. y = 3x - 1`,
        categoryId: "mathematics",
        difficulty: "easy",
        estimatedDuration: 40,
        programmingLanguage: null,
        answerGuide: "Emphasize the connection between algebraic and graphical representations.",
        authorId: "system",
        schoolId: "default-school",
        isActive: true,
        averageRating: 0,
        totalRatings: 0,
        createdAt: new Date(),
      },
    ];

    sampleLessons.forEach(lesson => {
      this.lessons.set(lesson.id, lesson);
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
      content: lesson.content || null,
      categoryId: lesson.categoryId,
      difficulty: lesson.difficulty,
      estimatedDuration: lesson.estimatedDuration || null,
      programmingLanguage: lesson.programmingLanguage || null,
      answerGuide: lesson.answerGuide || null,
      authorId: lesson.authorId || null,
      schoolId: lesson.schoolId || "default-school",
      isActive: true,
      averageRating: 0,
      totalRatings: 0,
      createdAt: new Date(),
    };
    this.lessons.set(newLesson.id, newLesson);
    return newLesson;
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
      ...progress,
      lastAccessed: new Date(),
      completedAt: progress.isCompleted ? (progress.completedAt || new Date()) : (existing?.completedAt || null),
    };
    
    this.userProgress.set(key, updated);
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
      ...permission,
      createdAt: new Date(),
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
    const hasPermission = Array.from(this.lessonPermissions.values())
      .some(p => p.studentId === studentId && p.lessonId === lessonId);
    return hasPermission;
  }

  // Lesson proposal operations
  async createLessonProposal(proposal: InsertLessonProposal): Promise<LessonProposal> {
    const newProposal: LessonProposal = {
      id: nanoid(),
      ...proposal,
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
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
      content: proposal.content,
      categoryId: proposal.categoryId,
      difficulty: proposal.difficulty,
      estimatedDuration: proposal.estimatedDuration,
      programmingLanguage: proposal.programmingLanguage,
      answerGuide: proposal.answerGuide,
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
        comment: vote.comment,
        createdAt: new Date(),
      };
      this.proposalVotes.set(existing.id, updated);
      return updated;
    } else {
      const newVote: ProposalVote = {
        id: nanoid(),
        ...vote,
        createdAt: new Date(),
      };
      this.proposalVotes.set(newVote.id, newVote);
      return newVote;
    }
  }

  async getProposalVotes(proposalId: string): Promise<ProposalVote[]> {
    return Array.from(this.proposalVotes.values())
      .filter(v => v.proposalId === proposalId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
        comment: rating.comment,
        updatedAt: new Date(),
      };
      this.lessonRatings.set(existing.id, updated);
      await this.updateLessonAverageRating(rating.lessonId);
      return updated;
    } else {
      const newRating: LessonRating = {
        id: nanoid(),
        ...rating,
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
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async checkSchoolAccess(userId: string, resourceSchoolId: string): Promise<boolean> {
    const user = await this.getUser(userId);
    return user?.schoolId === resourceSchoolId;
  }
}

export const storage = new MemoryStorage();