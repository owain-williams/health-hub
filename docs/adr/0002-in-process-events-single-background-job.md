---
status: accepted
---

# Contexts communicate through in-process domain events; extraction is the only background job

Health Hub runs as one Worker over one Postgres database. Bounded contexts talk through domain events dispatched in-process within the triggering transaction, not through queues or HTTP between contexts. The single exception is the Extraction Run, which runs as a background job because it calls external AI providers and can take seconds to minutes. We chose this over Cloudflare Queues between every context because v1 has one deployable, and queues would add delivery semantics and failure modes with no consumer that needs them yet.

## Consequences

- Cross-context work is transactional by default; a failing downstream handler fails the whole operation.
- Moving a context to its own deployable later means introducing a queue at that one seam, with the event contract already defined.
