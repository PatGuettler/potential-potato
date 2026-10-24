/**
 * Backend-free demo mode for GitHub Pages.
 *
 * Runs the real shared API in the browser and answers every `/api/*` fetch from it,
 * persisting the database to localStorage so each visitor gets their own sandbox.
 */
import { createApi, memoryStore, type Session } from "@shared/core/api";
import { lessonsFromCsv } from "@shared/core/lessons";
import { buildDemoDatabase } from "@shared/core/seed";
import type { Database } from "@shared/core/types";
import { DB_VERSION } from "@shared/core/types";
import science from "@data/lessons/science.csv?raw";
import technology from "@data/lessons/technology.csv?raw";
import engineering from "@data/lessons/engineering.csv?raw";
import mathematics from "@data/lessons/mathematics.csv?raw";

const DB_KEY = "stem-academy-demo-db";
const SESSION_KEY = "stem-academy-demo-session";

export const isDemo = import.meta.env.VITE_DEMO === "true";

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode): the demo still works for this tab.
  }
}

async function sha256(text: string) {
  if (!crypto?.subtle) return `plain:${text}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

const hashPassword = (password: string) => sha256(`stem-demo:${password}`);

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

const newId = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function resetDemo() {
  try {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
  window.location.hash = "";
  window.location.reload();
}

export async function installDemoBackend() {
  const lessons = [science, technology, engineering, mathematics].flatMap(lessonsFromCsv);
  let db = read<Database>(DB_KEY);
  if (!db || db.version !== DB_VERSION) {
    db = await buildDemoDatabase(lessons, hashPassword, newId);
    write(DB_KEY, db);
  }
  let session: Session = read<Session>(SESSION_KEY) ?? {};

  const api = createApi({
    store: memoryStore(db, (next) => write(DB_KEY, next)),
    hashPassword,
    verifyPassword: async (password, hash) => (await hashPassword(password)) === hash,
    newId,
    sha256,
    randomToken,
    resetLink: (token) => `${window.location.origin}${window.location.pathname}#/reset/${token}`,
    // There's no mail server in the demo, so show the link that would have been emailed.
    exposeResetLinks: true,
  });

  const realFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, window.location.href);
    const idx = url.pathname.indexOf("/api/");
    if (url.origin !== window.location.origin || idx === -1) return realFetch(input, init);

    const method = init?.method ?? (input instanceof Request ? input.method : "GET");
    let body: unknown;
    if (typeof init?.body === "string" && init.body) {
      try {
        body = JSON.parse(init.body);
      } catch {
        return new Response(JSON.stringify({ message: "Invalid JSON" }), { status: 400 });
      }
    }
    const res = await api({ method, path: url.pathname.slice(idx), body, session });
    write(SESSION_KEY, session);
    // A short delay keeps loading states honest without making the demo feel slow.
    await new Promise((r) => setTimeout(r, 60));
    return new Response(JSON.stringify(res.body), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  };
}
