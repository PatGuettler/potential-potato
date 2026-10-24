import express, { type Request, Response, NextFunction } from "express";
import cookieSession from "cookie-session";
import { createServer } from "http";
import { createApi, type Session } from "@shared/core/api";
import { createStore, hashPassword, newId, randomToken, sha256, verifyPassword } from "./store";
import { createMailer } from "./mailer";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const isProd = app.get("env") === "production";
const port = parseInt(process.env.PORT || "5000", 10);
const appUrl = (process.env.APP_URL || `http://localhost:${port}`).replace(/\/$/, "");

if (isProd && !process.env.SESSION_SECRET) {
  console.error("SESSION_SECRET must be set in production (any long random string).");
  process.exit(1);
}
if (isProd && !process.env.APP_URL) log("WARNING: APP_URL is not set; password reset links will point at localhost.");

app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

// Sessions are signed cookies holding only the user id and session version, so they survive
// restarts and work across several servers. Revocation happens via the user's sessionVersion.
app.use(
  cookieSession({
    name: "stem_session",
    secret: process.env.SESSION_SECRET || "dev-only-secret",
    httpOnly: true,
    sameSite: "lax",
    secure: isProd && process.env.INSECURE_COOKIES !== "true",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  }),
);

/** Basic brute-force protection for sign-in and password reset. */
function rateLimit(limit: number, countIf: (status: number) => boolean) {
  const hits = new Map<string, { count: number; until: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const entry = hits.get(key);
    if (entry && entry.until > Date.now() && entry.count >= limit) {
      return res.status(429).json({ message: "Too many attempts. Try again in a few minutes." });
    }
    res.on("finish", () => {
      if (!countIf(res.statusCode)) return;
      const e = hits.get(key);
      hits.set(key, { count: (e && e.until > Date.now() ? e.count : 0) + 1, until: Date.now() + 10 * 60 * 1000 });
    });
    next();
  };
}
app.use("/api/login", rateLimit(10, (s) => s === 401));
app.use("/api/password", rateLimit(10, () => true));

(async () => {
  const api = createApi({
    store: await createStore(),
    hashPassword,
    verifyPassword,
    newId,
    sha256,
    randomToken,
    resetLink: (token) => `${appUrl}/reset/${token}`,
    sendPasswordReset: createMailer(),
    allowSelfRegistration: process.env.ALLOW_SELF_REGISTRATION !== "false",
  });

  app.all("/api/*", async (req, res) => {
    const start = Date.now();
    const session = (req.session ?? {}) as Session;
    const result = await api({ method: req.method, path: req.path, body: req.body, session });
    if (!session.userId) req.session = null;
    log(`${req.method} ${req.path} ${result.status} in ${Date.now() - start}ms`);
    res.status(result.status).json(result.body);
  });

  const server = createServer(app);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
  });

  if (!isProd) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
})();
