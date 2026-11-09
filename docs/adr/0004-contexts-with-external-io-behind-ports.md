---
status: accepted
---

# Contexts with external I/O sit behind ports with in-memory adapters; Identity stays direct

Records stores data in two places, Postgres and R2, that cannot share a transaction, and we build it test-first. So its use cases depend on two ports: `RecordRepository` (Drizzle adapter) and `PageStore` (R2 adapter). Each port also has an in-memory adapter. Service tests run against the in-memory adapters, so they are fast and need no database. One contract test suite per port runs against both the in-memory and the real adapter, so the two cannot drift apart. The in-memory adapters are working fakes, not call-recording mocks, and only tests use them; local dev uses Void's local Postgres and R2.

Identity calls `db` directly and stays that way. Its logic is thin over Better Auth and is mostly tested through the real database. Migrating it now would cost more than it gives back.

## Consequences

- Two styles exist side by side. New contexts that touch storage, AI providers or other external I/O (Records, Extraction, Q&A) use ports. A context that only reads and writes its own Postgres tables may call `db` directly.
- `PageStore` also implements Identity's `PersonFiles` port, so Erasure deletes stored files through it.
- Cross-context events still run in-process inside the caller's transaction (ADR 0002). The Drizzle repository takes the transaction so events can join it.
