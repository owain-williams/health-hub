---
status: accepted
---

# Identity is delegated to Void-managed Better Auth; an Account is its `user`

Health Hub uses Void's built-in authentication, which configures Better Auth inside our Worker and stores its tables in our Postgres database (so ADR 0001 covers them). We chose this over our own credential handling or an external identity provider because it keeps credentials in the UK/EU database, needs no extra vendor, and gives us passkeys, TOTP and Verification as plugins.

An **Account** is Better Auth's `user` row, and `AccountId` is `user.id`. There is no separate accounts table. Better Auth's own `account` table holds credential and provider links and is **not** an Account; it never appears in domain code or UI copy.

A **Person** is created at sign-up, from a Better Auth `databaseHooks.user.create.after` hook. Void's Better Auth adapter runs without database transactions, so this hook runs after the `user` row is written rather than inside the same transaction. If creating the Person fails, the hook deletes the new Account and sign-up fails, so an Account never persists without its Person. The edge treats a signed-in Account with no Person as a server error, never as a state to handle. The Person's name starts as a copy of the Account's name.

Authorisation happens once, at the edge: middleware resolves the session to an Account, then follows Holds to the Person. Use cases take a `PersonId` only, never an `AccountId`, a session or a Person id taken from the URL or body. In v1 there are no roles. Sharing and carers will extend Holds at this single seam.

## Consequences

- Moving off Better Auth means migrating its `user`, `account`, `session` and `verification` tables and every `AccountId` reference.
- Sign-up failures inside the hook delete the new Account and fail the sign-up (compensation, not a rollback); there is no "Account without Person" state to handle.
- Better Auth's own tables are not in `db/schema.ts`, so Identity reads and deletes them with raw SQL (sessions, passkeys, Erasure). Their deletes cascade from `user`.
- Erasure is our own use case, not Better Auth's delete-user endpoint (which stays disabled): it checks for a Recent Sign-in, deletes every Identity row and the `user` row in one database transaction, then removes the `persons/<PersonId>/` storage prefix after commit, with a sweep for orphaned prefixes (no new background job; ADR 0002 stands).
- Auth tables appear in checked-in migrations via `void db generate`, not in `db/schema.ts`.
