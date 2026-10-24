import fs from "fs";
import path from "path";
import { createHash, randomBytes, randomUUID } from "crypto";
import bcrypt from "bcrypt";
import pg from "pg";
import type { ApiStore } from "@shared/core/api";
import type { Database, Lesson, User } from "@shared/core/types";
import { migrateDatabase } from "@shared/core/types";
import { lessonsFromCsv } from "@shared/core/lessons";
import { buildDemoDatabase, emptyDatabase } from "@shared/core/seed";
import { log } from "./vite";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const LESSON_FILES = ["science", "technology", "engineering", "mathematics"];

export const hashPassword = (p: string) => bcrypt.hash(p, 12);
export const verifyPassword = (p: string, hash: string) => bcrypt.compare(p, hash).catch(() => false);
export const newId = () => randomUUID();
export const sha256 = async (text: string) => createHash("sha256").update(text).digest("hex");
export const randomToken = () => randomBytes(32).toString("base64url");

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
      sessionVersion: 1,
      createdAt: u.createdAt || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

/** The database a brand-new install starts with. */
async function initialDatabase(): Promise<Database> {
  const lessons = bundledLessons();
  if (process.env.SEED_DEMO === "true") {
    log("Seeding the demo school (every account's password is demo1234)");
    return buildDemoDatabase(lessons, hashPassword, newId);
  }
  const db = emptyDatabase(lessons, process.env.ORG_NAME || "STEM Academy");
  db.users = legacyUsers();
  if (db.users.length) log(`Imported ${db.users.length} users from users.json`);
  return db;
}

/**
 * JSON file store for small, single-server installs. Writes run on a copy and are saved
 * atomically (temp file + rename), serialized so concurrent requests can't interleave.
 */
async function fileStore(): Promise<ApiStore> {
  const file = path.join(DATA_DIR, "db.json");
  let db: Database;
  if (fs.existsSync(file)) {
    db = migrateDatabase(JSON.parse(fs.readFileSync(file, "utf-8")));
  } else {
    db = await initialDatabase();
  }
  const write = async (next: Database) => {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
    await fs.promises.writeFile(`${file}.tmp`, JSON.stringify(next, null, 2));
    await fs.promises.rename(`${file}.tmp`, file);
  };
  await write(db);
  log(`Using file storage at ${file}`);

  let queue: Promise<unknown> = Promise.resolve();
  return {
    async transact(isWrite, fn) {
      if (!isWrite) return (await fn(db)).value;
      const run = queue.then(async () => {
        const draft = structuredClone(db);
        const { value, changed } = await fn(draft);
        if (changed) {
          await write(draft);
          db = draft;
        }
        return value;
      });
      queue = run.catch(() => undefined);
      return run;
    },
  };
}

/**
 * Postgres store (Supabase, Neon, Render, RDS, …). The document lives in one row; every write
 * takes a row lock inside a transaction, so any number of app servers can share the database
 * without lost updates, and a failed request rolls back cleanly.
 */
export async function postgresStore(pool: pg.Pool): Promise<ApiStore> {
  await pool.query(`
    create table if not exists stem_academy_state (
      id integer primary key,
      doc jsonb not null,
      updated_at timestamptz not null default now()
    )`);
  const existing = await pool.query("select 1 from stem_academy_state where id = 1");
  if (existing.rowCount === 0) {
    await pool.query("insert into stem_academy_state (id, doc) values (1, $1) on conflict (id) do nothing", [JSON.stringify(await initialDatabase())]);
  }

  return {
    async transact(isWrite, fn) {
      const client = await pool.connect();
      try {
        await client.query("begin");
        const { rows } = await client.query(`select doc from stem_academy_state where id = 1${isWrite ? " for update" : ""}`);
        const db = migrateDatabase(rows[0].doc as Database);
        const { value, changed } = await fn(db);
        if (isWrite && changed) {
          await client.query("update stem_academy_state set doc = $1, updated_at = now() where id = 1", [JSON.stringify(db)]);
        }
        await client.query("commit");
        return value;
      } catch (err) {
        await client.query("rollback").catch(() => undefined);
        throw err;
      } finally {
        client.release();
      }
    },
  };
}

export async function createStore(): Promise<ApiStore> {
  const url = process.env.DATABASE_URL;
  if (!url) return fileStore();
  const needsSsl = !/localhost|127\.0\.0\.1/.test(url) && process.env.DATABASE_SSL !== "false";
  const pool = new pg.Pool({ connectionString: url, max: 10, ssl: needsSsl ? { rejectUnauthorized: false } : undefined });
  const store = await postgresStore(pool);
  log("Using Postgres storage");
  return store;
}
