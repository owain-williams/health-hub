/**
 * The RecordRepository contract (ADR 0004). Runs against every adapter so the
 * in-memory fake cannot drift from the Drizzle adapter.
 */
import { beforeEach, describe, expect, it } from "vite-plus/test";
import type { PersonId } from "../../domains/identity/events";
import type { RecordDeleted, RecordUploaded } from "../../domains/records/events";
import type { RecordRepository, StoredRecord } from "./ports";

export interface RecordRepositoryHarness {
  repo: RecordRepository;
  /** Every event the repository has emitted, in order. */
  published: () => (RecordUploaded | RecordDeleted)[];
  /** Two Persons that exist, for scoping checks. */
  persons: [PersonId, PersonId];
}

export function recordRepositoryContract(adapter: string, setup: () => Promise<RecordRepositoryHarness>) {
  describe(`RecordRepository contract: ${adapter}`, () => {
    let h: RecordRepositoryHarness;
    let alice: PersonId;
    let bob: PersonId;
    beforeEach(async () => {
      h = await setup();
      [alice, bob] = h.persons;
    });

    function record(overrides: Partial<StoredRecord> = {}): StoredRecord {
      return {
        id: crypto.randomUUID(),
        personId: alice,
        form: "pdf",
        originalName: "scan_0034.pdf",
        fileCount: 1,
        contentHash: crypto.randomUUID(),
        kind: null,
        recordDate: null,
        uploadedAt: new Date("2026-11-08T10:00:00.000Z"),
        ...overrides,
      };
    }
    const uploaded = (r: StoredRecord): RecordUploaded => ({ type: "RecordUploaded", personId: r.personId, recordId: r.id });

    it("returns an added Record exactly as stored, and emits RecordUploaded", async () => {
      const r = record({ form: "photos", originalName: null, fileCount: 3 });
      await h.repo.add(r, uploaded(r));
      expect(await h.repo.get(alice, r.id)).toEqual(r);
      expect(h.published()).toEqual([uploaded(r)]);
    });

    it("keeps a Kind and Record Date as given", async () => {
      const r = record({ kind: "clinic_letter", recordDate: "2024-03-12" });
      await h.repo.add(r, uploaded(r));
      expect(await h.repo.get(alice, r.id)).toEqual(r);
    });

    it("never returns a Record to another Person", async () => {
      const r = record();
      await h.repo.add(r, uploaded(r));
      expect(await h.repo.get(bob, r.id)).toBeNull();
      expect(await h.repo.listFor(bob)).toEqual([]);
      expect(await h.repo.findByHash(bob, r.contentHash)).toBeNull();
      expect(await h.repo.countUploadedSince(bob, new Date(0))).toBe(0);
    });

    it("treats a malformed Record id, such as one typed into a URL, as not found", async () => {
      const event: RecordDeleted = { type: "RecordDeleted", personId: alice, recordId: "not-a-uuid" };
      expect(await h.repo.get(alice, "not-a-uuid")).toBeNull();
      expect(await h.repo.remove(alice, "not-a-uuid", event)).toBe(false);
    });

    it("lists the Person's Records newest Upload first", async () => {
      const older = record({ uploadedAt: new Date("2026-11-01T09:00:00.000Z") });
      const newer = record({ uploadedAt: new Date("2026-11-08T09:00:00.000Z") });
      const bobs = record({ personId: bob });
      for (const r of [older, newer, bobs]) await h.repo.add(r, uploaded(r));
      expect((await h.repo.listFor(alice)).map((r) => r.id)).toEqual([newer.id, older.id]);
    });

    it("finds the Person's Record by content hash", async () => {
      const r = record({ contentHash: "abc123" });
      await h.repo.add(r, uploaded(r));
      expect((await h.repo.findByHash(alice, "abc123"))?.id).toBe(r.id);
      expect(await h.repo.findByHash(alice, "other")).toBeNull();
    });

    it("refuses a second Record with the same content hash for the same Person", async () => {
      const first = record({ contentHash: "same" });
      await h.repo.add(first, uploaded(first));
      const second = record({ contentHash: "same" });
      await expect(h.repo.add(second, uploaded(second))).rejects.toThrow();
      expect(await h.repo.get(alice, second.id)).toBeNull();
      const bobs = record({ personId: bob, contentHash: "same" });
      await h.repo.add(bobs, uploaded(bobs));
    });

    it("counts Uploads at or after a moment", async () => {
      for (const at of ["2026-11-08T09:00:00.000Z", "2026-11-08T09:30:00.000Z", "2026-11-08T10:00:00.000Z"]) {
        const r = record({ uploadedAt: new Date(at) });
        await h.repo.add(r, uploaded(r));
      }
      expect(await h.repo.countUploadedSince(alice, new Date("2026-11-08T09:30:00.000Z"))).toBe(2);
    });

    it("removes only the Person's own Record, emitting RecordDeleted only when it did", async () => {
      const r = record();
      await h.repo.add(r, uploaded(r));
      const deleted: RecordDeleted = { type: "RecordDeleted", personId: bob, recordId: r.id };
      expect(await h.repo.remove(bob, r.id, deleted)).toBe(false);
      expect(await h.repo.get(alice, r.id)).toEqual(r);

      const own: RecordDeleted = { type: "RecordDeleted", personId: alice, recordId: r.id };
      expect(await h.repo.remove(alice, r.id, own)).toBe(true);
      expect(await h.repo.get(alice, r.id)).toBeNull();
      expect(h.published()).toEqual([uploaded(r), own]);
    });

    it("removes every Record of one Person on Erasure, and no one else's", async () => {
      const a1 = record();
      const a2 = record();
      const b1 = record({ personId: bob });
      for (const r of [a1, a2, b1]) await h.repo.add(r, uploaded(r));
      await h.repo.removeAllFor(alice);
      expect(await h.repo.listFor(alice)).toEqual([]);
      expect((await h.repo.listFor(bob)).map((r) => r.id)).toEqual([b1.id]);
    });
  });
}
