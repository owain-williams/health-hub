/**
 * A real Postgres for contract tests: `TEST_DATABASE_URL`, or the local
 * `health_hub_test` database. Applies the checked-in migrations once.
 */
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import pg from "pg";
import { fileURLToPath } from "node:url";

let ready: Promise<{ db: NodePgDatabase; pool: pg.Pool }> | null = null;

export function testDatabase() {
  ready ??= (async () => {
    const pool = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL ?? "postgresql://localhost/health_hub_test", max: 4 });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: fileURLToPath(new URL("../migrations", import.meta.url)) });
    return { db, pool };
  })();
  return ready;
}

/** Empties the tables Records tests touch. */
export async function resetRecordsTables(db: NodePgDatabase) {
  await db.execute(sql`truncate table "records", "persons" cascade`);
}
