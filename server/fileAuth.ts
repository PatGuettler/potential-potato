import fs from 'fs/promises';
import path from 'path';
import session from 'express-session';
import MemoryStore from 'memorystore';
import bcrypt from 'bcrypt';
import type { Express, RequestHandler } from 'express';
import { storage } from './storage';

interface LocalUser {
  username: string;
  password: string; // Hashed password
  email?: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
}

interface UserStorage {
  users: LocalUser[];
  lastModified: string;
}

const USERS_FILE = path.join(process.cwd(), 'users.json');

export class FileUserManager {
  private usersCache: UserStorage | null = null;

  async loadUsers(): Promise<UserStorage> {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
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
    await fs.writeFile(USERS_FILE, JSON.stringify(storage, null, 2));
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
        
        // Set session
        (req as any).session.user = {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          id: user.username // Use username as ID
        };
        
        (req as any).session.save((err: any) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: 'Login failed' });
          }
          
          res.json({ 
            message: 'Login successful',
            user: {
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role
            }
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
        
        (req as any).session.user = {
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          id: newUser.username
        };
        
        (req as any).session.save((err: any) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: 'Registration failed' });
          }
          
          res.json({ 
            message: 'Account created successfully',
            user: {
              username: newUser.username,
              email: newUser.email,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              role: newUser.role
            }
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

  // Get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json({
        id: user.id || user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        username: user.username
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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