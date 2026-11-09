import { beforeEach, describe, expect, it } from "vite-plus/test";
import { memoryPageStore, memoryRecordRepository } from "./memory";
import { RecordsService } from "./service";

const alice = "person-alice";
const bob = "person-bob";
const jpegBytes = (text: string) => new Uint8Array([0xff, 0xd8, 0xff, ...new TextEncoder().encode(text)]);
const read = async (body: ReadableStream<Uint8Array>) => new Uint8Array(await new Response(body).arrayBuffer());
const pdfBytes = (text = "letter") => new TextEncoder().encode(`%PDF-1.7 ${text}`);

function setup(start = new Date("2026-11-08T10:00:00Z")) {
  let now = start;
  let n = 0;
  const clock = { now: () => now, advance: (ms: number) => (now = new Date(now.getTime() + ms)) };
  const records = memoryRecordRepository();
  const pages = memoryPageStore(clock.now);
  const service = new RecordsService({ records, pages, now: clock.now, newId: () => `record-${++n}` });
  return { service, records, pages, clock };
}

describe("RecordsService", () => {
  let t: ReturnType<typeof setup>;
  beforeEach(() => (t = setup()));

  it("lists an uploaded PDF by its Original Name, not yet read", async () => {
    const result = await t.service.upload(alice, [{ name: "scan_0034.pdf", bytes: pdfBytes() }]);
    expect(result).toEqual({ outcome: "created", recordId: "record-1" });
    expect(await t.service.list(alice)).toEqual([
      { id: "record-1", label: "scan_0034.pdf", uploadedAt: new Date("2026-11-08T10:00:00Z"), read: false },
    ]);
  });

  it("returns the existing Record when the Person uploads identical content again", async () => {
    await t.service.upload(alice, [{ name: "letter.pdf", bytes: pdfBytes() }]);
    t.clock.advance(60_000);
    const again = await t.service.upload(alice, [{ name: "renamed.pdf", bytes: pdfBytes() }]);
    expect(again).toEqual({ outcome: "duplicate", recordId: "record-1" });
    expect((await t.service.list(alice)).map((r) => r.id)).toEqual(["record-1"]);
    expect(t.records.published).toEqual([{ type: "RecordUploaded", personId: alice, recordId: "record-1" }]);
  });

  it("treats identical content from another Person as a new Record", async () => {
    await t.service.upload(alice, [{ name: "letter.pdf", bytes: pdfBytes() }]);
    expect(await t.service.upload(bob, [{ name: "letter.pdf", bytes: pdfBytes() }])).toEqual({ outcome: "created", recordId: "record-2" });
    expect((await t.service.list(alice)).map((r) => r.id)).toEqual(["record-1"]);
    expect((await t.service.list(bob)).map((r) => r.id)).toEqual(["record-2"]);
  });

  it("stores nothing for a rejected Upload and says why", async () => {
    const heic = new Uint8Array([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63]);
    expect(await t.service.upload(alice, [{ name: "IMG_1.HEIC", bytes: heic }])).toEqual({
      outcome: "rejected",
      rejection: { ok: false, reason: "unsupported_type", fileName: "IMG_1.HEIC" },
    });
    expect(await t.service.list(alice)).toEqual([]);
    expect(await t.pages.listRecordFolders()).toEqual([]);
  });

  it("allows 30 Uploads in a rolling hour, refuses the 31st, and allows it again once the hour has passed", async () => {
    for (let i = 0; i < 30; i++) {
      expect((await t.service.upload(alice, [{ name: `${i}.pdf`, bytes: pdfBytes(String(i)) }])).outcome).toBe("created");
      t.clock.advance(60_000);
    }
    expect(await t.service.upload(alice, [{ name: "31.pdf", bytes: pdfBytes("31") }])).toEqual({ outcome: "rate_limited" });
    expect(await t.service.upload(bob, [{ name: "bob.pdf", bytes: pdfBytes("bob") }])).toMatchObject({ outcome: "created" });
    t.clock.advance(31 * 60_000); // the first Upload is now more than an hour old
    expect(await t.service.upload(alice, [{ name: "31.pdf", bytes: pdfBytes("31") }])).toMatchObject({ outcome: "created" });
  });

  it("removes the stored Pages when the Record cannot be inserted, and fails the Upload", async () => {
    t.records.failNextAdd(new Error("database unavailable"));
    await expect(t.service.upload(alice, [{ name: "letter.pdf", bytes: pdfBytes() }])).rejects.toThrow("database unavailable");
    expect(await t.pages.listRecordFolders()).toEqual([]);
    expect(await t.service.list(alice)).toEqual([]);
  });

  it("shows a photo Record with its Pages in the order given, and serves each Page's bytes", async () => {
    const { recordId } = (await t.service.upload(alice, [
      { name: "IMG_2.jpg", bytes: jpegBytes("second-taken") },
      { name: "IMG_1.jpg", bytes: jpegBytes("first-taken") },
    ])) as { recordId: string };

    expect(await t.service.view(alice, recordId)).toEqual({
      id: recordId,
      label: "Photos, 2 pages",
      uploadedAt: new Date("2026-11-08T10:00:00Z"),
      originalName: null,
      form: "photos",
      fileCount: 2,
      read: false,
    });
    const page1 = await t.service.readPage(alice, recordId, 1);
    expect(page1?.contentType).toBe("image/jpeg");
    expect(await read(page1!.body)).toEqual(jpegBytes("second-taken"));
    expect(await read((await t.service.readPage(alice, recordId, 2))!.body)).toEqual(jpegBytes("first-taken"));
    expect(await t.service.readPage(alice, recordId, 3)).toBeNull();
    expect(await t.service.readPage(alice, recordId, 0)).toBeNull();
  });

  it("treats another Person's Record as if it does not exist", async () => {
    const { recordId } = (await t.service.upload(alice, [{ name: "letter.pdf", bytes: pdfBytes() }])) as { recordId: string };
    expect(await t.service.view(bob, recordId)).toBeNull();
    expect(await t.service.readPage(bob, recordId, 1)).toBeNull();
    expect(await t.service.view(alice, "no-such-record")).toBeNull();
  });

  it("deletes a Record, its event and its files", async () => {
    const { recordId } = (await t.service.upload(alice, [{ name: "letter.pdf", bytes: pdfBytes() }])) as { recordId: string };
    expect(await t.service.delete(alice, recordId)).toBe("deleted");
    expect(await t.service.list(alice)).toEqual([]);
    expect(await t.service.readPage(alice, recordId, 1)).toBeNull();
    expect(await t.pages.listRecordFolders()).toEqual([]);
    expect(t.records.published.at(-1)).toEqual({ type: "RecordDeleted", personId: alice, recordId });
  });

  it("will not delete another Person's Record", async () => {
    const { recordId } = (await t.service.upload(alice, [{ name: "letter.pdf", bytes: pdfBytes() }])) as { recordId: string };
    expect(await t.service.delete(bob, recordId)).toBe("not_found");
    expect((await t.service.list(alice)).map((r) => r.id)).toEqual([recordId]);
    expect(await t.pages.listRecordFolders()).toHaveLength(1);
  });

  it("still deletes the Record when its files cannot be removed, leaving them for the sweep", async () => {
    const { recordId } = (await t.service.upload(alice, [{ name: "letter.pdf", bytes: pdfBytes() }])) as { recordId: string };
    t.pages.failNextDelete(new Error("storage unavailable"));
    expect(await t.service.delete(alice, recordId)).toBe("deleted");
    expect(await t.service.list(alice)).toEqual([]);
    expect(await t.pages.listRecordFolders()).toHaveLength(1);
  });

  it("sweeps files with no Record once they are over an hour old, and never touches held Records", async () => {
    const { recordId: kept } = (await t.service.upload(alice, [{ name: "kept.pdf", bytes: pdfBytes("kept") }])) as { recordId: string };
    // Left behind by an Erasure or Deletion whose file removal failed, or an Upload in progress.
    await t.pages.put("person-erased", "record-orphan", [{ contentType: "application/pdf", bytes: pdfBytes("orphan") }]);

    t.clock.advance(60 * 60_000);
    expect(await t.service.sweep()).toBe(0); // exactly an hour old: still possibly in progress

    t.clock.advance(1);
    expect(await t.service.sweep()).toBe(1);
    expect((await t.pages.listRecordFolders()).map((f) => f.recordId)).toEqual([kept]);
  });
});
