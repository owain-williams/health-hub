import { afterAll, describe, expect, it } from "vite-plus/test";
import { persons } from "@schema";
import { on } from "../../src/application/events";
import type { RecordDeleted, RecordUploaded } from "../../src/domains/records/events";
import { recordRepositoryContract } from "../../src/application/records/recordRepository.contract";
import { drizzleRecordRepository } from "./recordRepository";
import { resetRecordsTables, testDatabase } from "./testDatabase";

let published: (RecordUploaded | RecordDeleted)[] = [];
let failHandler: Error | null = null;
on("RecordUploaded", async (event) => {
  if (failHandler) throw failHandler;
  published.push(event);
});
on("RecordDeleted", async (event) => void published.push(event));

async function setup() {
  const { db } = await testDatabase();
  await resetRecordsTables(db);
  published = [];
  failHandler = null;
  const rows = await db
    .insert(persons)
    .values([
      { accountId: "account-alice", name: "Alice" },
      { accountId: "account-bob", name: "Bob" },
    ])
    .returning({ id: persons.id });
  return { db, repo: drizzleRecordRepository(db), published: () => published, persons: [rows[0].id, rows[1].id] as [string, string] };
}

recordRepositoryContract("Drizzle on Postgres", setup);

describe("Drizzle RecordRepository", () => {
  afterAll(async () => (await testDatabase()).pool.end());

  it("does not keep the Record when a RecordUploaded handler fails, because both share one transaction", async () => {
    const { repo, persons: [alice] } = await setup();
    const id = crypto.randomUUID();
    failHandler = new Error("downstream handler failed");
    await expect(
      repo.add(
        { id, personId: alice, form: "pdf", originalName: "a.pdf", fileCount: 1, contentHash: "h", kind: null, recordDate: null, uploadedAt: new Date() },
        { type: "RecordUploaded", personId: alice, recordId: id },
      ),
    ).rejects.toThrow("downstream handler failed");
    expect(await repo.get(alice, id)).toBeNull();
  });
});
