import { memoryPageStore, memoryRecordRepository } from "./memory";
import { pageStoreContract } from "./pageStore.contract";
import { recordRepositoryContract } from "./recordRepository.contract";

recordRepositoryContract("in-memory", async () => {
  const repo = memoryRecordRepository();
  return { repo, published: () => repo.published, persons: ["person-alice", "person-bob"] };
});

pageStoreContract("in-memory", async () => memoryPageStore(() => new Date()));
