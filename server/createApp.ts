import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";

export function applyApiMiddleware(app: Express): void {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}

/** Express app with API routes and error handler (no Vite/static). Used in tests. */
export async function createApp(): Promise<Express> {
  const app = express();
  applyApiMiddleware(app);
  await registerRoutes(app);

  app.use((err: { status?: number; statusCode?: number; message?: string }, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return app;
}
