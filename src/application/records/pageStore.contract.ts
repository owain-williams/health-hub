/**
 * The PageStore contract (ADR 0004). Runs against every adapter so the
 * in-memory fake cannot drift from the R2 adapter.
 */
import { beforeEach, describe, expect, it } from "vite-plus/test";
import type { PageContent } from "../../domains/records/rules";
import type { PageStore } from "./ports";

const bytes = (text: string) => new TextEncoder().encode(text);
const read = async (body: ReadableStream<Uint8Array>) => new Uint8Array(await new Response(body).arrayBuffer());

export function pageStoreContract(adapter: string, setup: () => Promise<PageStore>) {
  describe(`PageStore contract: ${adapter}`, () => {
    let store: PageStore;
    beforeEach(async () => (store = await setup()));

    const photos: PageContent[] = [
      { contentType: "image/jpeg", bytes: bytes("first") },
      { contentType: "image/png", bytes: bytes("second") },
    ];

    it("returns each stored file by its position from 1, with its content type, size and bytes", async () => {
      await store.put("alice", "r1", photos);
      const first = await store.get("alice", "r1", 1);
      expect(first).toMatchObject({ contentType: "image/jpeg", size: 5 });
      expect(await read(first!.body)).toEqual(bytes("first"));
      const second = await store.get("alice", "r1", 2);
      expect(second).toMatchObject({ contentType: "image/png", size: 6 });
      expect(await read(second!.body)).toEqual(bytes("second"));
      expect(await store.get("alice", "r1", 3)).toBeNull();
    });

    it("keeps each Person's files apart", async () => {
      await store.put("alice", "r1", photos);
      expect(await store.get("bob", "r1", 1)).toBeNull();
    });

    it("deletes one Record's files and nothing else", async () => {
      await store.put("alice", "r1", photos);
      await store.put("alice", "r10", photos); // shares a key prefix with r1 as a string
      await store.deleteRecord("alice", "r1");
      await store.deleteRecord("alice", "never-stored");
      expect(await store.get("alice", "r1", 1)).toBeNull();
      expect(await store.get("alice", "r10", 1)).not.toBeNull();
    });

    it("deletes every file of one Person on Erasure, and no one else's", async () => {
      await store.put("alice", "r1", photos);
      await store.put("alice", "r2", photos);
      await store.put("alice-2", "r3", photos); // shares a key prefix with alice as a string
      await store.deleteAllFor("alice");
      expect((await store.listRecordFolders()).map((f) => `${f.personId}/${f.recordId}`)).toEqual(["alice-2/r3"]);
    });

    it("lists every Record folder once, with when its newest file was stored", async () => {
      const before = Date.now() - 1000;
      await store.put("alice", "r1", photos);
      await store.put("bob", "r2", [photos[0]]);
      const after = Date.now() + 1000;
      const folders = (await store.listRecordFolders()).sort((a, b) => a.recordId.localeCompare(b.recordId));
      expect(folders.map((f) => [f.personId, f.recordId])).toEqual([
        ["alice", "r1"],
        ["bob", "r2"],
      ]);
      for (const f of folders) {
        expect(f.newestStoredAt.getTime()).toBeGreaterThanOrEqual(before);
        expect(f.newestStoredAt.getTime()).toBeLessThanOrEqual(after);
      }
    });
  });
}
