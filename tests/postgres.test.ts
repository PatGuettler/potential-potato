import { test } from "node:test";
import assert from "node:assert/strict";
import pg from "pg";
import { createApi, type Session } from "../shared/core/api";
import { DEMO_PASSWORD } from "../shared/core/seed";
import { hashPassword, postgresStore, verifyPassword } from "../server/store";
import { env } from "./helpers";

// Runs against a real Postgres when TEST_DATABASE_URL is set, e.g.
// TEST_DATABASE_URL=postgres://stem:stem@localhost/stem npm test
const url = process.env.TEST_DATABASE_URL;

test("Postgres store: seeds, persists, and serializes concurrent writes", { skip: !url && "TEST_DATABASE_URL not set" }, async () => {
  const pool = new pg.Pool({ connectionString: url });
  try {
    await pool.query("drop table if exists stem_academy_state");
    process.env.SEED_DEMO = "true";
    // The store seeds with real bcrypt hashes, so verify with bcrypt too.
    const real = (store: Awaited<ReturnType<typeof postgresStore>>) => ({ ...env(store), hashPassword, verifyPassword });
    const api = createApi(real(await postgresStore(pool)));
    const s: Session = {};
    assert.equal((await api({ method: "POST", path: "/api/login", body: { username: "teacher", password: "nope" }, session: s })).status, 401);
    assert.equal((await api({ method: "POST", path: "/api/login", body: { username: "teacher", password: DEMO_PASSWORD }, session: s })).status, 200);

    // 20 simultaneous notes from two "servers" (two stores on the same database).
    const api2 = createApi(real(await postgresStore(pool)));
    await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        (i % 2 ? api : api2)({ method: "POST", path: "/api/students/u-student/notes", body: { body: `note ${i}` }, session: { ...s } }),
      ),
    );
    const report: any = (await api({ method: "GET", path: "/api/students/u-student/report", session: s })).body;
    assert.equal(report.notes.filter((x: any) => x.body.startsWith("note ")).length, 20, "no lost updates");

    // A failing write rolls back.
    const before = (await pool.query("select updated_at from stem_academy_state")).rows[0].updated_at;
    await api({ method: "POST", path: "/api/teacher/classrooms/c-mc/assignments", body: { lessonId: "math-5-1-1", dueDate: "x" }, session: s });
    const after = (await pool.query("select updated_at from stem_academy_state")).rows[0].updated_at;
    assert.deepEqual(after, before);
  } finally {
    delete process.env.SEED_DEMO;
    await pool.query("drop table if exists stem_academy_state");
    await pool.end();
  }
});
