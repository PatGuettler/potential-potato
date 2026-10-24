# STEM Academy

Lessons, assignments, and progress tracking for small schools, tutoring groups, co-ops, and clubs.
Students do lessons and quizzes. Teachers assign work and grade it. Parents follow along. Admins run the place.

**Live demo:** https://patguettler.github.io/potential-potato/ (runs entirely in your browser, nothing to install)

## Demo accounts

Every demo account uses the password **`demo1234`**. The login screen also has one-click buttons for each.

| Username   | Role    | What to try |
|------------|---------|-------------|
| `pat`      | Admin   | Pat's personal admin account |
| `admin`    | Admin   | Users & families: create accounts, change roles, link parents to children, export a backup |
| `teacher`  | Teacher | Open *Period 2* to see the gradebook, assign a lesson, grade work in the review queue, export CSV |
| `parent`   | Parent  | Follow Alex and Emma, read the full report, leave a note for the teacher |
| `student`  | Student | See overdue work, finish *Chemical Reactions*, submit a written response |

Demo data is saved in your browser's localStorage. Use **Reset demo data** in the yellow banner to start over.

Presenting it? Follow the 10-minute script in [docs/DEMO.md](docs/DEMO.md).

## Curriculum

The app ships with a full K–12 STEM catalog: **32 courses, 128 lessons, 513 auto-graded questions**.

| Band | Mathematics (Common Core) | Science (NGSS) | Technology & engineering |
|---|---|---|---|
| K–5 | Kindergarten–Grade 5 Math | Kindergarten–Grade 5 Science | Computing Foundations (K–2), Coding Foundations (3–5) |
| 6–8 | Grade 6, 7, 8 Math | Earth & Space (6), Life (7), Physical (8) | CS Discoveries, Engineering Design |
| 9–12 | Algebra I, Geometry, Algebra II, Precalculus | Biology, Chemistry, Physics, Environmental Science | CS Principles, Engineering Design & Robotics |

Each lesson has learning objectives, standards codes, vocabulary, a reading with worked examples, and a quiz in which every question explains its answer. 22 lessons also include a written response with a teacher rubric. Courses live in `shared/curriculum/` as plain TypeScript, so they're easy to review and extend. Teachers can create their own courses, units, and lessons in the app.

## What each role gets

- **Students:** a dashboard with assignments and due dates (overdue ones flagged), lessons in progress, and per-subject progress. Lessons have reading material, auto-graded quizzes (multiple choice, number, text, code), and optional written responses. Students can join a class with a code.
- **Teachers:** a quiz builder (multiple choice with click-to-mark answers, true/false, numbers with a tolerance, short answers with several accepted answers, hints, explanations, live student preview, paste-from-a-document, and copy questions from any lesson); courses and units; assign a whole unit with spaced due dates; classes with join codes; assignments with due dates; a gradebook (student × assignment) with CSV export; a review queue for written responses with score and feedback; a "needs attention" list of students with overdue work; private notes to parents; a lesson editor with quiz builder.
- **Parents:** one card per child showing overdue alerts, scores, time spent, and what's coming up. A printable full report includes teacher feedback and a notes thread with the teacher.
- **Admins:** school-wide stats and activity; user management (roles, deactivation, password resets, parent ↔ child links, CSV export); all classes; the organization name; a full JSON backup.

## Running it for real

Requires Node.js 20+.

```bash
npm install
npm run dev            # http://localhost:5000 (API + app with hot reload)
```

On first start the server creates `data/db.json` from the lessons in `data/lessons/*.csv`.
The first account registered becomes the **administrator**. Anyone who self-registers after that becomes a student. Teachers and parents are created by an admin.

To start with the demo school instead, run `SEED_DEMO=true npm run dev` before `data/db.json` exists.

### Production

```bash
npm run build
SESSION_SECRET=$(openssl rand -hex 32) npm start
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `5000` | HTTP port |
| `SESSION_SECRET` | none (required in production) | Cookie signing key: any long random string. Changing it signs everyone out |
| `DATABASE_URL` | none | Postgres connection string. If unset, data is stored in `data/db.json` |
| `DATABASE_SSL` | auto | Set to `false` to turn off TLS for a non-local database |
| `APP_URL` | `http://localhost:PORT` | Public URL, used in password-reset links |
| `SMTP_URL` | none | e.g. `smtps://user:pass@smtp.example.com:465`. Turns on reset emails |
| `MAIL_FROM` | `STEM Academy <no-reply@localhost>` | Sender for reset emails |
| `DATA_DIR` | `./data` | Where `db.json` (file storage) and `lessons/` live |
| `ALLOW_SELF_REGISTRATION` | `true` | Set to `false` so only admins can create accounts |
| `SEED_DEMO` | `false` | Seed the demo school on first boot |
| `ORG_NAME` | `STEM Academy` | Initial organization name |
| `INSECURE_COOKIES` | `false` | Allow cookies over plain HTTP in production (only behind a trusted proxy) |

Run it behind HTTPS (for example Caddy or nginx).

### Storage: Postgres or a JSON file

- **Postgres (recommended for anything shared):** set `DATABASE_URL` and the app creates its table on first start. Any provider works: Supabase, Neon, Render, Railway, or your own. Writes are transactional with a row lock, so you can run several app servers against one database, and a failed request never leaves half-saved data. Backups come from your Postgres provider.
- **JSON file (zero setup):** without `DATABASE_URL`, data lives in `data/db.json`, written atomically. Fine for one server and a group of a few hundred people.

Sessions are signed cookies, so nobody is logged out when the server restarts or you add servers. Changing a password, resetting it, or deactivating an account signs that person out everywhere.

#### Free hosting ($0/month)

| Piece | Free option | Notes |
|---|---|---|
| Demo site | GitHub Pages | Already set up: deploys on every push to `main` |
| App server | [Render](https://render.com) free web service | Use the included `render.yaml` blueprint. Sleeps after 15 min idle, so the first visit after that takes about 30 to 60 s |
| Database | [Neon](https://neon.tech) free Postgres | 0.5 GB, far more than a school needs. Doesn't pause your data |
| Email (optional) | [Brevo](https://brevo.com) free SMTP (300/day) or Gmail SMTP with an app password | Without it, admins hand out reset links |

Steps: create a Neon project and copy the connection string. On Render, choose **New → Blueprint**, pick this repo, and paste `DATABASE_URL` and `APP_URL` (your `onrender.com` URL). `SESSION_SECRET` is generated for you.

#### Example: Supabase or Neon + Render

1. Create a Postgres database and copy its connection string.
2. On Render (or Railway or Fly), create a web service from this repo with build command `npm ci && npm run build` and start command `npm start`.
3. Set `DATABASE_URL`, `SESSION_SECRET`, `APP_URL` (your public URL), and `SMTP_URL`/`MAIL_FROM` if you want password-reset emails.
4. Open the site and register: the first account becomes the administrator.

### Password resets

- **Self-service:** "Forgot your password?" on the sign-in page emails a one-hour, single-use link when `SMTP_URL` is set.
- **For people without email (common for kids):** an admin opens the person in *Users & families* and clicks **Create reset link**. That link lasts 3 days.
- Anyone signed in can change their password under **My account** (click your name in the sidebar).

### Upgrading from the old version

If a `users.json` from the previous file-based login is present when `data/db.json` is first created, those accounts are imported with their existing passwords. Accounts that were `student` stay students. An admin can change roles afterwards.

## Development

```bash
npm run check       # TypeScript
npm test            # API tests (node:test)
TEST_DATABASE_URL=postgres://user:pass@localhost/db npm test   # also run the Postgres store test
npm run dev:demo    # the static demo with hot reload
npm run build:demo  # build the GitHub Pages site into dist/demo
```

### How it fits together

```
shared/core/   One API (routes, permissions, grading, seed data), shared by both runtimes
server/        Express: cookie sessions, bcrypt, Postgres or JSON-file store, SMTP, serves the built app
client/        React + Tailwind + shadcn/ui, routed with wouter
client/src/demo/backend.ts   Runs shared/core in the browser for the GitHub Pages demo
data/lessons/  Lesson content as CSV (one file per subject)
```

The GitHub Pages build intercepts `fetch('/api/…')` and answers from the same `shared/core/api.ts` the server uses. The demo and the real app can't drift apart.

### Deploying the demo

`.github/workflows/pages.yml` builds and publishes the demo on every push to `main`.
In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions** (one-time).

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for what's done and what's next.

## License

GPL-3.0. See [LICENSE](LICENSE).
