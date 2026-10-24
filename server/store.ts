import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import type { Database, Lesson, User } from "@shared/core/types";
import { DB_VERSION } from "@shared/core/types";
import { lessonsFromCsv } from "@shared/core/lessons";
import { buildDemoDatabase, emptyDatabase } from "@shared/core/seed";
import { log } from "./vite";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const LESSON_FILES = ["science", "technology", "engineering", "mathematics"];

export const hashPassword = (p: string) => bcrypt.hash(p, 12);
export const verifyPassword = (p: string, hash: string) => bcrypt.compare(p, hash).catch(() => false);
export const newId = () => randomUUID();

function bundledLessons(): Lesson[] {
  return LESSON_FILES.flatMap((name) => {
    const file = path.join(DATA_DIR, "lessons", `${name}.csv`);
    return fs.existsSync(file) ? lessonsFromCsv(fs.readFileSync(file, "utf-8")) : [];
  });
}

/** Pulls accounts from the legacy users.json so existing installs keep their logins. */
function legacyUsers(): User[] {
  const file = path.join(process.cwd(), "users.json");
  if (!fs.existsSync(file)) return [];
  try {
    const { users = [] } = JSON.parse(fs.readFileSync(file, "utf-8"));
    return users.map((u: any) => ({
      id: newId(),
      username: String(u.username).toLowerCase(),
      passwordHash: u.password,
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      role: ["admin", "teacher", "parent", "student"].includes(u.role) ? u.role : "student",
      childIds: [],
      active: true,
      createdAt: u.createdAt || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

let cache: Database | null = null;
let writing = Promise.resolve();

export async function loadDatabase(): Promise<Database> {
  if (cache) return cache;
  if (fs.existsSync(DB_FILE)) {
    cache = JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as Database;
    if (cache.version !== DB_VERSION) log(`db.json is version ${cache.version}, expected ${DB_VERSION}`);
    return cache;
  }
  const lessons = bundledLessons();
  if (process.env.SEED_DEMO === "true") {
    cache = await buildDemoDatabase(lessons, hashPassword, newId);
    log("Created data/db.json with demo accounts (password: demo1234)");
  } else {
    cache = emptyDatabase(lessons, process.env.ORG_NAME || "STEM Academy");
    cache.users = legacyUsers();
    log(`Created data/db.json${cache.users.length ? ` and imported ${cache.users.length} users from users.json` : ""}`);
  }
  await saveDatabase(cache);
  return cache;
}

/** Writes are serialized and atomic (temp file + rename) so a crash never leaves half a file. */
export function saveDatabase(db: Database): Promise<void> {
  cache = db;
  writing = writing.then(async () => {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DB_FILE}.tmp`;
    await fs.promises.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.promises.rename(tmp, DB_FILE);
  });
  return writing;
}
