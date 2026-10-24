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
- Login rate limiting, httpOnly/secure cookies, and atomic database writes.
- A static GitHub Pages demo that runs the real API in the browser, with one-click demo accounts.

**Production back end (second release)**
- Postgres storage via `DATABASE_URL` (Supabase, Neon, Render, …), with transactional writes that are safe across several servers. A failed request rolls back cleanly.
- Signed-cookie sessions that survive restarts and scale out. Password changes, resets and deactivation revoke all of a person's sessions.
- Password reset by email (SMTP), admin-issued reset links for people without email, and a "My account" page to change your password.
- Production refuses to start without `SESSION_SECRET`. Reset requests are rate-limited and don't reveal whether an account exists.

**Curriculum and quiz builder (third release)**
- K–12 course catalog: 32 standards-aligned courses, 128 lessons with objectives, vocabulary, standards, worked examples, and quizzes with explanations.
- Courses → units → lessons, course pages with progress, and "assign a whole unit" with spaced due dates. Classes can follow a course.
- Quiz builder: five question types, click-to-mark correct answers, accepted alternate answers, number tolerance, hints and explanations, inline validation, a live student preview, reordering and duplicating, pasting from a document, and copying from other lessons.
- Lesson editor with course and unit filing, objectives, vocabulary, standards, a reading template, a written-response rubric, and a readiness checklist.

**Homeschool and co-op release (fourth release)**
- Family mode: parents sign up as a family school, add children, invite a co-parent, and plan any course for any child at any level with a chosen pace.
- Attendance and hours: automatic from study time, plus manual entries by subject; progress toward state-required days and hours; CSV export and print.
- High school transcripts with credits, letter grades, and a credit-weighted GPA, with suggestions from finished courses; printable.
- Portfolios of work samples per child.
- Co-op tools: class schedules, locations, grade ranges, seat limits, fees, open enrollment by families, parent volunteer teachers, and a shared calendar.
- Curriculum grew to 44 courses and 408 lessons: 104 math, 104 science, 100 technology, and 100 engineering. New courses include Python, Web Design, Data Science & AI, Cybersecurity, Digital Literacy, Engineering Explorers K–2 and 3–5, Electricity & Electronics, Robotics & Automation, Principles of Engineering, Electronics & Circuits, and Civil & Environmental Engineering. All lessons are original.

## Next up (suggested)

To sell a family plan ($50–100 a year):
1. **Hosted multi-tenant accounts:** one deployment serving many families and co-ops, each with its own isolated data (today a deployment is one school or co-op).
2. **Billing:** Stripe Checkout and customer portal for a yearly family plan and a per-co-op plan, with trials and a free tier.
3. **Normalized Postgres tables** behind the same `ApiStore` interface, so thousands of families fit in one database.
4. **Adaptive practice:** generated practice problems per skill and spaced review, so practice never runs out.
5. **Video and read-aloud** for younger learners.

Also useful:

1. **Email digests for parents:** a weekly summary and an overdue alert, reusing the SMTP setup and the activity log.
2. **SSO:** Google Workspace / Microsoft sign-in for schools.
3. **CSV roster import:** bulk-create students and parents and link families in one upload.
4. **Messaging beyond notes:** per-class announcements and read receipts.
5. **Accessibility pass:** keyboard navigation of the gradebook, screen-reader labels on status chips.
6. **Code-split the lesson page:** the Monaco editor and charts load only when needed.
7. **Mastery and standards tagging:** map questions to standards and show mastery per standard.
