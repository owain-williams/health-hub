/**
 * Composition root for Records: the service on the real adapters (ADR 0004).
 * Lives in `src/` so Void infers the `STORAGE` and `DB` bindings from these imports.
 */
import { db } from "void/db";
import { storage } from "void/storage";
import { r2PageStore } from "../../../db/records/pageStore";
import { drizzleRecordRepository, type Executor } from "../../../db/records/recordRepository";
import { RecordsService } from "./service";

/** Also Identity's `PersonFiles`: pass it to Erasure. */
export const pageStore = r2PageStore(storage);

export const recordsService = new RecordsService({
  records: drizzleRecordRepository(db as unknown as Executor),
  pages: pageStore,
  now: () => new Date(),
  newId: () => crypto.randomUUID(),
});
