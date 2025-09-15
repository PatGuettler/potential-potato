import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./fileAuth";
import {
  insertLessonSchema,
  insertUserProgressSchema,
  insertClassroomSchema,
  insertLessonPermissionSchema,
  insertLessonProposalSchema,
  insertProposalVoteSchema,
  insertLessonRatingSchema,
  type Lesson,
  type LessonContent,
  type LessonContentUnion,
  lessonContentSchema,
} from "@shared/schema";
import { z } from "zod";

// Helper function to strip expectedAnswer from structured lesson content for students
function stripExpectedAnswersFromContent(content: string | null): string | null {
  if (!content) return content;
  
  try {
    const parsed = JSON.parse(content);
    const validatedContent = lessonContentSchema.parse(parsed);
    
    // Strip expectedAnswer from all questions in all sections while preserving all other properties
    const strippedContent: LessonContent = {
      sections: validatedContent.sections.map(section => ({
        ...section,
        questions: section.questions.map(question => {
          // Create a copy of the question without expectedAnswer
          const { expectedAnswer, ...questionWithoutAnswer } = question;
          return questionWithoutAnswer;
        })
      }))
    };
    
    return JSON.stringify(strippedContent);
  } catch {
    // If parsing fails, return empty content for students to prevent expectedAnswer leakage
    // This is safer than returning original content which might contain sensitive data
    console.warn('Failed to parse lesson content for student view, returning empty content for security');
    return JSON.stringify({ sections: [] });
  }
}

// Helper function to strip answers from lesson for students
function stripAnswersFromLesson(lesson: Lesson, isStudent: boolean): Lesson {
  if (!isStudent) return lesson;
  
  return {
    ...lesson,
    answerGuide: null,
    answer: null,
    content: stripExpectedAnswersFromContent(lesson.content)
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes are handled in fileAuth.ts

  // Categories routes
  app.get('/api/categories', isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Lessons routes
  app.get('/api/lessons', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const userId = user.id || user.username;
      
      let lessons = await storage.getLessons();
      
      // Filter lessons based on user role (students get stripped content)
      const filteredLessons = lessons.map(lesson => 
        stripAnswersFromLesson(lesson, user?.role === 'student')
      );
      res.json(filteredLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get('/api/lessons/category/:categoryId', isAuthenticated, async (req: any, res) => {
    try {
      const { categoryId } = req.params;
      const user = req.user;
      const userId = user.id || user.username;
      
      let lessons = await storage.getLessonsByCategory(categoryId);
      
      // Filter lessons based on user role (students get stripped content)
      const filteredLessons = lessons.map(lesson => 
        stripAnswersFromLesson(lesson, user?.role === 'student')
      );
      res.json(filteredLessons);
    } catch (error) {
      console.error("Error fetching lessons by category:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get('/api/lessons/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const userId = user.id || user.username;
      
      const lesson = await storage.getLessonById(id);
      if (!lesson) {
        res.status(404).json({ message: "Lesson not found" });
        return;
      }
      
      // Filter lesson based on user role (students get stripped content)
      const filteredLesson = stripAnswersFromLesson(lesson, user?.role === 'student');
      res.json(filteredLesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Answer validation endpoint for students
  app.post('/api/lessons/:id/validate-answer', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { studentAnswer } = req.body;
      const user = req.user;
      const userId = user.id || user.username;

      // Validate input
      if (!studentAnswer || typeof studentAnswer !== 'string') {
        return res.status(400).json({ message: "Student answer is required" });
      }

      // Get the lesson with full answer data (only accessible server-side)
      const lesson = await storage.getLessonById(id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Check permissions for students
      if (user?.role === 'student') {
        const hasPermission = await storage.checkLessonPermission(userId, id);
        if (!hasPermission) {
          return res.status(403).json({ message: "Access denied - lesson not permitted" });
        }
      }

      // If no expected answer is defined, accept any non-empty answer
      if (!lesson.answer) {
        return res.json({
          isCorrect: true,
          feedback: "Answer submitted successfully. Since this lesson doesn't have a specific expected answer, your response will be reviewed by your teacher.",
          score: 100
        });
      }

      // Simple answer validation - normalize both answers for comparison
      const normalizeAnswer = (text: string): string => {
        return text.toLowerCase()
          .replace(/[^\w\s]/g, '') // Remove punctuation
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
      };

      const normalizedStudentAnswer = normalizeAnswer(studentAnswer);
      const normalizedExpectedAnswer = normalizeAnswer(lesson.answer);

      // Check if key concepts from expected answer are present in student answer
      const expectedKeywords = normalizedExpectedAnswer.split(' ').filter(word => word.length > 3);
      const studentWords = normalizedStudentAnswer.split(' ');
      
      const matchedKeywords = expectedKeywords.filter(keyword => 
        studentWords.some(studentWord => 
          studentWord.includes(keyword) || keyword.includes(studentWord)
        )
      );

      const matchPercentage = expectedKeywords.length > 0 
        ? (matchedKeywords.length / expectedKeywords.length) * 100 
        : 0;

      // Consider answer correct if it matches at least 60% of key concepts
      const isCorrect = matchPercentage >= 60;
      const score = Math.round(matchPercentage);

      let feedback: string;
      if (isCorrect) {
        feedback = `Great job! Your answer covers the key concepts well. (${score}% match)`;
      } else if (score >= 30) {
        feedback = `Your answer is partially correct but missing some key concepts. Please review the lesson material and try again. (${score}% match)`;
      } else {
        feedback = `Your answer doesn't match the expected concepts. Please review the lesson carefully and focus on the main learning objectives. (${score}% match)`;
      }

      res.json({
        isCorrect,
        feedback,
        score,
        matchPercentage: Math.round(matchPercentage)
      });

    } catch (error) {
      console.error("Error validating answer:", error);
      res.status(500).json({ message: "Failed to validate answer" });
    }
  });

  // Quiz progress endpoint for individual lessons
  app.get('/api/lessons/:id/progress', isAuthenticated, async (req: any, res) => {
    try {
      const { id: lessonId } = req.params;
      const userId = req.user.id || req.user.username;

      // Verify lesson exists
      const lesson = await storage.getLessonById(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Check permissions for students
      if (req.user?.role === 'student') {
        const hasPermission = await storage.checkLessonPermission(userId, lessonId);
        if (!hasPermission) {
          return res.status(403).json({ message: "Access denied - lesson not permitted" });
        }
      }

      // Get lesson score and progress
      const lessonScore = await storage.computeLessonScore(userId, lessonId);
      
      // Transform question progress Map to object for JSON response
      const perQuestion: { [questionId: string]: { isCorrect: boolean } } = {};
      lessonScore.questionProgress.forEach((progress, questionId) => {
        perQuestion[questionId] = { isCorrect: progress.isCorrect };
      });

      const progressData = {
        total: lessonScore.totalQuestions,
        correct: lessonScore.correctAnswers,
        percent: lessonScore.percentage,
        perQuestion
      };

      res.json(progressData);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  // Quiz question validation endpoint
  app.post('/api/lessons/:id/questions/:questionId/validate', isAuthenticated, async (req: any, res) => {
    try {
      const { id: lessonId, questionId } = req.params;
      const { answer } = req.body;
      const userId = req.user.id || req.user.username;

      // Validate input
      if (!answer || typeof answer !== 'string') {
        return res.status(400).json({ message: "Answer is required and must be a string" });
      }

      // Get the lesson with full data (including expectedAnswer)
      const lesson = await storage.getLessonById(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Check permissions for students
      if (req.user?.role === 'student') {
        const hasPermission = await storage.checkLessonPermission(userId, lessonId);
        if (!hasPermission) {
          return res.status(403).json({ message: "Access denied - lesson not permitted" });
        }
      }

      // Parse lesson content to find the question
      let targetQuestion = null;
      if (lesson.content) {
        try {
          const parsed = JSON.parse(lesson.content);
          const validatedContent = lessonContentSchema.parse(parsed);
          
          // Find the question in the lesson content
          for (const section of validatedContent.sections) {
            const question = section.questions.find(q => q.id === questionId);
            if (question) {
              targetQuestion = question;
              break;
            }
          }
        } catch (error) {
          return res.status(400).json({ message: "Invalid lesson content format" });
        }
      }

      if (!targetQuestion) {
        return res.status(404).json({ message: "Question not found in lesson" });
      }

      // Validate the answer against expected answer
      const normalizeAnswer = (text: string, caseSensitive: boolean = false): string => {
        let normalized = text.trim();
        if (!caseSensitive) {
          normalized = normalized.toLowerCase();
        }
        return normalized.replace(/\s+/g, ' '); // Normalize whitespace
      };

      const caseSensitive = targetQuestion.caseSensitive || false;
      const normalizedStudentAnswer = normalizeAnswer(answer, caseSensitive);
      const normalizedExpectedAnswer = normalizeAnswer(targetQuestion.expectedAnswer, caseSensitive);

      // For different question types, apply different validation strategies
      let isCorrect = false;
      let feedback = "";
      
      if (targetQuestion.type === 'number') {
        // For number questions, validate and parse both as numbers for comparison
        const studentNum = parseFloat(normalizedStudentAnswer);
        const expectedNum = parseFloat(normalizedExpectedAnswer);
        
        // Check if both numbers are valid finite numbers
        if (!Number.isFinite(studentNum)) {
          feedback = "Invalid number format. Please enter a valid number.";
          isCorrect = false;
        } else if (!Number.isFinite(expectedNum)) {
          // This should not happen with valid lesson data, but handle gracefully
          feedback = "Error: Invalid expected answer format. Please contact your teacher.";
          isCorrect = false;
        } else {
          // Both numbers are valid, perform comparison
          isCorrect = Math.abs(studentNum - expectedNum) < 0.001; // Allow small floating point differences
          feedback = isCorrect 
            ? "Correct! Great work with the calculation."
            : `Incorrect. The expected answer is ${expectedNum}. Please review your calculation.`;
        }
      } else if (targetQuestion.type === 'code') {
        // For code questions, use a more flexible matching approach
        const studentCode = normalizedStudentAnswer.replace(/\s/g, '');
        const expectedCode = normalizedExpectedAnswer.replace(/\s/g, '');
        isCorrect = studentCode === expectedCode;
        feedback = isCorrect 
          ? "Excellent! Your code is correct."
          : "Your code doesn't match the expected solution. Please check your syntax and logic.";
      } else {
        // For text questions, check for exact match or keyword matching
        if (normalizedStudentAnswer === normalizedExpectedAnswer) {
          isCorrect = true;
          feedback = "Perfect! That's the correct answer.";
        } else {
          // Try keyword matching for partial credit
          const expectedKeywords = normalizedExpectedAnswer.split(' ').filter(word => word.length > 2);
          const studentWords = normalizedStudentAnswer.split(' ');
          
          const matchedKeywords = expectedKeywords.filter(keyword => 
            studentWords.some(studentWord => 
              studentWord.includes(keyword) || keyword.includes(studentWord)
            )
          );

          const matchPercentage = expectedKeywords.length > 0 
            ? (matchedKeywords.length / expectedKeywords.length) * 100 
            : 0;

          isCorrect = matchPercentage >= 70; // 70% threshold for text questions
          
          if (isCorrect) {
            feedback = `Good job! Your answer captures the key concepts.`;
          } else if (matchPercentage >= 40) {
            feedback = `Your answer is partially correct but missing some key concepts. Please review and try again.`;
          } else {
            feedback = `Your answer doesn't match the expected response. Please review the lesson material and try again.`;
          }
        }
      }

      // Save question progress
      const questionProgress = {
        userId,
        lessonId,
        questionId,
        isCorrect,
        answer: answer.trim(),
        lastUpdated: new Date()
      };

      await storage.upsertQuestionProgress(questionProgress);

      // Return validation result
      res.json({
        isCorrect,
        feedback,
        questionId,
        expectedAnswer: req.user?.role === 'student' ? undefined : targetQuestion.expectedAnswer // Only show expected answer to teachers/admins
      });

    } catch (error) {
      console.error("Error validating quiz question:", error);
      res.status(500).json({ message: "Failed to validate question answer" });
    }
  });

  // Progress routes
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.username;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get('/api/progress/category/:categoryId', isAuthenticated, async (req: any, res) => {
    try {
      const { categoryId } = req.params;
      const userId = req.user.id || req.user.username;
      const progress = await storage.getUserProgressByCategory(userId, categoryId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress by category:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.username;
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId,
      });
      
      const progress = await storage.updateUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Teacher routes
  app.get('/api/teacher/classrooms', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (user?.role !== 'teacher') {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      
      const userId = user.id || user.username;
      const classrooms = await storage.getClassroomsByTeacher(userId);
      res.json(classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      res.status(500).json({ message: "Failed to fetch classrooms" });
    }
  });

  app.post('/api/teacher/classrooms', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (user?.role !== 'teacher') {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      
      const userId = user.id || user.username;
      const classroomData = insertClassroomSchema.parse({
        ...req.body,
        teacherId: userId,
        schoolId: "default-school", // Use default school for file-based auth
      });
      
      const classroom = await storage.createClassroom(classroomData);
      res.json(classroom);
    } catch (error) {
      console.error("Error creating classroom:", error);
      res.status(500).json({ message: "Failed to create classroom" });
    }
  });

  app.get('/api/teacher/classrooms/:id/students', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const userId = user.id || user.username;
      
      if (user?.role !== 'teacher') {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      
      // Verify teacher owns this classroom
      const classroom = await storage.getClassroomById(id);
      if (!classroom || classroom.teacherId !== userId) {
        res.status(403).json({ message: "Access denied - not your classroom" });
        return;
      }
      
      const students = await storage.getStudentsByClassroom(id);
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.post('/api/teacher/permissions', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (user?.role !== 'teacher') {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      
      const userId = user.id || user.username;
      const permissionData = insertLessonPermissionSchema.parse({
        ...req.body,
        grantedBy: userId,
      });
      
      const permission = await storage.grantLessonPermission(permissionData);
      res.json(permission);
    } catch (error) {
      console.error("Error granting permission:", error);
      res.status(500).json({ message: "Failed to grant permission" });
    }
  });

  // Lesson creation route (for teachers and admins)
  app.post('/api/lessons', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        res.status(403).json({ message: "Access denied - only teachers and admins can create lessons" });
        return;
      }
      
      const userId = user.id || user.username;
      const lessonData = insertLessonSchema.parse({
        ...req.body,
        authorId: userId, // Set the author to the current user
      });
      
      const lesson = await storage.createLesson(lessonData);
      
      // Strip sensitive content from response (like expectedAnswers for structured content)
      const filteredLesson = stripAnswersFromLesson(lesson, false); // Always show full content to lesson creators
      res.json(filteredLesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  // Admin routes
  app.post('/api/admin/lessons', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (user?.role !== 'admin') {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  // Lesson proposals routes
  app.post('/api/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      const userId = user.id || user.username;

      const proposalData = insertLessonProposalSchema.parse({
        ...req.body,
        authorId: userId,
        schoolId: "default-school", // Use default school for file-based auth
        status: 'draft'
      });

      const proposal = await storage.createLessonProposal(proposalData);
      res.json(proposal);
    } catch (error) {
      console.error("Error creating proposal:", error);
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  app.get('/api/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      // Simplified for file-based auth - all authenticated users can see proposals
      const proposals = await storage.getLessonProposals("default-school");
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.get('/api/proposals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      
      const proposal = await storage.getLessonProposalById(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // Simplified for file-based auth - all authenticated users can view proposals

      res.json(proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  app.patch('/api/proposals/:id/submit', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.username;
      
      const proposal = await storage.getLessonProposalById(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      if (proposal.authorId !== userId) {
        return res.status(403).json({ message: "Only the author can submit this proposal" });
      }

      const updated = await storage.submitLessonProposal(id);
      res.json(updated);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      res.status(500).json({ message: "Failed to submit proposal" });
    }
  });

  app.patch('/api/proposals/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.username;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin' && user?.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers and admins can approve proposals" });
      }

      const lesson = await storage.approveLessonProposal(id);
      res.json(lesson);
    } catch (error) {
      console.error("Error approving proposal:", error);
      res.status(500).json({ message: "Failed to approve proposal" });
    }
  });

  // Proposal voting routes
  app.post('/api/proposals/:id/vote', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.username;
      
      const proposal = await storage.getLessonProposalById(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // Check school access
      if (!await storage.checkSchoolAccess(userId, proposal.schoolId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const voteData = insertProposalVoteSchema.parse({
        ...req.body,
        proposalId: id,
        voterId: userId
      });

      const vote = await storage.voteOnProposal(voteData);
      res.json(vote);
    } catch (error) {
      console.error("Error voting on proposal:", error);
      res.status(500).json({ message: "Failed to vote on proposal" });
    }
  });

  app.get('/api/proposals/:id/votes', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.username;
      
      const proposal = await storage.getLessonProposalById(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // Check school access
      if (!await storage.checkSchoolAccess(userId, proposal.schoolId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const votes = await storage.getProposalVotes(id);
      res.json(votes);
    } catch (error) {
      console.error("Error fetching votes:", error);
      res.status(500).json({ message: "Failed to fetch votes" });
    }
  });

  // Lesson rating routes
  app.post('/api/lessons/:id/rate', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.username;
      
      const lesson = await storage.getLessonById(id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Check school access if lesson belongs to a school
      if (lesson.schoolId && !await storage.checkSchoolAccess(userId, lesson.schoolId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const ratingData = insertLessonRatingSchema.parse({
        ...req.body,
        lessonId: id,
        userId
      });

      const rating = await storage.rateLesson(ratingData);
      res.json(rating);
    } catch (error) {
      console.error("Error rating lesson:", error);
      res.status(500).json({ message: "Failed to rate lesson" });
    }
  });

  app.get('/api/lessons/:id/ratings', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id || req.user.username;
      
      const lesson = await storage.getLessonById(id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Check school access if lesson belongs to a school
      if (lesson.schoolId && !await storage.checkSchoolAccess(userId, lesson.schoolId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const ratings = await storage.getLessonRatings(id);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  // School-based lesson access
  app.get('/api/school/lessons', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.username;
      const user = await storage.getUser(userId);
      
      if (!user || !user.schoolId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const lessons = await storage.getLessonsBySchool(user.schoolId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching school lessons:", error);
      res.status(500).json({ message: "Failed to fetch school lessons" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
