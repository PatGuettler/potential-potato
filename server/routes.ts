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
} from "@shared/schema";
import { z } from "zod";

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
      
      // For students, filter by permissions
      if (user?.role === 'student') {
        const permittedLessonIds = await storage.getUserPermissions(userId);
        lessons = lessons.filter(lesson => permittedLessonIds.includes(lesson.id));
        
        // Remove answer guides
        const lessonsWithoutAnswers = lessons.map(lesson => ({
          ...lesson,
          answerGuide: null
        }));
        res.json(lessonsWithoutAnswers);
      } else {
        // Teachers and admins can see all lessons
        res.json(lessons);
      }
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
      
      // For students, filter by permissions
      if (user?.role === 'student') {
        const permittedLessonIds = await storage.getUserPermissions(userId);
        lessons = lessons.filter(lesson => permittedLessonIds.includes(lesson.id));
        
        // Remove answer guides
        const lessonsWithoutAnswers = lessons.map(lesson => ({
          ...lesson,
          answerGuide: null
        }));
        res.json(lessonsWithoutAnswers);
      } else {
        res.json(lessons);
      }
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
      
      // Check permissions for students
      if (user?.role === 'student') {
        const hasPermission = await storage.checkLessonPermission(userId, id);
        if (!hasPermission) {
          res.status(403).json({ message: "Access denied - lesson not permitted" });
          return;
        }
        
        const { answerGuide, ...lessonWithoutAnswers } = lesson;
        res.json(lessonWithoutAnswers);
      } else {
        res.json(lesson);
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
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
