import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { createServer } from "http";
import { randomBytes } from "crypto";
import { createApi } from "@shared/core/api";
import { hashPassword, loadDatabase, newId, saveDatabase, verifyPassword } from "./store";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const isProd = app.get("env") === "production";

if (isProd && !process.env.SESSION_SECRET) {
  log("WARNING: SESSION_SECRET is not set; sessions will reset on every restart.");
}

app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

const MemoryStore = createMemoryStore(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET || randomBytes(32).toString("hex"),
    store: new MemoryStore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd && process.env.INSECURE_COOKIES !== "true",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

// Basic brute-force protection for the login endpoint.
const attempts = new Map<string, { count: number; until: number }>();
app.use("/api/login", (req, res, next) => {
  const key = req.ip || "unknown";
  const entry = attempts.get(key);
  if (entry && entry.until > Date.now() && entry.count >= 10) {
    return res.status(429).json({ message: "Too many login attempts. Try again in a few minutes." });
  }
  res.on("finish", () => {
    if (res.statusCode === 401) {
      const e = attempts.get(key);
      attempts.set(key, { count: (e && e.until > Date.now() ? e.count : 0) + 1, until: Date.now() + 10 * 60 * 1000 });
    } else if (res.statusCode === 200) {
      attempts.delete(key);
    }
  });
  next();
});

const api = createApi({
  load: loadDatabase,
  save: saveDatabase,
  hashPassword,
  verifyPassword,
  newId,
  allowSelfRegistration: process.env.ALLOW_SELF_REGISTRATION !== "false",
});

app.all("/api/*", async (req, res) => {
  const start = Date.now();
  const sess = req.session as unknown as { userId?: string };
  const before = sess.userId;
  const result = await api({ method: req.method, path: req.path, body: req.body, session: sess });

  const finish = () => {
    log(`${req.method} ${req.path} ${result.status} in ${Date.now() - start}ms`);
    res.status(result.status).json(result.body);
  };
  // Rotate the session id on login to prevent session fixation.
  if (sess.userId && sess.userId !== before) {
    const userId = sess.userId;
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ message: "Session error" });
      (req.session as unknown as { userId?: string }).userId = userId;
      finish();
    });
  } else if (before && !sess.userId) {
    req.session.destroy(() => finish());
  } else {
    finish();
  }
});

(async () => {
  await loadDatabase();
  const server = createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
  });

  if (!isProd) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
})();
