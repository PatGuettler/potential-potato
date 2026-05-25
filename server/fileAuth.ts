import fs from 'fs/promises';
import path from 'path';
import session from 'express-session';
import MemoryStore from 'memorystore';
import bcrypt from 'bcrypt';
import type { Express, RequestHandler } from 'express';
import { getUsersFilePath } from './paths';
import { storage } from './storage';
import {
  isThemePreference,
  normalizeThemePreference,
  type ThemePreference,
} from '../shared/theme';

interface LocalUser {
  username: string;
  password: string; // Hashed password
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'teacher' | 'admin';
  themePreference?: ThemePreference;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'teacher' | 'admin';
  themePreference: ThemePreference;
}

function toSessionUser(user: LocalUser): SessionUser {
  return {
    id: user.username,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    themePreference: normalizeThemePreference(user.themePreference),
  };
}

interface UserStorage {
  users: LocalUser[];
  lastModified: string;
}

export class FileUserManager {
  private usersCache: UserStorage | null = null;

  clearCache(): void {
    this.usersCache = null;
  }

  async loadUsers(): Promise<UserStorage> {
    const usersFile = getUsersFilePath();
    try {
      const data = await fs.readFile(usersFile, 'utf-8');
      this.usersCache = JSON.parse(data);
      return this.usersCache!;
    } catch (error) {
      // File doesn't exist, create empty storage
      const emptyStorage: UserStorage = {
        users: [],
        lastModified: new Date().toISOString()
      };
      await this.saveUsers(emptyStorage);
      this.usersCache = emptyStorage;
      return emptyStorage;
    }
  }

  async saveUsers(storage: UserStorage): Promise<void> {
    storage.lastModified = new Date().toISOString();
    await fs.writeFile(getUsersFilePath(), JSON.stringify(storage, null, 2));
    this.usersCache = storage;
  }

  async findUser(username: string): Promise<LocalUser | undefined> {
    const userStorage = await this.loadUsers();
    return userStorage.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  async validateCredentials(username: string, password: string): Promise<LocalUser | null> {
    const user = await this.findUser(username);
    if (!user) {
      return null;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }
    
    return user;
  }

  async createUser(userData: {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: 'student' | 'teacher' | 'admin';
  }): Promise<LocalUser> {
    const userStorage = await this.loadUsers();
    
    // Check if user already exists
    const existingUser = userStorage.users.find(u => 
      u.username.toLowerCase() === userData.username.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash the password before storing
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser: LocalUser = {
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'student',
      themePreference: 'system',
      createdAt: new Date().toISOString()
    };

    userStorage.users.push(newUser);
    await this.saveUsers(userStorage);

    // Also create user in storage system
    await storage.upsertUser({
      id: userData.username, // Use username as ID for simplicity
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      role: userData.role || 'student'
    });

    return newUser;
  }

  async getAllUsers(): Promise<LocalUser[]> {
    const userStorage = await this.loadUsers();
    return userStorage.users;
  }

  async hasAnyUsers(): Promise<boolean> {
    const userStorage = await this.loadUsers();
    return userStorage.users.length > 0;
  }

  async updateProfile(
    username: string,
    updates: {
      email?: string;
      firstName?: string;
      lastName?: string;
      themePreference?: ThemePreference;
    },
  ): Promise<LocalUser> {
    const userStorage = await this.loadUsers();
    const index = userStorage.users.findIndex(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );

    if (index === -1) {
      throw new Error('User not found');
    }

    const user = userStorage.users[index];

    if (updates.email !== undefined) user.email = updates.email;
    if (updates.firstName !== undefined) user.firstName = updates.firstName;
    if (updates.lastName !== undefined) user.lastName = updates.lastName;
    if (updates.themePreference !== undefined) {
      user.themePreference = updates.themePreference;
    }

    await this.saveUsers(userStorage);

    await storage.upsertUser({
      id: user.username,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      role: user.role,
    });

    return user;
  }
}

export const fileUserManager = new FileUserManager();

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemStore = MemoryStore(session);
  const sessionStore = new MemStore({
    checkPeriod: sessionTtl,
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'local-dev-secret-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production, HTTP in dev
      sameSite: 'lax', // CSRF protection
      maxAge: sessionTtl,
    },
  });
}

export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export async function setupAuth(app: Express) {
  app.use(getSession());
  
  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      const user = await fileUserManager.validateCredentials(username, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Regenerate session on login to prevent session fixation attacks
      (req as any).session.regenerate((err: any) => {
        if (err) {
          console.error('Session regeneration error:', err);
        }
        
        const sessionUser = toSessionUser(user);
        (req as any).session.user = sessionUser;
        
        (req as any).session.save((err: any) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: 'Login failed' });
          }
          
          res.json({ 
            message: 'Login successful',
            user: sessionUser,
          });
        });
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Register endpoint
  app.post('/api/register', async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, role } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      const newUser = await fileUserManager.createUser({
        username,
        password,
        email,
        firstName,
        lastName,
        role
      });

      // Regenerate session and automatically log in the new user
      (req as any).session.regenerate((err: any) => {
        if (err) {
          console.error('Session regeneration error:', err);
        }
        
        const sessionUser = toSessionUser(newUser);
        (req as any).session.user = sessionUser;
        
        (req as any).session.save((err: any) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: 'Registration failed' });
          }
          
          res.json({ 
            message: 'Account created successfully',
            user: sessionUser,
          });
        });
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Get current user (fresh from disk for profile fields like theme)
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const username = req.user.id || req.user.username;
      const stored = await fileUserManager.findUser(username);
      if (!stored) {
        return res.status(404).json({ message: 'User not found' });
      }
      const sessionUser = toSessionUser(stored);
      req.user = sessionUser;
      req.session.user = sessionUser;
      res.json(sessionUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update profile (appearance, name, email)
  app.patch('/api/auth/profile', isAuthenticated, async (req: any, res) => {
    try {
      const username = req.user.id || req.user.username;
      const { email, firstName, lastName, themePreference } = req.body;

      if (themePreference !== undefined && !isThemePreference(themePreference)) {
        return res.status(400).json({
          message: 'themePreference must be light, dark, or system',
        });
      }

      const updated = await fileUserManager.updateProfile(username, {
        ...(email !== undefined && { email }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(themePreference !== undefined && { themePreference }),
      });

      const sessionUser = toSessionUser(updated);
      req.user = sessionUser;
      req.session.user = sessionUser;

      await new Promise<void>((resolve, reject) => {
        req.session.save((err: Error | null) => (err ? reject(err) : resolve()));
      });

      res.json(sessionUser);
    } catch (error: any) {
      console.error('Profile update error:', error);
      res.status(400).json({ message: error.message || 'Failed to update profile' });
    }
  });

  // Check if any users exist (for initial setup)
  app.get('/api/auth/setup-needed', async (req, res) => {
    try {
      const hasUsers = await fileUserManager.hasAnyUsers();
      res.json({ setupNeeded: !hasUsers });
    } catch (error) {
      console.error('Setup check error:', error);
      res.status(500).json({ message: 'Failed to check setup status' });
    }
  });
}