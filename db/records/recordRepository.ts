/** The Drizzle adapter for RecordRepository (ADR 0004). */
import { records } from "@schema";
import { and, desc, eq, gte, sql } from "void/db";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { RecordRepository, StoredRecord } from "../../src/application/records/ports";
import { dispatch } from "../../src/application/events";
import type { Tx } from "../../src/application/db";
import type { Kind } from "../../src/domains/records/rules";

/** The app database or an open transaction, such as the Erasure transaction. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Executor = NodePgDatabase<any>;

type Row = typeof records.$inferSelect;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Ids arrive from URLs; Postgres rejects a malformed uuid outright, so treat one as matching nothing. */
const isUuid = (id: string) => UUID.test(id);

function toStored(row: Row): StoredRecord {
  return {
    id: row.id,
    personId: row.personId,
    form: row.form as StoredRecord["form"],
    originalName: row.originalName,
    fileCount: row.fileCount,
    contentHash: row.contentHash,
    kind: row.kind as Kind | null,
    recordDate: row.recordDate,
    uploadedAt: row.uploadedAt,
  };
}

export function drizzleRecordRepository(executor: Executor): RecordRepository {
  const owned = (personId: string, recordId: string) => and(eq(records.personId, personId), eq(records.id, recordId));
  return {
    async add(record, event) {
      await executor.transaction(async (tx) => {
        await tx.insert(records).values(record);
        await dispatch(event, tx as unknown as Tx);
      });
    },
    async remove(personId, recordId, event) {
      if (!isUuid(recordId)) return false;
      return executor.transaction(async (tx) => {
        const deleted = await tx.delete(records).where(owned(personId, recordId)).returning({ id: records.id });
        if (deleted.length === 0) return false;
        await dispatch(event, tx as unknown as Tx);
        return true;
      });
    },
    async removeAllFor(personId) {
      await executor.delete(records).where(eq(records.personId, personId));
    },
    async get(personId, recordId) {
      if (!isUuid(recordId)) return null;
      const [row] = await executor.select().from(records).where(owned(personId, recordId)).limit(1);
      return row ? toStored(row) : null;
    },
    async findByHash(personId, contentHash) {
      const [row] = await executor
        .select()
        .from(records)
        .where(and(eq(records.personId, personId), eq(records.contentHash, contentHash)))
        .limit(1);
      return row ? toStored(row) : null;
    },
    async countUploadedSince(personId, since) {
      const [row] = await executor
        .select({ n: sql<number>`count(*)::int` })
        .from(records)
        .where(and(eq(records.personId, personId), gte(records.uploadedAt, since)));
      return row.n;
    },
    async listFor(personId) {
      const rows = await executor.select().from(records).where(eq(records.personId, personId)).orderBy(desc(records.uploadedAt), desc(records.id));
      return rows.map(toStored);
    },
  };
}
