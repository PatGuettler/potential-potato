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

## What each role gets

- **Students:** a dashboard with assignments and due dates (overdue ones flagged), lessons in progress, and per-subject progress. Lessons have reading material, auto-graded quizzes (multiple choice, number, text, code), and optional written responses. Students can join a class with a code.
- **Teachers:** classes with join codes; assignments with due dates; a gradebook (student × assignment) with CSV export; a review queue for written responses with score and feedback; a "needs attention" list of students with overdue work; private notes to parents; a lesson editor with quiz builder.
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
| `SESSION_SECRET` | random per boot | Cookie signing key. Set it, or everyone is logged out on restart |
| `DATA_DIR` | `./data` | Where `db.json` and `lessons/` live. Back this folder up |
| `ALLOW_SELF_REGISTRATION` | `true` | Set to `false` so only admins can create accounts |
| `SEED_DEMO` | `false` | Seed the demo school on first boot |
| `ORG_NAME` | `STEM Academy` | Initial organization name |
| `INSECURE_COOKIES` | `false` | Allow cookies over plain HTTP in production (only behind a trusted proxy) |

Run it behind HTTPS (for example Caddy or nginx). The data is a single JSON file written atomically. That's plenty for a school or tutoring group of a few hundred people.

### Upgrading from the old version

If a `users.json` from the previous file-based login is present when `data/db.json` is first created, those accounts are imported with their existing passwords. Accounts that were `student` stay students. An admin can change roles afterwards.

## Development

```bash
npm run check       # TypeScript
npm test            # API tests (node:test)
npm run dev:demo    # the static demo with hot reload
npm run build:demo  # build the GitHub Pages site into dist/demo
```

### How it fits together

```
shared/core/   One API (routes, permissions, grading, seed data), shared by both runtimes
server/        Express: sessions, bcrypt, JSON-file store, serves the built app
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
