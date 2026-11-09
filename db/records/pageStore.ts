/**
 * The R2 adapter for PageStore (ADR 0004). The bucket is in the EU
 * jurisdiction (ADR 0001); keys are `persons/<PersonId>/records/<RecordId>/<n>`.
 */
import type { PageStore, RecordFolder } from "../../src/application/records/ports";
import type { PageContent } from "../../src/domains/records/rules";

const personPrefix = (personId: string) => `persons/${personId}/`;
const recordPrefix = (personId: string, recordId: string) => `${personPrefix(personId)}records/${recordId}/`;

/** Every object under a prefix, following R2's pagination. */
async function* listAll(bucket: R2Bucket, prefix: string): AsyncGenerator<R2Object> {
  let cursor: string | undefined;
  do {
    const page = await bucket.list({ prefix, cursor });
    yield* page.objects;
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
}

async function deletePrefix(bucket: R2Bucket, prefix: string): Promise<void> {
  let batch: string[] = [];
  for await (const object of listAll(bucket, prefix)) {
    batch.push(object.key);
    if (batch.length === 1000) {
      await bucket.delete(batch);
      batch = [];
    }
  }
  if (batch.length > 0) await bucket.delete(batch);
}

export function r2PageStore(bucket: R2Bucket): PageStore {
  return {
    async put(personId, recordId, pages) {
      for (const [i, page] of pages.entries())
        await bucket.put(`${recordPrefix(personId, recordId)}${i + 1}`, page.bytes, { httpMetadata: { contentType: page.contentType } });
    },
    async get(personId, recordId, n) {
      const object = await bucket.get(`${recordPrefix(personId, recordId)}${n}`);
      if (!object) return null;
      return { contentType: object.httpMetadata?.contentType as PageContent["contentType"], size: object.size, body: object.body as ReadableStream<Uint8Array> };
    },
    async deleteRecord(personId, recordId) {
      await deletePrefix(bucket, recordPrefix(personId, recordId));
    },
    async deleteAllFor(personId) {
      await deletePrefix(bucket, personPrefix(personId));
    },
    async listRecordFolders() {
      const folders = new Map<string, RecordFolder>();
      for await (const object of listAll(bucket, "persons/")) {
        const [, personId, , recordId] = object.key.split("/");
        const id = `${personId}/${recordId}`;
        const folder = folders.get(id);
        if (!folder) folders.set(id, { personId, recordId, newestStoredAt: object.uploaded });
        else if (object.uploaded > folder.newestStoredAt) folder.newestStoredAt = object.uploaded;
      }
      return [...folders.values()];
    },
  };
}
