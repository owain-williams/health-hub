/**
 * Records ports (ADR 0004). Each has a real adapter under `db/records/`
 * and an in-memory adapter in `./memory.ts` for tests.
 */
import type { PersonId } from "../../domains/identity/events";
import type { RecordDeleted, RecordId, RecordUploaded } from "../../domains/records/events";
import type { Kind, PageContent } from "../../domains/records/rules";
import type { PersonFiles } from "../identity/erase";

export interface StoredRecord {
  id: RecordId;
  personId: PersonId;
  form: "pdf" | "photos";
  originalName: string | null;
  /** Number of stored files: 1 for a PDF (whose own page count is unknown until Extraction), N for photos. */
  fileCount: number;
  contentHash: string;
  kind: Kind | null;
  recordDate: string | null;
  uploadedAt: Date;
}

export interface RecordRepository {
  /** Inserts the Record and emits its event in one transaction. Throws if the Person already has a Record with this content hash. */
  add(record: StoredRecord, event: RecordUploaded): Promise<void>;
  /** The Person's Record with this content hash, if any. */
  findByHash(personId: PersonId, contentHash: string): Promise<StoredRecord | null>;
  /** Deletes the Person's Record and emits its event in one transaction. False if the Person holds no such Record. */
  remove(personId: PersonId, recordId: RecordId, event: RecordDeleted): Promise<boolean>;
  /** Deletes every Record of the Person. Called inside the Erasure transaction; emits nothing. */
  removeAllFor(personId: PersonId): Promise<void>;
  /** One of the Person's Records; null if it does not exist or belongs to another Person. */
  get(personId: PersonId, recordId: RecordId): Promise<StoredRecord | null>;
  /** How many Records the Person has uploaded at or after this moment. */
  countUploadedSince(personId: PersonId, since: Date): Promise<number>;
  /** The Person's Records, newest Upload first. */
  listFor(personId: PersonId): Promise<StoredRecord[]>;
}

/**
 * The bytes of each Record's Pages, under `persons/<PersonId>/records/<RecordId>/`.
 * Also Identity's `PersonFiles` port: Erasure calls `deleteAllFor` after commit.
 */
export interface PageStore extends PersonFiles {
  /** Stores a Record's files in the order given. */
  put(personId: PersonId, recordId: RecordId, pages: PageContent[]): Promise<void>;
  /** File `n` (from 1) of a Record, or null if there is none. */
  get(personId: PersonId, recordId: RecordId, n: number): Promise<StoredPage | null>;
  /** Deletes every file of one Record. Deleting a folder that does not exist is not an error. */
  deleteRecord(personId: PersonId, recordId: RecordId): Promise<void>;
  /** Deletes every file under the Person's storage prefix. */
  deleteAllFor(personId: PersonId): Promise<void>;
  /** Every Record folder in storage, with when its newest file was stored. Used by the sweep. */
  listRecordFolders(): Promise<RecordFolder[]>;
}

export interface RecordFolder {
  personId: PersonId;
  recordId: RecordId;
  newestStoredAt: Date;
}

export interface StoredPage {
  contentType: PageContent["contentType"];
  size: number;
  body: ReadableStream<Uint8Array>;
}
