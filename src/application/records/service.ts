/** Records use cases (docs/specs/records.md). Take a `PersonId` only, resolved at the edge (ADR 0003). */
import type { PersonId } from "../../domains/identity/events";
import type { RecordId } from "../../domains/records/events";
import {
  classifyUpload,
  contentHash,
  HOUR_MS,
  recordLabel,
  SWEEP_GRACE_MS,
  UPLOADS_PER_HOUR,
  type SuppliedFile,
  type UploadRejection,
} from "../../domains/records/rules";
import type { PageStore, RecordRepository, StoredPage, StoredRecord } from "./ports";

export interface RecordsDeps {
  records: RecordRepository;
  pages: PageStore;
  now: () => Date;
  newId: () => RecordId;
}

export type UploadResult =
  | { outcome: "created" | "duplicate"; recordId: RecordId }
  | { outcome: "rejected"; rejection: UploadRejection }
  | { outcome: "rate_limited" };

export interface RecordSummary {
  id: RecordId;
  label: string;
  uploadedAt: Date;
  /** Whether Extraction has read it. Always false until Extraction exists. */
  read: boolean;
}

export interface RecordView extends RecordSummary {
  originalName: string | null;
  form: "pdf" | "photos";
  /** Stored files: 1 for a PDF, one per photo. */
  fileCount: number;
}

function summarise(r: StoredRecord): RecordSummary {
  return {
    id: r.id,
    label: recordLabel({ ...r, pageCount: r.form === "photos" ? r.fileCount : null }),
    uploadedAt: r.uploadedAt,
    read: false,
  };
}

export class RecordsService {
  constructor(private readonly deps: RecordsDeps) {}

  async upload(personId: PersonId, files: SuppliedFile[]): Promise<UploadResult> {
    const upload = classifyUpload(files);
    if (!upload.ok) return { outcome: "rejected", rejection: upload };
    const since = new Date(this.deps.now().getTime() - HOUR_MS);
    if ((await this.deps.records.countUploadedSince(personId, since)) >= UPLOADS_PER_HOUR) return { outcome: "rate_limited" };
    const hash = await contentHash(upload.pages.map((p) => p.bytes));
    const existing = await this.deps.records.findByHash(personId, hash);
    if (existing) return { outcome: "duplicate", recordId: existing.id };
    const recordId = this.deps.newId();
    await this.deps.pages.put(personId, recordId, upload.pages);
    try {
      await this.deps.records.add(
        {
          id: recordId,
          personId,
          form: upload.form,
          originalName: upload.originalName,
          fileCount: upload.pages.length,
          contentHash: hash,
          kind: null,
          recordDate: null,
          uploadedAt: this.deps.now(),
        },
        { type: "RecordUploaded", personId, recordId },
      );
    } catch (error) {
      // R2 cannot join the transaction. Remove what was stored; the sweep catches anything left.
      await this.deps.pages.deleteRecord(personId, recordId).catch((cleanup) => console.error("records: Pages not removed after failed insert; the sweep will retry", cleanup));
      throw error;
    }
    return { outcome: "created", recordId };
  }

  async list(personId: PersonId): Promise<RecordSummary[]> {
    return (await this.deps.records.listFor(personId)).map(summarise);
  }

  async view(personId: PersonId, recordId: RecordId): Promise<RecordView | null> {
    const r = await this.deps.records.get(personId, recordId);
    if (!r) return null;
    return { ...summarise(r), originalName: r.originalName, form: r.form, fileCount: r.fileCount };
  }

  /** File `n` (from 1) of a Record the Person holds. Ownership is checked against the Record, never inferred from storage. */
  async readPage(personId: PersonId, recordId: RecordId, n: number): Promise<StoredPage | null> {
    const r = await this.deps.records.get(personId, recordId);
    if (!r || !Number.isInteger(n) || n < 1 || n > r.fileCount) return null;
    return this.deps.pages.get(personId, recordId, n);
  }

  /** Deletion: the row and its event in one transaction, then the files after commit (the sweep retries failures). */
  async delete(personId: PersonId, recordId: RecordId): Promise<"deleted" | "not_found"> {
    const removed = await this.deps.records.remove(personId, recordId, { type: "RecordDeleted", personId, recordId });
    if (!removed) return "not_found";
    try {
      await this.deps.pages.deleteRecord(personId, recordId);
    } catch (error) {
      console.error("records: files not removed after Deletion; the sweep will retry", error);
    }
    return "deleted";
  }

  /** Deletes stored Record folders that have no Record row and are older than the grace period. Returns how many. */
  async sweep(): Promise<number> {
    const cutoff = this.deps.now().getTime() - SWEEP_GRACE_MS;
    let swept = 0;
    for (const folder of await this.deps.pages.listRecordFolders()) {
      if (folder.newestStoredAt.getTime() >= cutoff) continue;
      if (await this.deps.records.get(folder.personId, folder.recordId)) continue;
      await this.deps.pages.deleteRecord(folder.personId, folder.recordId);
      swept++;
    }
    return swept;
  }
}
