import { db } from "void/db";

/** A Drizzle transaction on the app database. */
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Rows from a raw `db.execute(sql\`…\`)` query, typed by the caller. Used for Better Auth tables, which are not in `@schema`. */
export function rowsOf<T>(result: { rows: unknown[] }): T[] {
  return result.rows as T[];
}
