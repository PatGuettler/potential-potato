# StemGenius

StemGenius is a self-contained STEM learning platform for local and classroom use. Students browse lessons across Science, Technology, Engineering, and Mathematics, complete interactive quizzes, use an embedded code editor, and track progress. Teachers manage classrooms and lesson access; admins create and edit curriculum.

No cloud database is required—accounts, lessons, and progress are stored on disk as JSON and CSV files.

## What it does

| Audience | Capabilities |
|----------|----------------|
| **Students** | Browse categories, open lessons, answer quiz questions, run code exercises, see scores and completion progress |
| **Teachers** | Everything students can do, plus classrooms, student lists, and granting lesson permissions |
| **Admins** | Full access including lesson creation, editing, proposals, and the admin overview |

Lessons ship as CSV files under `data/lessons/` (**20 lessons per category**, 80 total). Content is curated for factual accuracy (science, math, engineering, and computing fundamentals). Regenerate the built-in curriculum anytime:

```bash
npm run generate:lessons
```

Then restart `npm run dev` to reload from disk. New lessons created in the UI are appended to the matching category CSV. User accounts live in `users.json`; lesson and quiz progress persist under `data/progress/`.

## Architecture

A single **Node.js + Express** app serves both the REST API and the React UI (Vite in development, static build in production).

```
stemgenius/
├── client/           # React frontend (Vite)
├── server/           # Express API, file auth, CSV storage
├── shared/           # TypeScript types and Zod schemas
├── data/
│   ├── lessons/      # science.csv, technology.csv, …
│   └── progress/     # progress.csv, questions.csv
├── users.json        # Local user accounts (bcrypt passwords)
└── package.json      # npm scripts
```

The `backend/` folder contains an older Flask API that is **not** used by the default dev workflow. Use the unified server below.

## Prerequisites

- **Node.js** 18 or newer
- **npm** (included with Node)

Optional: Python 3.8+ only if you want to run the legacy Flask backend separately.

## Install

From the project root:

```bash
npm install
```

On WSL/Linux:

```bash
cd ~/dev/StemGenius   # or your clone path
npm install
```

## Run locally

One command starts the API and frontend together:

```bash
npm run dev
```

Open **http://localhost:5000** in your browser.

The dev server:

- Serves the React app with hot reload
- Exposes JSON API routes under `/api/*`
- Uses cookie-based sessions (`users.json` for accounts)

### Production build

```bash
npm run build
npm start
```

`npm start` serves the built client and API on port **5000** (override with `PORT=3000 npm start`).

## First-time setup

1. Open http://localhost:5000
2. If no users exist, you are prompted to **create the first account** (choose student, teacher, or admin)
3. Sign in and open a category from the sidebar (Science, Technology, Engineering, Mathematics)
4. Open a lesson and work through content and quiz questions

### Suggested test flow

1. **Register** as `admin` / `admin123` (or any username) with role **Admin**
2. Confirm the **dashboard** shows progress cards for four categories
3. Go to **Science** → open a lesson → submit quiz answers and confirm feedback
4. Return to the dashboard and confirm progress updates (also written to `data/progress/progress.csv`)
5. As admin, use **Create Lesson** to add a lesson; verify it appears in the category list
6. **Logout** (header) and **register** a **Student** account; confirm lessons and quizzes work without extra teacher grants (standalone mode allows all lessons until a teacher assigns restricted permissions)

## Data and backups

| Data | Location |
|------|----------|
| Users | `users.json` |
| Lessons | `data/lessons/*.csv` |
| Lesson completion | `data/progress/progress.csv` |
| Per-question quiz state | `data/progress/questions.csv` |

Copy the project folder to back up all local data.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server on port 5000 |
| `npm run build` | Build client and server bundle |
| `npm start` | Run production server |
| `npm run check` | TypeScript check |
| `npm test` | Run API unit tests (Vitest + Supertest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run generate:lessons` | Rebuild all 80 curriculum CSV files from `scripts/lessons/` |

## Automated tests

API tests live in `tests/api.test.ts`. They spin up the Express app in-process with isolated temp data (lessons CSV, `users.json`, progress files) so your real `data/` folder is never touched.

```bash
npm test
```

Coverage includes authentication, categories, **lesson creation** (`POST /api/lessons`), fetching lessons by id/category, answer validation, structured quiz questions, progress, teacher classrooms/permissions, proposals, ratings, and admin routes.

## npm install warnings

After `npm install`, npm may report **~20 vulnerabilities**. That is expected for this stack:

- Many come from **dev-only** tools (Vite, drizzle-kit, esbuild). They do not affect the local Express app at runtime.
- **Do not run** `npm audit fix --force` — it can downgrade Vite and break the project.
- Safe refresh after pulling changes:

```bash
rm -rf node_modules/.vite
npm install
npm audit fix    # optional; only applies non-breaking patches
npm run dev
```

The line `Re-optimizing dependencies because lockfile has changed` is a **one-time Vite message** after dependencies change, not an error.

When `npm run dev` prints `serving on http://localhost:5000`, the app is running. Open that URL in your browser.

## Troubleshooting

**Port in use**

```bash
# Linux/WSL
lsof -i :5000
kill <pid>
```

**Module errors**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Blank page / API errors**

- Confirm `npm run dev` is running and the terminal shows `serving on port 5000`
- Open browser devtools → Network; API calls should go to the same origin (e.g. `/api/auth/user`)

**Student cannot submit quiz answers**

- In classroom mode, teachers must grant lesson permissions. In standalone mode (no grants on file), all lessons are available by default.

## Security notes

- Intended for local and educational use
- Passwords are hashed with bcrypt
- Change `SESSION_SECRET` in production
- Do not commit real `users.json` with production passwords to public repos

## License

Educational use—modify and extend as needed.
