# Roadmap

## Done in this release

**Fixes to the original demo**
- Logout went to a GET URL that didn't exist. It's now a real sign-out.
- Icons never showed because Font Awesome was never loaded.
- Anyone could register as an admin. Now only the first account is admin, and later sign-ups are students.
- Lesson text was injected as raw HTML (an XSS risk). It now renders through a safe Markdown renderer.
- Rating and proposal components called the API with the wrong arguments.
- Lesson deletion called an endpoint that didn't exist.
- Adding a lesson glued rows together in the CSV files. This corrupted three lessons, which have been repaired.
- Committed session cookies and password hashes (`cookies.txt`, `users.json`) were removed and are now git-ignored.
- Removed the Python/Flask backend, the unused Postgres/Drizzle layer, and Replit-only plugins (71 npm packages).

**New for teaching and tracking groups**
- Parent role with linked children, overdue alerts, a printable report, and a notes thread with teachers.
- Classes with join codes, assignments with due dates, and late tracking.
- Gradebook with CSV export, plus a "needs attention" list.
- Written-response review queue with scores and feedback that students and parents can see.
- Admin user management (roles, deactivate, reset password, link families), school stats, and a JSON backup.
- Auto-graded quizzes on every bundled lesson. Lessons can only be completed once every question is answered correctly. The recorded score is first-try accuracy.
- Time-on-task tracking and an activity feed scoped to each role.
- Lesson editor with live preview, multiple-choice questions, rubric, and teacher guide. Archiving a lesson keeps students' history.
- Login rate limiting, session rotation on login, httpOnly/secure cookies, and atomic database writes.
- A static GitHub Pages demo that runs the real API in the browser, with one-click demo accounts.

## Next up (suggested)

1. **Email or SMS digests for parents:** a weekly summary and an overdue alert. The activity log already has the data.
2. **Password reset by email** and optional SSO (Google Workspace / Microsoft) for schools.
3. **CSV roster import:** bulk-create students and parents and link families in one upload.
4. **Multiple organizations** in one deployment, if this will be offered as hosted software.
5. **SQLite storage** once a single group goes past a few hundred active users. The `load`/`save` interface in `server/store.ts` is the only thing that changes.
6. **Messaging beyond notes:** per-class announcements and read receipts.
7. **Accessibility pass:** keyboard navigation of the gradebook, screen-reader labels on status chips.
8. **Code-split the lesson page:** the Monaco editor and charts load only when needed.
9. **Mastery and standards tagging:** map questions to standards and show mastery per standard.
10. **Attendance:** a simple per-session check-in for tutoring groups that track hours.
