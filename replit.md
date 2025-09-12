# STEM Academy Learning Platform

## Overview

STEM Academy is a comprehensive educational platform designed for Science, Technology, Engineering, and Mathematics learning. The application provides interactive lessons, real-world problems, hands-on coding experiences, and role-based access for students, teachers, and administrators. Built with a modern React frontend and Express.js backend, it features user authentication, progress tracking, content management, and interactive tools like code editors and calculators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React 18 using TypeScript, featuring a modern component-based architecture:
- **UI Framework**: Shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query for server state with React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Code Editor Integration**: Monaco Editor for in-browser coding experiences

### Backend Architecture
The server follows a RESTful API pattern with Express.js:
- **Runtime**: Node.js with TypeScript and ES modules
- **Framework**: Express.js with middleware for JSON parsing, logging, and error handling
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Authentication**: Replit Auth integration with session-based authentication
- **File Structure**: Modular route handlers with centralized storage layer

### Database Design
PostgreSQL database with Drizzle ORM providing:
- **User Management**: Users table with role-based access (student, teacher, admin)
- **Educational Content**: Categories, lessons, and user progress tracking
- **Classroom Features**: Classroom management and student enrollment
- **Session Storage**: Persistent sessions for authentication
- **Schema Migrations**: Drizzle migrations for database versioning

### Authentication & Authorization
Replit Auth integration providing:
- **OAuth Flow**: OpenID Connect with automatic user provisioning
- **Session Management**: PostgreSQL-backed sessions with configurable TTL
- **Role-Based Access**: Student, teacher, and admin roles with appropriate permissions
- **Route Protection**: Middleware-based authentication checks for protected endpoints

### Content Management
Structured educational content system:
- **STEM Categories**: Science, Technology, Engineering, Mathematics
- **Difficulty Levels**: Easy, Medium, Hard progression
- **Interactive Elements**: Code execution, calculators, step-by-step solutions
- **Progress Tracking**: Individual user progress with completion metrics

## External Dependencies

### Database & Infrastructure
- **Neon Database**: PostgreSQL hosting with connection pooling via @neondatabase/serverless
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect

### Authentication Services  
- **Replit Auth**: OpenID Connect provider for user authentication and session management

### Development & Build Tools
- **Vite**: Frontend build tool with React plugin and runtime error overlay
- **TypeScript**: Full-stack type safety with strict configuration
- **ESBuild**: Server-side bundling for production deployments

### UI & Styling Dependencies
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Shadcn/ui**: Pre-built component library with consistent design patterns

### Code Editor & Tools
- **Monaco Editor**: VS Code editor integration for in-browser coding
- **FontAwesome**: Icon library for consistent visual elements
- **Google Fonts**: Typography with Inter, DM Sans, Fira Code, and Geist Mono fonts