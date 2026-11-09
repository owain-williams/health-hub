/** In-memory adapters for tests (ADR 0004). Working fakes, not call-recording mocks. */
import type { PersonId } from "../../domains/identity/events";
import type { RecordDeleted, RecordId, RecordUploaded } from "../../domains/records/events";
import type { PageContent } from "../../domains/records/rules";
import type { PageStore, RecordFolder, RecordRepository, StoredRecord } from "./ports";

export function memoryRecordRepository() {
  let rows: StoredRecord[] = [];
  const published: (RecordUploaded | RecordDeleted)[] = [];
  let nextAddFailure: Error | null = null;
  const repository: RecordRepository = {
    async add(record, event) {
      if (nextAddFailure) {
        const error = nextAddFailure;
        nextAddFailure = null;
        throw error;
      }
      if (rows.some((r) => r.personId === record.personId && r.contentHash === record.contentHash))
        throw new Error("records: this Person already has a Record with this content hash");
      rows.push({ ...record });
      published.push(event);
    },
    async findByHash(personId, contentHash) {
      return rows.find((r) => r.personId === personId && r.contentHash === contentHash) ?? null;
    },
    async remove(personId, recordId, event) {
      const before = rows.length;
      rows = rows.filter((r) => !(r.personId === personId && r.id === recordId));
      if (rows.length === before) return false;
      published.push(event);
      return true;
    },
    async removeAllFor(personId) {
      rows = rows.filter((r) => r.personId !== personId);
    },
    async get(personId, recordId) {
      return rows.find((r) => r.personId === personId && r.id === recordId) ?? null;
    },
    async countUploadedSince(personId, since) {
      return rows.filter((r) => r.personId === personId && r.uploadedAt >= since).length;
    },
    async listFor(personId) {
      return rows.filter((r) => r.personId === personId).sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    },
  };
  return Object.assign(repository, {
    published,
    /** Makes the next `add` fail as a database would, writing nothing. */
    failNextAdd: (error: Error) => void (nextAddFailure = error),
  });
}

export function memoryPageStore(now: () => Date) {
  const objects = new Map<string, { page: PageContent; storedAt: Date }>();
  let nextDeleteFailure: Error | null = null;
  const store: PageStore = {
    async put(personId: PersonId, recordId: RecordId, pages) {
      pages.forEach((page, i) => objects.set(`persons/${personId}/records/${recordId}/${i + 1}`, { page, storedAt: now() }));
    },
    async get(personId, recordId, n) {
      const stored = objects.get(`persons/${personId}/records/${recordId}/${n}`);
      if (!stored) return null;
      const { contentType, bytes } = stored.page;
      return { contentType, size: bytes.length, body: new Blob([bytes as Uint8Array<ArrayBuffer>]).stream() };
    },
    async deleteRecord(personId, recordId) {
      if (nextDeleteFailure) {
        const error = nextDeleteFailure;
        nextDeleteFailure = null;
        throw error;
      }
      const prefix = `persons/${personId}/records/${recordId}/`;
      for (const key of [...objects.keys()]) if (key.startsWith(prefix)) objects.delete(key);
    },
    async deleteAllFor(personId) {
      const prefix = `persons/${personId}/`;
      for (const key of [...objects.keys()]) if (key.startsWith(prefix)) objects.delete(key);
    },
    async listRecordFolders() {
      const folders = new Map<string, RecordFolder>();
      for (const [key, { storedAt }] of objects) {
        const [, personId, , recordId] = key.split("/");
        const folder = folders.get(`${personId}/${recordId}`);
        if (!folder) folders.set(`${personId}/${recordId}`, { personId, recordId, newestStoredAt: storedAt });
        else if (storedAt > folder.newestStoredAt) folder.newestStoredAt = storedAt;
      }
      return [...folders.values()];
    },
  };
  return Object.assign(store, {
    /** Makes the next delete fail as storage would, removing nothing. */
    failNextDelete: (error: Error) => void (nextDeleteFailure = error),
  });
}
